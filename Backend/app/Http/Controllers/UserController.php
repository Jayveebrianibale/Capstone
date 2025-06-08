<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{

     // Get all users with the role 'Student'
    public function getAllStudents()
    {
        // Query users where the role is 'Student'
        $students = User::where('role', 'Student')->get();

        // Return the list of students (could return as JSON for an API response)
        return response()->json($students);
    }
    
    // public function uploadProfilePicture(Request $request)
    // {


        
    //     // // Validate the request
    //     // $request->validate([
    //     //     'user_id' => 'required|exists:users,id',
    //     //     'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
    //     // ]);

    //     // // Find the user
    //     // $user = User::find($request->user_id);

    //     // if ($user === null) {
    //     //     return response()->json(['error' => 'User not found'], 404);
    //     // }

    //     // // Handle the uploaded file
    //     // if ($request->hasFile('profile_picture')) {
    //     //     $file = $request->file('profile_picture');
    //     //     $filename = time() . '_' . $file->getClientOriginalName();
    //     //     $path = $file->storeAs('profile_pictures', $filename, 'public');

    //     //     // Update the user's profile picture path
    //     //     $user->profile_picture = $path;
    //     //     $user->save();

    //     //     return response()->json(['success' => 'Profile picture updated successfully'], 200);
    //     // } else {
    //     //     return response()->json(['error' => 'No profile picture uploaded'], 400);
    //     // }


    // }
}