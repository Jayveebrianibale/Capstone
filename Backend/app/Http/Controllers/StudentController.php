<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Course;
use Illuminate\Http\Request;
use App\Models\Instructor;

class StudentController extends Controller
{
    // ✅ Create a New Student
    public function createStudent(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:students,email',
        ]);

        $student = Student::create([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return response()->json([
            'message' => 'Student created successfully',
            'student' => $student
        ], 201);
    }

    // ✅ Create a New Course
    public function createCourse(Request $request)
    {
        $request->validate([
            'course_name' => 'required|string|unique:courses,course_name',
        ]);

        $course = Course::create([
            'course_name' => $request->course_name,
        ]);

        return response()->json([
            'message' => 'Course created successfully',
            'course' => $course
        ], 201);
    }

    // ✅ Get Student by ID
    public function getStudent(Student $student)
    {
        return response()->json($student);
    }

    // ✅ Check if Student is Enrolled in Any Course
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

    // ✅ Enroll Student in a Course
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

        // Check if the student is already enrolled in the course
        if ($student->courses()->where('course_id', $course->id)->exists()) {
            return response()->json(['message' => 'Student is already enrolled in this course'], 409);
        }

        // Enroll the student
        $student->courses()->attach($course->id, ['semester' => $request->semester]);

        return response()->json(['message' => 'Course enrolled successfully']);
    }

    // ✅ Get Student's Enrolled Courses
    public function getCourses(Student $student)
    {
        return response()->json($student->courses);
    }

    public function assignInstructor(Request $request)
{
    $request->validate([
        'course_name' => 'required|string',
        'instructor_name' => 'required|string',
        'instructor_email' => 'required|email'
    ]);

    $course = Course::where('course_name', $request->course_name)->first();
    if (!$course) {
        return response()->json(['message' => 'Course not found'], 404);
    }

    // Check if instructor exists, otherwise create
    $instructor = Instructor::firstOrCreate(
        ['email' => $request->instructor_email],
        ['name' => $request->instructor_name]
    );

    // Attach instructor to course
    $course->instructors()->attach($instructor->id);

    return response()->json(['message' => 'Instructor assigned successfully']);
}

public function getInstructorsByCourse(Request $request)
{
    $request->validate([
        'course_name' => 'required|string'
    ]);

    $course = Course::where('course_name', $request->course_name)->first();

    if (!$course) {
        return response()->json(['message' => 'Course not found'], 404);
    }

    return response()->json([
        'course' => $course->course_name,
        'instructors' => $course->instructors
    ]);
}

    // ✅ Get Instructors for Student's Courses
    public function getInstructors(Student $student)
    {
        $instructors = $student->courses()->with('instructors')->get()->pluck('instructors')->flatten();

        return response()->json($instructors);
    }
}
