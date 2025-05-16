<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Instructor;
use App\Models\Program;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\GetInstructorsByProgramAndYearRequest;
use App\Http\Controllers\Controller;
use App\Mail\InstructorResultMail;
use Illuminate\Support\Facades\Mail;



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

    // Update an instructor's information
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
        try {
            $instructor = Instructor::findOrFail($id);
            
            // Log the incoming request data
            Log::info('Assign Program Request:', [
                'instructor_id' => $id,
                'request_data' => $request->all()
            ]);

            $request->validate([
                'programs' => 'required|array',
                'programs.*.id' => 'required|exists:programs,id',
                'programs.*.yearLevel' => 'required|integer|min:1|max:4'
            ]);

            // Format the programs data and validate year levels
            $programsData = collect($request->programs)->mapWithKeys(function ($program) {
                $yearLevel = (int)$program['yearLevel'];
                if ($yearLevel < 1 || $yearLevel > 4) {
                    throw new \Exception("Invalid year level: {$yearLevel}. Must be between 1 and 4.");
                }
                return [$program['id'] => ['yearLevel' => $yearLevel]];
            })->all();

            // Log the formatted data
            Log::info('Formatted Programs Data:', [
                'programs_data' => $programsData
            ]);

            // Instead of sync, we'll use attach to add new assignments
            foreach ($programsData as $programId => $data) {
                // Check if this program-year combination already exists
                $existingAssignment = $instructor->programs()
                    ->where('program_id', $programId)
                    ->wherePivot('yearLevel', $data['yearLevel'])
                    ->exists();

                if (!$existingAssignment) {
                    $instructor->programs()->attach($programId, ['yearLevel' => $data['yearLevel']]);
                }
            }

            // Verify the data was saved correctly
            $savedPrograms = $instructor->programs()->withPivot('yearLevel')->get();
            Log::info('Saved Programs Data:', [
                'programs' => $savedPrograms->map(function($program) {
                    return [
                        'id' => $program->id,
                        'name' => $program->name,
                        'year_level' => $program->pivot->yearLevel,
                        'year_level_type' => gettype($program->pivot->yearLevel)
                    ];
                })->toArray()
            ]);

            return response()->json([
                'message' => 'Programs assigned successfully',
                'programs' => $savedPrograms
            ]);
        } catch (\Exception $e) {
            Log::error('Error Assigning Programs:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'instructor_id' => $id,
                'request_data' => $request->all()
            ]);
            return response()->json(['message' => $e->getMessage()], 500);
        }
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
    public function getInstructorsByProgramAndYear(GetInstructorsByProgramAndYearRequest $request) {
        // At this point both $request->programId and $request->yearLevel are
        // guaranteed to be valid (exists, and in 1–4).
        $programId = $request->programId;
        $yearLevel = $request->yearLevel;

        $instructors = DB::table('instructor_program')
            ->join('instructors','instructor_program.instructor_id','=','instructors.id')
            ->where('instructor_program.program_id', $programId)
            ->where('instructor_program.yearLevel', $yearLevel)
            ->select('instructors.*')
            ->get();

        if ($instructors->isEmpty()) {
            return response()->json(['message' => 'No instructors found'], 404);
        }

        return response()->json($instructors);
    }

    // Send the evaluation result to the instructor via email
    public function sendResult(Request $request, $id)
    {
        $instructor = Instructor::findOrFail($id);

        $pdfUrl = url("api/instructors/{$instructor->id}/pdf");

        // send mail
        Mail::to($instructor->email)->send(new InstructorResultMail($instructor, $pdfUrl));

        return response()->json([
            'message' => 'Result email sent successfully.',
        ]);
    }

}
