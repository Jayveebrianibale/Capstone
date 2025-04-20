<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Instructor;
use App\Models\Program;

/**
 * Class InstructorController
 * 
 * Handles instructor-related actions such as creating, updating, deleting instructors,
 * assigning programs, and retrieving instructors by program.
 */
class InstructorController extends Controller
{
    /**
     * Returns a JSON list of all instructors.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return response()->json(Instructor::all());
    }

    /**
     * Creates a new instructor.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validate request data
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:instructors',
        ]);

        // Create instructor
        $instructor = Instructor::create($request->all());

        return response()->json($instructor, 201);
    }

    /**
     * Updates an existing instructor's information.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        // Find instructor by ID or fail
        $instructor = Instructor::findOrFail($id);

        // Validate updated data
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:instructors,email,' . $id,
        ]);

        // Update instructor details
        $instructor->update($request->all());

        return response()->json($instructor);
    }

    /**
     * Deletes an instructor.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        // Find instructor by ID or fail
        $instructor = Instructor::findOrFail($id);

        // Delete instructor
        $instructor->delete();

        return response()->json(['message' => 'Instructor deleted successfully']);
    }

    /**
     * Assigns one or more programs to an instructor with specific year levels.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id  Instructor ID
     * @return \Illuminate\Http\JsonResponse
     */
    public function assignProgram(Request $request, $id)
    {
        // Find instructor by ID or fail
        $instructor = Instructor::findOrFail($id);

        // Validate request data for program assignments
        $request->validate([
            'programs' => 'required|array',
            'programs.*.id' => 'required|exists:programs,id',
            'programs.*.yearLevel' => 'required|integer|between:1,4',
        ]);

        // Attach programs to the instructor if not already assigned for the given year level
        foreach ($request->programs as $program) {
            $exists = $instructor->programs()
                ->wherePivot('program_id', $program['id'])
                ->wherePivot('yearLevel', $program['yearLevel'])
                ->exists();

            if (!$exists) {
                $instructor->programs()->attach($program['id'], ['yearLevel' => $program['yearLevel']]);
            }
        }

        // Return updated instructor with program relationships
        return response()->json([
            'message' => 'Programs assigned successfully',
            'instructor' => $instructor->load('programs')
        ]);
    }

    /**
     * Retrieves instructors assigned to a specific program by program code.
     *
     * @param  string  $programCode
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInstructorsByProgramCode($programCode)
    {
        // Find program by its code or fail
        $program = Program::where('code', $programCode)->firstOrFail();

        // Retrieve instructors with pivot data (yearLevel)
        $instructors = $program->instructors()->withPivot('yearLevel')->get();

        return response()->json($instructors);
    }
}
