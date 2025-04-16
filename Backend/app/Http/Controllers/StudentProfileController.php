<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentProfileController extends Controller
{
    public function setupProfile(Request $request)
    {
        $validated = $request->validate([
            'educationLevel' => 'required|string|in:Higher Education,Senior High,Junior High,Intermediate',
            'selectedOption' => 'required|string',
            'yearLevel' => 'nullable|string|in:1st Year,2nd Year,3rd Year,4th Year',
        ]);

        if ($validated['educationLevel'] === 'Higher Education' && empty($validated['yearLevel'])) {
            return response()->json(['error' => 'Year Level is required for Higher Education.'], 422);
        }

        $user = Auth::user();
        
        $user->update([
            'education_level' => $validated['educationLevel'],
            'course_id' => $validated['selectedOption'], 
            'semester' => $validated['yearLevel'] ?? null,
            'profile_completed' => true, 
        ]);

        return response()->json([
            'message' => 'Profile setup successful',
            'profile_completed' => true,
            'user' => $user
        ]);
    }

    public function getUser()
    {
        $user = Auth::user();
        return response()->json($user);
    }
}
