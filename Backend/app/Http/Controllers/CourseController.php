<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Student;
use App\Models\Level;
use App\Models\EducationLevel;
use App\Models\Semester;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function createCourse(Request $request)
    {
        $request->validate([
            'course_name' => 'required|string|max:255|unique:courses,course_name',
        ]);

        $course = Course::create(['course_name' => $request->course_name]);

        return response()->json([
            'message' => 'Course created successfully',
            'course' => $course
        ], 201);
    }

    public function getAllData() {
        return response()->json([
            'education_levels' => EducationLevel::all(),
            'courses' => Course::all(),
            'semesters' => Semester::all()
        ]);
    }

    public function getAllCourses()
    {
        return response()->json(Course::all());
    }

    public function enrollStudent(Request $request, Student $student)
    {
        $request->validate([
            'course_name' => 'required|string|max:255',
            'semester' => 'required|string|max:255',
        ]);

        $course = Course::where('course_name', $request->course_name)->first();

        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        if ($student->courses()->where('course_id', $course->id)->exists()) {
            return response()->json(['message' => 'Student is already enrolled in this course'], 409);
        }

        $student->courses()->attach($course->id, ['semester' => $request->semester]);

        return response()->json(['message' => 'Student enrolled successfully']);
    }

    public function getEnrolledCourses(Student $student)
    {
        return response()->json($student->courses);
    }
}
