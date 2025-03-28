<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\ProgramLevel;
use App\Models\GradeLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProgramController extends Controller {
    // Get all programs with levels
    public function index() {
        $programs = Program::with('levels')->get();
        return response()->json(['programs' => $programs]);
    }

    // Create a new program
    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:programs,code',
            'yearLevel' => 'required|string|in:1st Year,2nd Year,3rd Year,4th Year',
        ]);

        $program = Program::create($validated);
        return response()->json(['message' => 'Program created successfully', 'program' => $program], 201);
    }

    // Get a single program
    public function show($id) {
        $program = Program::with('levels')->findOrFail($id);
        return response()->json($program);
    }

    // Update a program
    public function update(Request $request, $id) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:255',
            'category' => 'required|string'
        ]);

        $program = Program::findOrFail($id);
        $program->update($validated);

        return response()->json(['message' => 'Program updated successfully']);
    }

    // Delete a program
    public function destroy($id) {
        $program = Program::findOrFail($id);
        $program->delete();

        return response()->json(['message' => 'Program deleted successfully']);
    }
}