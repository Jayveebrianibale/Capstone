<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Instructor;
use App\Models\Program;
use Illuminate\Support\Facades\DB;



class InstructorController extends Controller
{
    // Return a list of all instructors as JSON
    public function index()
    {
        return response()->json(Instructor::all());
    }

    // Create a new instructor
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:instructors',
        ]);

        // Create and return the new instructor
        $instructor = Instructor::create($request->all());
        return response()->json($instructor, 201);
    }

    // Update an instructor’s information
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

    // Delete an instructor
    public function destroy($id)
    {
        $instructor = Instructor::findOrFail($id);
        $instructor->delete();

        return response()->json(['message' => 'Instructor deleted successfully']);
    }

    // Assign one or more programs with year levels to an instructor
    public function assignProgram(Request $request, $id)
    {
        $instructor = Instructor::findOrFail($id);
        $request->validate([
            'programs' => 'required|array',
            'programs.*.id' => 'required|exists:programs,id',
            'programs.*.yearLevel' => 'required|integer|between:1,4',
        ]);

        foreach ($request->programs as $program) {
            $exists = $instructor->programs()
                ->wherePivot('program_id', $program['id'])
                ->wherePivot('yearLevel', $program['yearLevel'])
                ->exists();

            if (!$exists) {
                $instructor->programs()->attach($program['id'], ['yearLevel' => $program['yearLevel']]);
            }
        }

        return response()->json([
            'message' => 'Programs assigned successfully',
            'instructor' => $instructor->load('programs')
        ]);
    }

    // Get all instructors assigned to a specific program by program code
    public function getInstructorsByProgramCode($programCode)
    {
        // Find the program by its code or return 404
        $program = Program::where('code', $programCode)->firstOrFail();

        // Get instructors for this program with the year level from the pivot table
        $instructors = $program->instructors()->withPivot('yearLevel')->get();

        return response()->json($instructors);
    }

    //Get instructor that assigned to the program/Course
    public function getInstructorsByProgramAndYear($programId, $yearLevel)
    {
        // Make sure yearLevel is an integer
        if (!in_array($yearLevel, [1, 2, 3, 4])) {
            return response()->json(['message' => 'Invalid year level'], 400);
        }

        // Fetch instructors assigned to the given program_id and yearLevel
        $instructors = DB::table('instructor_program')
                        ->join('instructors', 'instructor_program.instructor_id', '=', 'instructors.id')
                        ->where('instructor_program.program_id', $programId)
                        ->where('instructor_program.yearLevel', $yearLevel)
                        ->select('instructors.*')
                        ->get();

        if ($instructors->isEmpty()) {
            return response()->json(['message' => 'No instructors found'], 404);
        }

        // Return the instructors data
        return response()->json($instructors);
    }

}
