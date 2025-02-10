<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class TwoFactorController extends Controller
{
    public function index()
    {
        return view('auth.two_factor');
    }

    public function verify(Request $request)
    {
        $request->validate([
            'two_factor_code' => 'required|integer',
        ]);

        $user = User::find(session('user_id'));

        if (!$user) {
            return redirect('http://localhost:5173/login?error=Session expired, please login again.');
        }

        if ($user->two_factor_code == $request->two_factor_code && $user->two_factor_expires_at > now()) {
            session()->forget('user_id'); // Remove session after verification
            $user->resetTwoFactorCode();

            // Log the user in
            Auth::login($user);
            $token = $user->createToken('authToken')->plainTextToken;

            return redirect("http://localhost:5173/dashboard?token={$token}");
        }

        return redirect()->back()->withErrors(['two_factor_code' => 'The verification code is incorrect or expired.']);
    }
}

