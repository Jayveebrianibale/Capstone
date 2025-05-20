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
            $googleUser = Socialite::driver('google')->stateless()->user();
            $email = $googleUser->getEmail();

            // Determine role based on email
            $role = null;

            if ($email === 'jayveebrianibale29@gmail.com') {
                $role = 'Instructor';
            } elseif (str_contains($email, '@student')) {
                // Only allow students from @student.laverdad.edu.ph
                if (str_ends_with($email, '@student.laverdad.edu.ph')) {
                    $role = 'Student';
                } else {
                    return response()->json([
                        'error' => 'Only @student.laverdad.edu.ph student emails are allowed.'
                    ], 403);
                }
            } elseif ($email === 'evaluationsystem2025@gmail.com') {
                $role = 'Admin';
            } else {
                return response()->json([
                    'error' => 'Unauthorized email domain.'
                ], 403);
            }

            // Check if user exists
            $user = User::where('email', $email)->first();

            if (!$user) {
                // Create new user
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $email,
                    'google_id' => $googleUser->id,
                    'profile_picture' => null,
                    'role' => $role,
                    'password' => bcrypt('defaultpassword'),
                    'profile_completed' => false,
                ]);

                // Save avatar
                $localAvatar = $this->storeGoogleAvatar($googleUser->avatar, $user->id);
                $user->update(['profile_picture' => $localAvatar]);
            }

            // Generate token
            $token = $user->createToken('authToken')->plainTextToken;

            // Redirect to frontend
            return redirect("http://localhost:5173/login?token={$token}");
        } catch (Exception $e) {
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
