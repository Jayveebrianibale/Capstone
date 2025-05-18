<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Exception;

class GoogleAuthController extends Controller
{
    // Redirect the user to Google's OAuth page
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    // Handle the callback from Google after user authenticates
    public function handleGoogleCallback()
    {
        try {
            // Get user info from Google
            $googleUser = Socialite::driver('google')->stateless()->user();

            // Check if the user already exists
            $user = User::where('email', $googleUser->email)->first();

            // If user doesn't exist, create a new one
            if (!$user) {
                // Only allow this exact email for instructor
                if ($googleUser->getEmail() === 'evaluationsystem2025@gmail.com') {
                    $role = 'Instructor';
                } elseif (str_contains($googleUser->email, '@student')) {
                    $role = 'Student';
                } elseif (str_contains($googleUser->email, '@gmail')) {
                    $role = 'Admin';
                } else {
                    $role = 'Student';
                }

                // Create a new user
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'profile_picture' => null,
                    'role' => $role,
                    'password' => bcrypt('defaultpassword'),
                    'profile_completed' => false, // New users start with an incomplete profile
                ]);

                // Download and store the user's Google profile picture
                $localAvatar = $this->storeGoogleAvatar($googleUser->avatar, $user->id);
                $user->update(['profile_picture' => $localAvatar]);
            }

            // Create a new authentication token for the user
            $token = $user->createToken('authToken')->plainTextToken;

            // Redirect the user to the frontend app with the token
            return redirect("http://localhost:5173/login?token={$token}");

        } catch (Exception $e) {
            // Return error if something goes wrong
            return response()->json(['error' => 'Authentication failed'], 500);
        }
    }

    // Log out the current user by revoking all their tokens
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    // Download and save the user's Google avatar locally
    public function storeGoogleAvatar($url, $userId)
    {
        // Get the image from Google
        $imageContent = Http::get($url)->body();

        // Set file name and path
        $filename = "avatars/user-{$userId}.jpg";

        // Save the image to the 'public' disk
        Storage::disk('public')->put($filename, $imageContent);

        // Return the URL of the stored image
        return Storage::url($filename);
    }
}
