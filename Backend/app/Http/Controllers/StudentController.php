<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
//     public function createStudent(Request $request)
//     {
//         $request->validate([
//             'name' => 'required|string|max:255',
//             'email' => 'required|string|email|unique:students,email|max:255',
//         ]);

//         $student = Student::create($request->only(['name', 'email']));

//         return response()->json([
//             'message' => 'Student created successfully',
//             'student' => $student
//         ], 201);
//     }

//     public function registerStudent(Request $request)
// {
//     $request->validate([
//         'name' => 'required|string',
//         'email' => 'required|string|email|unique:students,email',
//         'education_level' => 'required|string',
//         'course_name' => 'required|string',
//         'semester' => 'required|string'
//     ]);

    
//     $course = Course::where('course_name', $request->course_name)->first();
//     if (!$course) {
//         return response()->json(['message' => 'Course not found'], 404);
//     }

 
//     $student = Student::create([
//         'name' => $request->name,
//         'email' => $request->email,
//         'education_level' => $request->education_level, 
//     ]);


//     $student->courses()->attach($course->id, ['semester' => $request->semester]);

//     return response()->json([
//         'message' => 'Student registered and enrolled successfully',
//         'student' => $student
//     ], 201);
// }



//     public function getStudent(Student $student)
//     {
//         return response()->json($student);
//     }

//     public function checkEnrollment(Student $student)
//     {
//         $isEnrolled = $student->courses()->exists();

//         return response()->json([
//             'message' => $isEnrolled
//                 ? 'Student is already enrolled.'
//                 : 'No courses found. Please select a course and semester.',
//             'redirect' => !$isEnrolled
//         ]);
//     }

//     public function getInstructors(Student $student)
//     {
//         $instructors = $student->courses()->with('instructors')->get()->pluck('instructors')->flatten();
    
//         return response()->json([
//             'student' => $student->name,
//             'instructors' => $instructors
//         ]);
//     }

//     public function getSetupOptions()
// {
//     return response()->json([
//         'educationLevels' => ["Higher Education", "Senior High", "Junior High", "Intermediate"],
//         'courses' => Course::all(),
//         'semesters' => ["1st Semester", "2nd Semester"]
//     ]);
// }

// public function getStudentCourses($userId)
// {
//     $courses = Course::join('course_student', 'courses.id', '=', 'course_student.course_id')
//     ->where('course_student.user_id', 1)
//     ->select('courses.id')
//     ->get();
//     return response()->json($courses);
// }
    
}

