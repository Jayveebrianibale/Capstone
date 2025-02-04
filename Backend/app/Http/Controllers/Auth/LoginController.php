<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class LoginController extends Controller
{
    // Redirect to Google
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    // Handle Google Callback
    public function handleGoogleCallback()
    {
        try {
            // Retrieve Google user data
            $googleUser = Socialite::driver('google')->stateless()->user();

            // Log Google user email for debugging
            Log::info('Google Email: ' . $googleUser->getEmail());

            // Restrict login to only La Verdad student emails
            if (!str_ends_with($googleUser->getEmail(), '@student.laverdad.edu.ph')) {
                Log::warning('Unauthorized email attempted: ' . $googleUser->getEmail());
                return redirect('http://localhost:5173/login?error=Use your La Verdad email');
            }

            // Create or update user in the database
            $user = User::updateOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName(),
                    'google_id' => $googleUser->getId(),
                    'profile_picture' => $googleUser->getAvatar(),
                    'password' => bcrypt(str()->random(16)), // Ensures password field is not empty
                ]
            );

            // Log the user in
            Auth::login($user);

            // Generate API token
            $token = $user->createToken('authToken')->plainTextToken;

            // Redirect to frontend with token
            return redirect("http://localhost:5173/dashboard?token={$token}");

        } catch (\Exception $e) {
            // Log the actual error message
            Log::error('Google Authentication Error: ' . $e->getMessage());

            // Redirect with error message
            return redirect('http://localhost:5173/login?error=' . urlencode($e->getMessage()));
        }
    }
}
