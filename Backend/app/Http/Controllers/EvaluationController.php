<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Instructor;
use App\Models\Course;

class EvaluationController extends Controller
{
    public function getStudentInstructors()
    {
        $student = Auth::user(); // Get the authenticated student

        if (!$student) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Assuming there's a `course_id` in the students table
        $instructors = Instructor::where('course_id', $student->course_id)->get();

        return response()->json($instructors);
    }
}
