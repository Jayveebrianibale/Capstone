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


    public function getInstructorsByProgramCode($programCode)
{
    $program = Program::where('code', $programCode)->firstOrFail();

    $instructors = $program->instructors()->withPivot('yearLevel')->get();
    return response()->json($instructors);
}



}
