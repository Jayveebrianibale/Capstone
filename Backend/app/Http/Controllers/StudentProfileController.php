<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Program; // Import the Program model

class StudentProfileController extends Controller

{
    // Student Setup Profile
    public function setupProfile(Request $request)
    {
        $validated = $request->validate([
            'educationLevel' => 'required|string|in:Higher Education,Senior High,Junior High,Intermediate',
            'selectedOption' => 'required|string', // This is program_id
            'yearLevel' => 'nullable|string|in:1st Year,2nd Year,3rd Year,4th Year',
        ]);

        if ($validated['educationLevel'] === 'Higher Education' && empty($validated['yearLevel'])) {
            return response()->json(['error' => 'Year Level is required for Higher Education.'], 422);
        }

        $user = Auth::user();
        $program = Program::find($validated['selectedOption']);

        if (!$program) {
            return response()->json(['error' => 'Selected program not found.'], 404);
        }
        
            $user->update([
            'educationLevel' => $validated['educationLevel'],
            'program_id' => $validated['selectedOption'],
            'program_name' => $program->name, // Add program_name
            'yearLevel' => $validated['yearLevel'] ?? null,
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
