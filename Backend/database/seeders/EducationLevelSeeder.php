<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EducationLevel;

class EducationLevelSeeder extends Seeder {
    public function run() {
        $levels = ['Higher Education', 'Senior High', 'Junior High', 'Intermediate'];

        foreach ($levels as $level) {
            EducationLevel::create(['name' => $level]);
        }
    }
}
