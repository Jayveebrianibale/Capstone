<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GradeLevel;
use App\Models\Program;

class GradeLevelController extends Controller
{
    // Get all Grade Levels
    public function index()
    {
        $gradeLevels = GradeLevel::with('program')->get();
        return response()->json($gradeLevels);
    }

    // Store a new Grade Level
    public function store(Request $request)
    {
        $request->validate([
            'program_id' => 'required|exists:programs,id',
            'name' => 'required|string'
        ]);

        // Check if this grade level already exists for this program
        $existingGradeLevel = GradeLevel::where('program_id', $request->program_id)
            ->where('name', $request->name)
            ->first();

        if ($existingGradeLevel) {
            return response()->json([
                'message' => 'This grade level already exists for this program'
            ], 422);
        }

        $gradeLevel = GradeLevel::create([
            'program_id' => $request->program_id,
            'name' => $request->name
        ]);

        return response()->json([
            'message' => 'Strand/Grade Level added successfully',
            'data' => $gradeLevel
        ]);
    }

    // Update a Grade Level
    public function update(Request $request, $id)
    {
        $gradeLevel = GradeLevel::find($id);

        if (!$gradeLevel) {
            return response()->json(['message' => 'Grade Level not found'], 404);
        }

        $request->validate([
            'name' => 'required|string',
            'program_id' => 'required|exists:programs,id'
        ]);

        // Check if this grade level already exists for this program (excluding current grade level)
        $existingGradeLevel = GradeLevel::where('program_id', $request->program_id)
            ->where('name', $request->name)
            ->where('id', '!=', $id)
            ->first();

        if ($existingGradeLevel) {
            return response()->json([
                'message' => 'This grade level already exists for this program'
            ], 422);
        }

        $gradeLevel->update([
            'program_id' => $request->program_id,
            'name' => $request->name
        ]);

        return response()->json([
            'message' => 'Strand/Grade Level updated successfully',
            'data' => $gradeLevel
        ]);
    }

    // Delete a Grade Level
    public function destroy($id)
    {
        $gradeLevel = GradeLevel::find($id);

        if (!$gradeLevel) {
            return response()->json(['message' => 'Grade Level not found'], 404);
        }

        $gradeLevel->delete();

        return response()->json(['message' => 'Strand/Grade Level deleted successfully']);
    }
}
