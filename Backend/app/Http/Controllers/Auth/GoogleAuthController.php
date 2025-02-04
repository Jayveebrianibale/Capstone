<?php

namespace App\Http\Controllers\Auth;

use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class GoogleAuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            // Check if the email domain is valid
            if (!str_ends_with($googleUser->getEmail(), '@student.laverdad.edu.ph')) {
                return redirect('/login')->with('error', 'Use your La Verdad email');
            }

            // Find or create the user
            $user = User::updateOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName(),
                    'google_id' => $googleUser->getId(),
                    'profile_picture' => $googleUser->getAvatar(),
                    'password' => bcrypt(str()->random(16)), 
                    'email_verified_at' => now(), // Mark email as verified
                ]
            );

            // Log the user in
            Auth::login($user);

            // Create token for API
            $token = $user->createToken('authToken')->plainTextToken;

            // Redirect with token
            return redirect("http://localhost:5173/dashboard?token={$token}");
        } catch (\Exception $e) {
            return redirect('/login')->with('error', 'Authentication failed');
        }
    }
}
