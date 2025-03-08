<?php

namespace Database\Seeders;
use App\Models\Student;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        $courses = [
            'BSIS 1',
            'BSIS 2',
            'BSIS 3',
            'BSIS 4'
        ];

        foreach ($courses as $courseName) {
            Course::create(['course_name' => $courseName]);
        }

        $semesters = [
            '1st Semester',
            '2nd Semester'
        ];

        // Seed instructors and assign them to courses
        $courseList = Course::all();
        foreach ($courseList as $course) {
            Instructor::create([
                'name' => 'Prof. ' . $course->course_name,
                'email' => strtolower(str_replace(' ', '', $course->course_name)) . '@laverdad.edu',
                'course_id' => $course->id
            ]);
        }

    {
        Student::create([
            'name' => 'Jayvee Brian',
            'email' => 'jayveebrian@student.com',
        ]);
    }

}
}