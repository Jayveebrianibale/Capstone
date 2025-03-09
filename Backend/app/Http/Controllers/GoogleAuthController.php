<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
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
        $user = User::where('email', $googleUser->email)->first();

        if (!$user) {
            if (str_contains($googleUser->email, '@student')) {
                $role = 'Student';
            } elseif (str_contains($googleUser->email, '@laverdad')) {
                $role = 'Instructor';
            } elseif (str_contains($googleUser->email, '@gmail')) {
                $role = 'Admin';
            } else {
                $role = 'Student';
            }

            $user = User::create([
                'name' => $googleUser->name,
                'email' => $googleUser->email,
                'google_id' => $googleUser->id,
                'profile_picture' => $googleUser->avatar,
                'role' => $role,
                'password' => bcrypt('defaultpassword'),
            ]);
        }

        $token = $user->createToken('authToken')->plainTextToken;

        return redirect("http://localhost:5173/login?token={$token}");
    } catch (Exception $e) {
        return response()->json(['error' => 'Authentication failed'], 500);
    }
}
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}
