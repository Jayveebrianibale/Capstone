<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;
use App\Models\Instructor;

class ProgramController extends Controller {

    public function index() {
        $programs = Program::with('levels')->get();
        return response()->json(['programs' => $programs]);
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required|string',
            'code' => 'required|string',
            'yearLevel' => 'nullable|string',
            'category' => 'nullable|string',
        ]);
    
        $existingProgram = Program::where('name', $request->name)
                                ->where('code', $request->code)
                                ->where('yearLevel', $request->yearLevel)
                                ->first();
    
        if ($existingProgram) {
            return response()->json([
                'message' => 'Program with the same name, code, and year level already exists'
            ], 422);
        }
    
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
    

    public function show($id) {
        $program = Program::with('levels')->findOrFail($id);
        return response()->json($program);
    }

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
    
    public function destroy($id) {
        $program = Program::findOrFail($id);
        $program->delete();

        return response()->json(['message' => 'Program deleted successfully']);
    }

    public function getInstructorsByProgram($id)
    {
        $program = Program::with(['instructors.yearLevel'])->findOrFail($id);

    return response()->json([
        'instructors' => $program->instructors,
    ]);
    }



}
