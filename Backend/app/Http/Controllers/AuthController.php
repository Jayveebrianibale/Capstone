<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\VerificationCode;
use App\Mail\VerificationCodeMail;
use Illuminate\Support\Facades\Mail;


class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'User registered successfully', 'user' => $user], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user && Hash::check($request->password, $user->password)) {

            $code = rand(100000, 999999);

            VerificationCode::create([
                'email' => $request->email,
                'code' => $code,
            ]);

            Mail::to($request->email)->send(new VerificationCodeMail($code));

            return response()->json(['message' => 'Verification code sent'], 200);
        } else {
            return response()->json(['message' => 'Invalid email or password'], 401);
        }
    }

    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required',
        ]);
    
        $verificationCode = VerificationCode::where('email', $request->email)
                                             ->where('code', $request->code)
                                             ->first();
    
        if ($verificationCode) {
      
            $verificationCode->delete();
          
            $user = User::where('email', $request->email)->first();
            return response()->json([
                'message' => 'Verification successful',
                'user' => $user
            ], 200);
        } else {
            return response()->json(['message' => 'Invalid verification code'], 401);
        }
    }
}    
