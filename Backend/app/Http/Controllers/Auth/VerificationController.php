<?php

// app/Http/Controllers/VerificationController.php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    public function verify(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'verification_code' => 'required|string|min:6|max:6',
        ]);

        $user = User::where('email', $request->input('email'))
                    ->where('verification_code', $request->input('verification_code'))
                    ->first();

        if (!$user) {
            return response()->json(['error' => 'Invalid verification code'], 401);
        }

        // Clear the verification code after successful verification
        $user->verification_code = null;
        $user->save();

        return response()->json(['message' => 'Verification successful'], 200);
    }
}