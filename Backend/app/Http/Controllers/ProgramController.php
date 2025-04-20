<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;
use App\Models\Instructor;


class ProgramController extends Controller
{
    
    //  Retrieves all programs.
    public function index()
    {
        $programs = Program::all();
        return response()->json(['programs' => $programs]);
    }

   
    // Stores a new program if it doesn’t already exist.
    public function store(Request $request)
    {
        // Validate request data
        $request->validate([
            'name' => 'required|string',
            'code' => 'required|string',
            'yearLevel' => 'nullable|string',
            'category' => 'nullable|string',
        ]);

        // Check if the program already exists
        $existingProgram = Program::where('name', $request->name)
                                ->where('code', $request->code)
                                ->where('yearLevel', $request->yearLevel)
                                ->first();

        if ($existingProgram) {
            return response()->json([
                'message' => 'Program with the same name, code, and year level already exists'
            ], 422);
        }

        // Create the new program
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

    
    // Retrieves the year levels of a program by its ID.
    public function getYearLevels($programId)
    {
        $program = Program::find($programId);

        if (!$program) {
            return response()->json(['message' => 'Program not found'], 404);
        }

        $yearLevels = $program->yearLevel;

        return response()->json($yearLevels);
    }

    
     // Displays a specific program with its levels.
    public function show($id)
    {
        $program = Program::with('levels')->findOrFail($id);
        return response()->json($program);
    }

    
    // Updates a specific program's details.
    
    public function update(Request $request, $id)
    {
        // Validate request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:255',
            'yearLevel' => 'nullable|string',
            'category' => 'required|string'
        ]);

        // Find and update the program
        $program = Program::findOrFail($id);
        $program->update($validated);

        return response()->json([
            'message' => 'Program updated successfully',
            'program' => $program 
        ]);
    }

     // Deletes a program.
    public function destroy($id)
    {
        $program = Program::findOrFail($id);
        $program->delete();

        return response()->json(['message' => 'Program deleted successfully']);
    }

   
     // Retrieves instructors assigned to a program by its code.
    public function getInstructorsByProgramCode($programCode)
    {
        $program = Program::where('code', $programCode)->first();

        if (!$program) {
            return response()->json(['error' => 'Program not found'], 404);
        }

        $instructors = $program->instructors;

        if ($instructors->isEmpty()) {
            return response()->json(['message' => 'No instructors assigned'], 200);
        }

        return response()->json($instructors);
    }
}
