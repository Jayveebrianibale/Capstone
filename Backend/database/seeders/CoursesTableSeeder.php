<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;

class CoursesTableSeeder extends Seeder
{
    public function run()
    {
        $courses = [
            'BS Information System',
            'BS Computer Science',
            'BS Information Technology',
            'BS Business Administration',
            'BS Accounting',
            'BS Education',
        ];

        foreach ($courses as $course) {
            Course::firstOrCreate(['course_name' => $course]);
        }
    }
}


