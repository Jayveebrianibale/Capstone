<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Class GoogleAuthController
 * Handles Google OAuth authentication and user management.
 */
class GoogleAuthController extends Controller
{
    /**
     * Redirects the user to Google's OAuth authentication page.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    /**
     * Handles the callback from Google after authentication.
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    public function handleGoogleCallback()
    {
        try {
            // Retrieve user info from Google
            $googleUser = Socialite::driver('google')->stateless()->user();

            // Check if user already exists
            $user = User::where('email', $googleUser->email)->first();

            // If not, create a new user with a role based on email domain
            if (!$user) {
                if (str_contains($googleUser->email, '@student')) {
                    $role = 'Student';
                } elseif (str_contains($googleUser->email, '@laverdad')) {
                    $role = 'Instructor';
                } elseif (str_contains($googleUser->email, '@gmail')) {
                    $role = 'Admin';
                } else {
                    $role = 'Student'; // Default role
                }

                // Create a new user record
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'profile_picture' => null,
                    'role' => $role,
                    'password' => bcrypt('defaultpassword'),
                    'profile_completed' => false, // Default as false for new users
                ]);

                // Download and store the user's Google avatar locally
                $localAvatar = $this->storeGoogleAvatar($googleUser->avatar, $user->id);
                $user->update(['profile_picture' => $localAvatar]);
            }

            // Generate a new token for the user
            $token = $user->createToken('authToken')->plainTextToken;

            // Redirect user to the frontend with the generated token
            return redirect("http://localhost:5173/login?token={$token}");
        } catch (Exception $e) {
            // Return error response on failure
            return response()->json(['error' => 'Authentication failed'], 500);
        }
    }

    /**
     * Logs out the authenticated user by revoking all tokens.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    /**
     * Downloads and stores the user's Google avatar in the local storage.
     *
     * @param  string  $url  The URL of the avatar image.
     * @param  int  $userId  The ID of the user.
     * @return string  The public URL of the stored avatar image.
     */
    public function storeGoogleAvatar($url, $userId)
    {
        // Download the avatar image content
        $imageContent = \Illuminate\Support\Facades\Http::get($url)->body();

        // Define the local file path for storage
        $filename = "avatars/user-{$userId}.jpg";

        // Save the image content to the public disk
        \Illuminate\Support\Facades\Storage::disk('public')->put($filename, $imageContent);

        // Return the public URL to the stored image
        return \Illuminate\Support\Facades\Storage::url($filename);
    }
}
