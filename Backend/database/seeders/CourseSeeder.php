<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;

class CourseSeeder extends Seeder
{
    public function run()
    {
        $courses = [
            'BS Information System',
            'BS in Accountancy',
            'Associate in Computer Technology',
            'BA Broadcasting',
            'BS Social Work',
            'BS Accounting Information System',
        ];

        foreach ($courses as $courseName) {
            Course::firstOrCreate(['course_name' => $courseName]);
        }
    }
}
