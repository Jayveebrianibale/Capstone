<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Instructor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Student;
use App\Models\User; 

class InstructorController extends Controller
{
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

        $instructor = Instructor::firstOrCreate(
            ['email' => $request->instructor_email],
            ['name' => $request->instructor_name]
        );

        
        if (!$course->instructors()->where('instructor_id', $instructor->id)->exists()) {
            $course->instructors()->attach($instructor->id);
        }

        return response()->json(['message' => 'Instructor assigned successfully']);
    }


    
    public function getInstructorsByCourse(Request $request)
    {
        $user = auth()->user();
        $userId = $user->id;

    
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
    
        if ($user->role !== 'Student') {
            return response()->json(['message' => 'Access denied'], 403);
        }
    
        $courses = Course::join('course_student', 'courses.id', '=', 'course_student.course_id')
        ->where('course_student.student_id', $userId)
        ->pluck('courses.id');

    
        if ($courses->isEmpty()) {
            return response()->json(['message' => 'No courses found'], 404);
        }
    
        $instructors = Instructor::whereHas('courses', function ($query) use ($courses) {
            $query->whereIn('courses.id', $courses);
        })->get();
    
        return response()->json($instructors);
    }
    
    

}
