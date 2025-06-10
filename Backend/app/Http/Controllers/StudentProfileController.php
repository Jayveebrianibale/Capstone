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
            'selectedOption' => 'required|string',
            'yearLevel' => 'required_if:educationLevel,Higher Education|nullable|string|in:1st Year,2nd Year,3rd Year,4th Year',
        ]);

        $user = Auth::user();
        
        // Look up program for both Higher Education and non-Higher Education
        $program = Program::where('name', $validated['selectedOption'])
                         ->orWhere('id', $validated['selectedOption'])
                         ->first();

        if (!$program) {
            \Log::error('Program not found:', [
                'selectedOption' => $validated['selectedOption'],
                'educationLevel' => $validated['educationLevel']
            ]);
            return response()->json(['error' => 'Selected program not found.'], 404);
        }

        // For Higher Education, validate year level
        if ($validated['educationLevel'] === 'Higher Education') {
            if (!$validated['yearLevel']) {
                return response()->json(['error' => 'Year level is required for Higher Education.'], 422);
            }
            $yearLevel = $validated['yearLevel'];
        } else {
            $yearLevel = null; // Explicitly set to null for non-Higher Education
        }
        
        $user->update([
            'educationLevel' => $validated['educationLevel'],
            'program_id' => $program->id,
            'program_name' => $program->name,
            'yearLevel' => $yearLevel,
            'profile_completed' => true,
        ]);

        \Log::info('Profile setup successful:', [
            'user_id' => $user->id,
            'education_level' => $validated['educationLevel'],
            'program_id' => $program->id,
            'program_name' => $program->name,
            'year_level' => $yearLevel
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
