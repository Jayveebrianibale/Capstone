<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Instructor;
use Illuminate\Http\Request;

class InstructorController extends Controller
{
    // ✅ Assign an instructor to a course
    public function assignInstructor(Request $request)
    {
        $request->validate([
            'course_name' => 'required|string|max:255',
            'instructor_name' => 'required|string|max:255',
            'instructor_email' => 'required|email|max:255'
        ]);

        $course = Course::where('course_name', $request->course_name)->first();
        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        // Find or create the instructor
        $instructor = Instructor::firstOrCreate(
            ['email' => $request->instructor_email],
            ['name' => $request->instructor_name]
        );

        // Attach instructor to course if not already assigned
        if (!$course->instructors()->where('instructor_id', $instructor->id)->exists()) {
            $course->instructors()->attach($instructor->id);
        }

        return response()->json(['message' => 'Instructor assigned successfully']);
    }

    // ✅ Get instructors assigned to a course
    public function getInstructorsByCourse(Request $request)
    {
        $request->validate([
            'course_name' => 'required|string|max:255'
        ]);

        $course = Course::where('course_name', $request->course_name)->with('instructors')->first();

        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        return response()->json([
            'course' => $course->course_name,
            'instructors' => $course->instructors
        ]);
    }
}
