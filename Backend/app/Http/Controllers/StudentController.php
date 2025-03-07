<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Course;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function getStudent($student_id)
{
    // Find the student by ID
    $student = Student::find($student_id);

    if (!$student) {
        return response()->json(['message' => 'Student not found'], 404);
    }

    return response()->json($student);
}

    public function checkEnrollment(Student $student)
    {
        if ($student->courses()->count() == 0) {
            return response()->json([
                'message' => 'No courses found. Please select a course and semester.',
                'redirect' => true
            ]);
        }

        return response()->json([
            'message' => 'Student is already enrolled.',
            'redirect' => false
        ]);
    }

    
    public function enroll(Request $request, Student $student)
    {
        $request->validate([
            'course_name' => 'required|string',
            'semester' => 'required|string',
        ]);
    
        // Find the course by name
        $course = Course::where('course_name', $request->course_name)->first();
    
        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }
    
        // Enroll the student
        $student->courses()->attach($course->id, ['semester' => $request->semester]);
    
        return response()->json(['message' => 'Course enrolled successfully']);
    }
    

    

    
    public function getCourses(Student $student)
    {
        return response()->json($student->courses);
    }

    public function getInstructors(Student $student)
    {
        $instructors = $student->courses()->with('instructors')->get()->pluck('instructors')->flatten();
        return response()->json($instructors);
    }
}

