<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Instructor;
use App\Models\Program;

class InstructorController extends Controller
{
    public function index()
    {
        return response()->json(Instructor::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:instructors',
        ]);

        $instructor = Instructor::create($request->all());

        return response()->json($instructor, 201);
    }

    public function update(Request $request, $id)
    {
        $instructor = Instructor::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:instructors,email,' . $id,
        ]);

        $instructor->update($request->all());

        return response()->json($instructor);
    }

    public function destroy($id)
    {
        $instructor = Instructor::findOrFail($id);
        $instructor->delete();

        return response()->json(['message' => 'Instructor deleted successfully']);
    }

        public function assignProgram(Request $request, $id)
    {
        $instructor = Instructor::findOrFail($id);

        $request->validate([
        'programs' => 'required|array',
        'programs.*.id' => 'required|exists:programs,id',
        'programs.*.yearLevel' => 'nullable|integer|between:1,4',
        ]);

        $syncData = [];

        foreach ($request->programs as $program) {
        $syncData[$program['id']] = ['yearLevel' => $program['yearLevel']];
        }

        $instructor->programs()->sync($syncData);

        return response()->json([
        'message' => 'Programs assigned successfully',
        'instructor' => $instructor->load('programs')
        ]);
    }


    public function getInstructorsByProgram($programId)
    {
        try {
            $program = Program::with(['instructors' => function($query) {
                $query->withPivot('yearLevel');
            }])->findOrFail($programId);
    
            return response()->json($program->instructors);
        } catch (\Exception $e) {
            // Log error
            \Log::error("Error fetching instructors for program ID $programId: " . $e->getMessage());
    
            // Return error response
            return response()->json(['error' => 'Failed to load instructors.'], 500);
        }
    }
    

}
