<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\User; // Ensure correct namespace for User model

class UserController extends Controller
{
    public function uploadProfilePicture(Request $request)
    {
        $request->validate([
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = Auth::user();
        $file = $request->file('profile_picture');
        $fileName = time() . '.' . $file->getClientOriginalExtension();
        $filePath = $file->storeAs('profile_pictures', $fileName, 'public');

        // Update the user's profile picture path
        $user->profile_picture = $filePath;

        return response()->json(['message' => 'Profile picture uploaded successfully', 'profile_picture' => $filePath]);
    }
}
