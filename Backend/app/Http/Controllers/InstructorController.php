<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Instructor;
use App\Models\Program;

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
        // Validate the request
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
        // Find the instructor or return 404
        $instructor = Instructor::findOrFail($id);

        // Validate the updated data
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:instructors,email,' . $id,
        ]);

        // Update the instructor details
        $instructor->update($request->all());
        return response()->json($instructor);
    }

    // Delete an instructor
    public function destroy($id)
    {
        // Find the instructor or return 404
        $instructor = Instructor::findOrFail($id);

        // Delete the instructor
        $instructor->delete();

        return response()->json(['message' => 'Instructor deleted successfully']);
    }

    // Assign one or more programs with year levels to an instructor
    public function assignProgram(Request $request, $id)
    {
        // Find the instructor or return 404
        $instructor = Instructor::findOrFail($id);

        // Validate the program assignment data
        $request->validate([
            'programs' => 'required|array',
            'programs.*.id' => 'required|exists:programs,id',
            'programs.*.yearLevel' => 'required|integer|between:1,4',
        ]);

        // Loop through programs and attach them to the instructor if not already assigned for the given year level
        foreach ($request->programs as $program) {
            $exists = $instructor->programs()
                ->wherePivot('program_id', $program['id'])
                ->wherePivot('yearLevel', $program['yearLevel'])
                ->exists();

            if (!$exists) {
                $instructor->programs()->attach($program['id'], ['yearLevel' => $program['yearLevel']]);
            }
        }

        // Return the updated instructor with their assigned programs
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
        public function getInstructorsByCourse(Request $request)
    {
        $request->validate([
            'program_id' => 'required|integer',
            'yearLevel' => 'required|string',
        ]);

        $programId = $request->input('program_id');
        $yearLevel = $request->input('year_level');

        $instructors = Instructor::where('program_id', $programId)
                         ->where('year_level', $yearLevel)
                         ->get();

        return response()->json($instructors);
    }

}
