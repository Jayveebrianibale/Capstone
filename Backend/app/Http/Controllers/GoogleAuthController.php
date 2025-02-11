<?php

namespace App\Http\Controllers;

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

            $user = User::updateOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName(),
                    'google_id' => $googleUser->getId(),
                    'profile_picture' => $googleUser->getAvatar(),
                    'password' => bcrypt(str()->random(16)), 
                    'email_verified_at' => now(),
                ]
            );

            Auth::login($user);
            $token = $user->createToken('authToken')->plainTextToken;

            return redirect("http://localhost:5173/dashboard?token={$token}");
        } catch (\Exception $e) {
            return redirect('/login')->with('error', 'Authentication failed');
        }
    }
}
