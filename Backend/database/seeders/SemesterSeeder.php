<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Semester;

class SemesterSeeder extends Seeder {
    public function run() {
        $semesters = ['1st Semester', '2nd Semester'];

        foreach ($semesters as $sem) {
            Semester::create(['name' => $sem]);
        }
    }
}

