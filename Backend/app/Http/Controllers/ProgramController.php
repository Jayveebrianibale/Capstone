<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\ProgramLevel;
use App\Models\GradeLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:programs,name',
            'category' => 'required|in:Higher_Education,Senior_Hgh,Junior_High,Intermediate',
            'levels' => 'nullable|array',
            'levels.*.name' => 'nullable|string|max:255'
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
    
        if ($request->category === 'Higher_Education') {
            // Save as Program (Higher Education)
            $program = Program::create([
                'name' => $request->name,
                'category' => $request->category
            ]);
    
            // Attach levels if provided
            if ($request->levels) {
                foreach ($request->levels as $level) {
                    $program->levels()->create(['name' => $level['name']]);
                }
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
