<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;

class ProgramController extends Controller {
    // Get all programs with levels
    public function index() {
        $programs = Program::with('levels')->get();
        return response()->json(['programs' => $programs]);
    }

    // Create a new program
    public function store(Request $request) {
        $request->validate([
            'name' => 'required|string|unique:programs',
            'code' => 'required|string|unique:programs',
            'yearLevel' => 'nullable|string',
            'category' => 'nullable|string',
        ]);

        $program = Program::create([
            'name' => $request->name,
            'code' => $request->code,
            'yearLevel' => $request->yearLevel,
            'category' => ucwords(str_replace('_', ' ', $request->category)),
        ]);

        return response()->json([
            'message' => 'Program created successfully',
            'program' => $program
        ], 201);
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
            'yearLevel' => 'nullable|string',
            'category' => 'required|string'
        ]);
    
        $program = Program::findOrFail($id);
        $program->update($validated);
    
        
        return response()->json([
            'message' => 'Program updated successfully',
            'program' => $program 
        ]);
    }
    
    // Delete a program
    public function destroy($id) {
        $program = Program::findOrFail($id);
        $program->delete();

        return response()->json(['message' => 'Program deleted successfully']);
    }
}
