<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\ProgramLevel;
use App\Models\GradeLevel;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function index()
    {
        return response()->json([
            'programs' => Program::with('levels')->get(),
            'grade_levels' => GradeLevel::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:programs,name',
            'category' => 'required|in:higher_education,senior_high,junior_high,intermediate',
            'levels' => 'array',
            'levels.*.name' => 'string|max:255'
        ]);

        if ($request->category === 'higher_education') {
            // Save as Program (Higher Education)
            $program = Program::create([
                'name' => $request->name,
                'category' => $request->category
            ]);

            // Attach levels (1st Year, 2nd Year, etc.)
            foreach ($request->levels as $level) {
                $program->levels()->create(['name' => $level['name']]);
            }

            return response()->json(['message' => 'Higher Education Program created', 'program' => $program->load('levels')], 201);
        } else {
            // Save as Grade Level (Basic Ed)
            $gradeLevel = GradeLevel::create([
                'name' => $request->name,
                'category' => $request->category
            ]);

            return response()->json(['message' => 'Grade Level created', 'grade_level' => $gradeLevel], 201);
        }
    }

    public function destroy($id)
    {
        $program = Program::find($id);
        if ($program) {
            $program->delete();
            return response()->json(['message' => 'Program deleted'], 200);
        }

        $gradeLevel = GradeLevel::find($id);
        if ($gradeLevel) {
            $gradeLevel->delete();
            return response()->json(['message' => 'Grade Level deleted'], 200);
        }

        return response()->json(['message' => 'Not Found'], 404);
    }
}
