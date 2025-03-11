<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function getUser(Request $request)
    {
        return response()->json(Auth::user());
    }
    public function user(Request $request)
{
    $user = $request->user();

    return response()->json([
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'role' => $user->role,
        'has_profile' => (bool) $user->profile_completed,
    ]);
}

}
