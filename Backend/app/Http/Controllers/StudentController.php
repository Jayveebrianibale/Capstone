<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function createStudent(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:students,email|max:255',
        ]);

        $student = Student::create($request->only(['name', 'email']));

        return response()->json([
            'message' => 'Student created successfully',
            'student' => $student
        ], 201);
    }

    public function registerStudent(Request $request)
{
    $request->validate([
        'name' => 'required|string',
        'email' => 'required|string|email|unique:students,email',
        'education_level' => 'required|string',
        'course_name' => 'required|string',
        'semester' => 'required|string'
    ]);

    
    $course = Course::where('course_name', $request->course_name)->first();
    if (!$course) {
        return response()->json(['message' => 'Course not found'], 404);
    }

 
    $student = Student::create([
        'name' => $request->name,
        'email' => $request->email,
        'education_level' => $request->education_level,
    ]);


    $student->courses()->attach($course->id, ['semester' => $request->semester]);

    return response()->json([
        'message' => 'Student registered and enrolled successfully',
        'student' => $student
    ], 201);
}

public function setupProfile(Request $request)
{
    try {
        
        $validatedData = $request->validate([
            'educationLevel' => 'required|string|max:255',
            'selectedCourse' => 'required|integer|exists:courses,id',
            'semester' => 'required|string|max:255',
        ]);

        
        $student = auth()->user();
        if (!$student) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

       
        if ($student->profile) {
            return response()->json(['message' => 'Profile already exists'], 409);
        }

       
        $student->profile()->create([
            'education_level' => $validatedData['educationLevel'],
            'course_id' => $validatedData['selectedCourse'],
            'semester' => $validatedData['semester'],
        ]);

        return response()->json(['message' => 'Profile setup successful'], 201);
    
    } catch (\Exception $e) {
        \Log::error('Profile setup error: ' . $e->getMessage());

        return response()->json(['message' => 'Server error, check logs'], 500);
    }
}



   
    public function getStudent(Student $student)
    {
        return response()->json($student);
    }

    public function checkEnrollment(Student $student)
    {
        $isEnrolled = $student->courses()->exists();

        return response()->json([
            'message' => $isEnrolled
                ? 'Student is already enrolled.'
                : 'No courses found. Please select a course and semester.',
            'redirect' => !$isEnrolled
        ]);
    }

    public function getInstructors(Student $student)
    {
        $instructors = $student->courses()->with('instructors')->get()->pluck('instructors')->flatten();
    
        return response()->json([
            'student' => $student->name,
            'instructors' => $instructors
        ]);
    }
    
}
