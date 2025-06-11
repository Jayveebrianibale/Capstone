<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Instructor;
use App\Models\Program;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\GetInstructorsByProgramAndYearRequest;
use App\Http\Controllers\Controller;
use App\Mail\InstructorResultMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\Question;
use App\Models\Evaluation;
use Illuminate\Validation\Rule;
use App\Models\EvaluationResponse;
use Illuminate\Support\Facades\Storage;
use App\Exports\InstructorResultsExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;




class InstructorController extends Controller
{
    // Return a list of all instructors as JSON
    public function index(Request $request) {
        $educationLevel = $request->query('educationLevel');
        $validLevels = ['Higher Education', 'Intermediate', 'Junior High', 'Senior High'];

        // Validate education level if provided
        if ($educationLevel && !in_array($educationLevel, $validLevels)) {
            return response()->json([
                'message' => 'Invalid education level.'
            ], 400);
        }

        $query = Instructor::query();

        if ($educationLevel) {
            $query->where('educationLevel', $educationLevel);
        }

        return response()->json($query->get());
    }

    //BULK UPLOAD
    public function bulkUpload(Request $request) {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
        ]);
    
        $handle = fopen($request->file('file'), 'r');
        if (! $handle) {
            return response()->json(['message' => 'Failed to open the file'], 400);
        }
    
        $header = fgetcsv($handle);
        $header = array_map('trim', $header); // Trim header values
    
        // Validate required headers
        $requiredHeaders = ['name', 'email', 'programs'];
        $missingHeaders = array_diff($requiredHeaders, $header);
        
        if (!empty($missingHeaders)) {
            fclose($handle);
            return response()->json([
                'message' => 'Missing required headers: ' . implode(', ', $missingHeaders)
            ], 400);
        }
    
        $inserted = [];
        $skipped  = [];
    
        while ($row = fgetcsv($handle)) {
            if (count($row) !== count($header)) {
                $skipped[] = [
                    'data' => $row,
                    'errors' => ['Invalid row structure: column count mismatch']
                ];
                continue;
            }
    
            $data = array_combine($header, $row);
            $data = array_map('trim', $data); // Trim all values
    
            $validator = Validator::make($data, [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:instructors,email|unique:users,email',
                'programs' => 'required|string',
            ]);
    
            if ($validator->fails()) {
                $skipped[] = [
                    'data'   => $data,
                    'errors' => $validator->errors()->all()
                ];
                continue;
            }
    
            DB::beginTransaction();
    
            try {
                // Create instructor
                $instructor = Instructor::create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'educationLevel' => 'Higher Education' // Default to Higher Education since all programs are HE
                ]);
    
                // Create user account
                User::create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'role' => 'Instructor',
                    'password' => null,
                    'educationLevel' => 'Higher Education'
                ]);
    
                // Handle program assignments
                if (!empty($data['programs'])) {
                    $programs = json_decode($data['programs'], true);
    
                    if (is_array($programs)) {
                        foreach ($programs as $entry) {
                            $programCode = $entry['code'] ?? null;
                            $yearLevel = (int)($entry['yearLevel'] ?? 0);
    
                            if ($programCode && $yearLevel >= 1 && $yearLevel <= 4) {
                                $program = Program::where('code', $programCode)->first();
    
                                if ($program) {
                                    $exists = $instructor->programs()
                                        ->where('program_id', $program->id)
                                        ->wherePivot('yearLevel', $yearLevel)
                                        ->exists();
    
                                    if (! $exists) {
                                        $instructor->programs()->attach($program->id, [
                                            'yearLevel' => $yearLevel
                                        ]);
                                    }
                                }
                            }
                        }
                    }
                }
    
                DB::commit();
                $inserted[] = $instructor;
            } catch (\Throwable $e) {
                DB::rollBack();
                $skipped[] = [
                    'data' => $data,
                    'errors' => ['Exception: ' . $e->getMessage()]
                ];
            }
        }
    
        fclose($handle);
    
        return response()->json([
            'message'  => 'Instructors upload complete',
            'inserted' => count($inserted),
            'skipped'  => $skipped,
        ]);
    }
    

    // Create a new instructor
    public function create(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email',
                'status' => 'required|string|in:Active,Inactive'
            ]);

            // Check if instructor with this email exists (including soft-deleted)
            $existingInstructor = Instructor::withTrashed()
                ->where('email', $request->email)
                ->first();

            if ($existingInstructor) {
                if ($existingInstructor->trashed()) {
                    // Restore the soft-deleted instructor
                    $existingInstructor->restore();
                    $existingInstructor->update([
                        'name' => $request->name,
                        'status' => $request->status
                    ]);

                    return response()->json([
                        'message' => 'Instructor restored successfully',
                        'instructor' => $existingInstructor
                    ], 200);
                } else {
                    // Instructor exists and is not deleted
                    return response()->json([
                        'message' => 'An instructor with this email already exists',
                        'error' => 'Duplicate email'
                    ], 409);
                }
            }

            // Create new instructor if no existing instructor found
            $instructor = Instructor::create([
                'name' => $request->name,
                'email' => $request->email,
                'status' => $request->status
            ]);

            return response()->json([
                'message' => 'Instructor created successfully',
                'instructor' => $instructor
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Error creating instructor: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create instructor',
                'error' => $e->getMessage()
            ], 500);
        }
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
    public function destroy($id) {
        $instructor = Instructor::findOrFail($id);

        DB::transaction(function () use ($instructor) {
            // Remove all program assignments first
            $instructor->programs()->detach();

            // Soft delete the instructor
            $instructor->delete();

            // Find related user by email and soft delete
            $user = User::where('email', $instructor->email)->first();
            if ($user) {
                $user->delete();
            }
        });

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
                'programs.*.yearLevels' => 'required|array',
                'programs.*.yearLevels.*' => 'required|integer|min:1'
            ]);

            // Format the programs data and validate grade levels
            $programsData = collect($request->programs)->mapWithKeys(function ($program) {
                $yearLevels = array_map('intval', $program['yearLevels']);
                
                // Get the program to validate grade level
                $programModel = \App\Models\Program::find($program['id']);
                if (!$programModel) {
                    throw new \Exception("Program not found");
                }

                // Extract grade level from program name if it exists
                $gradeLevel = null;
                if (preg_match('/Grade (\d+)/', $programModel->name, $matches)) {
                    $gradeLevel = (int)$matches[1];
                }

                // Validate each year level based on program category
                foreach ($yearLevels as $yearLevel) {
                    // If we have a grade level from the program name, use that instead
                    if ($gradeLevel !== null) {
                        $yearLevel = $gradeLevel;
                    }

                    switch ($programModel->category) {
                        case 'Junior High':
                        case 'JHS':
                            if ($yearLevel < 7 || $yearLevel > 10) {
                                throw new \Exception("Invalid grade level for Junior High School. Must be between Grade 7 and Grade 10.");
                            }
                            break;
                        case 'Intermediate':
                        case 'INT':
                            if ($yearLevel < 4 || $yearLevel > 6) {
                                throw new \Exception("Invalid grade level for Intermediate. Must be between Grade 4 and Grade 6.");
                            }
                            break;
                        case 'Senior High':
                        case 'SHS':
                            if ($yearLevel < 11 || $yearLevel > 12) {
                                throw new \Exception("Invalid grade level for Senior High School. Must be between Grade 11 and Grade 12.");
                            }
                            break;
                        case 'Higher Education':
                        case 'HE':
                            if ($yearLevel < 1 || $yearLevel > 4) {
                                throw new \Exception("Invalid year level for Higher Education. Must be between 1st Year and 4th Year.");
                            }
                            break;
                        default:
                            throw new \Exception("Invalid program category: " . $programModel->category);
                    }
                }

                // Create an array of year level assignments
                $assignments = [];
                foreach ($yearLevels as $yearLevel) {
                    // If we have a grade level from the program name, use that instead
                    if ($gradeLevel !== null) {
                        $yearLevel = $gradeLevel;
                    }
                    $assignments[] = ['yearLevel' => $yearLevel];
                }

                return [$program['id'] => $assignments];
            })->all();

            // Log the formatted data
            Log::info('Formatted Programs Data:', [
                'programs_data' => $programsData
            ]);

            // Check for existing assignments with the same grade level and section
            foreach ($programsData as $programId => $assignments) {
                $program = Program::find($programId);
                if (!$program) {
                    throw new \Exception("Program not found");
                }

                // Extract section from program name if it exists
                $section = null;
                if (strpos($program->name, ' - Section ') !== false) {
                    $section = explode(' - Section ', $program->name)[1];
                }

                foreach ($assignments as $assignment) {
                    $existingAssignment = DB::table('instructor_program')
                        ->join('programs', 'instructor_program.program_id', '=', 'programs.id')
                        ->where('instructor_program.instructor_id', $id)
                        ->where('instructor_program.program_id', $programId)
                        ->where('instructor_program.yearLevel', $assignment['yearLevel'])
                        ->first();

                    if ($existingAssignment) {
                        $gradeText = $this->formatGradeLevelText($assignment['yearLevel'], $program->category);
                        $sectionText = $section ? " in Section " . $section : "";
                        throw new \Exception("Instructor is already assigned to this program with {$gradeText}{$sectionText}");
                    }
                }
            }

            // Use attach to add new assignments without removing existing ones
            foreach ($programsData as $programId => $assignments) {
                foreach ($assignments as $assignment) {
                    $instructor->programs()->attach($programId, [
                        'yearLevel' => $assignment['yearLevel']
                    ]);
                }
            }

            return response()->json([
                'message' => 'Programs assigned successfully',
                'programs' => $programsData
            ]);

        } catch (\Exception $e) {
            Log::error('Error assigning programs:', [
                'instructor_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => $e->getMessage()
            ], 422);
        }
    }

    // Helper function to get ordinal suffix
    private function getOrdinalSuffix($number) {
        $j = $number % 10;
        $k = $number % 100;
        if ($j == 1 && $k != 11) return "st";
        if ($j == 2 && $k != 12) return "nd";
        if ($j == 3 && $k != 13) return "rd";
        return "th";
    }

    // Helper function to format grade level text based on program category
    private function formatGradeLevelText($yearLevel, $category) {
        return match($category) {
            'Higher Education' => $yearLevel . $this->getOrdinalSuffix($yearLevel) . ' Year',
            'Intermediate', 'Junior High', 'Senior High' => 'Grade ' . $yearLevel,
            default => 'Grade ' . $yearLevel
        };
    }

    // Get all instructors assigned to a specific program by program code
    public function getInstructorsByProgramCode($programCode)
    {
        // Find the program by its code or return 404
        $program = Program::where('code', $programCode)->firstOrFail();

        if (!$program) {
            return response()->json(['error' => 'Program not found'], 404);
        }

        // Get instructors for this program with the year level from the pivot table
        $instructors = DB::table('instructor_program')
            ->join('instructors', 'instructor_program.instructor_id', '=', 'instructors.id')
            ->where('instructor_program.program_id', $program->id)
            ->select(
                'instructors.*',
                'instructor_program.yearLevel',
                'instructor_program.program_id'
            )
            ->get()
            ->map(function ($instructor) {
                return [
                    'id' => $instructor->id,
                    'name' => $instructor->name,
                    'email' => $instructor->email,
                    'status' => $instructor->status,
                    'educationLevel' => $instructor->educationLevel,
                    'created_at' => $instructor->created_at,
                    'updated_at' => $instructor->updated_at,
                    'pivot' => [
                        'yearLevel' => (int)$instructor->yearLevel,
                        'program_id' => $instructor->program_id
                    ]
                ];
            });

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

        // Calculate overall rating (same as PDF logic)
        $questions = \App\Models\Question::all();
        $evaluations = \App\Models\Evaluation::where('instructor_id', $id)->get();
        $ratings = [];
        foreach ($questions as $index => $question) {
            $questionId = $question->id;
            $total = 0;
            $count = 0;
            foreach ($evaluations as $evaluation) {
                $response = $evaluation->responses()
                    ->where('question_id', $questionId)
                    ->first();
                if ($response) {
                    $total += $response->rating;
                    $count++;
                }
            }
            $ratings['q' . ($index + 1)] = $count > 0 ? $total / $count : null;
        }
        $overallRating = 0;
        if (!empty($ratings) && count($questions) > 0) {
            $sum = array_sum($ratings);
            $count = count($ratings);
            if ($count > 0) {
                $overallRating = ($sum / $count) * 20; // 5*20=100
            }
        }
        $instructor->overallRating = $overallRating;

        $pdfUrl = url("api/instructors/{$instructor->id}/pdf");

        // send mail
        Mail::to($instructor->email)->send(new InstructorResultMail($instructor, $pdfUrl));

        return response()->json([
            'message' => 'Result email sent successfully.',
        ]);
    }

    public function sendBulkResults(Request $request, $programCode) {
        // Validate request
        $validator = Validator::make($request->all(), [
            'instructorIds' => 'required|array',
            'instructorIds.*' => 'required|integer|exists:instructors,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Get instructors for the program
        $instructors = Instructor::whereIn('id', $request->instructorIds)
            ->whereHas('programs', function($query) use ($programCode) {
                $query->where('code', $programCode);
            })->get();

        if ($instructors->isEmpty()) {
            return response()->json([
                'message' => 'No instructors found for this program',
                'sent_count' => 0,
                'failed_count' => 0,
                'failed_emails' => []
            ]);
        }

        $sentCount = 0;
        $failedCount = 0;
        $failedEmails = [];

        foreach ($instructors as $instructor) {
            try {
                // Calculate overall rating (same as individual send)
                $questions = \App\Models\Question::all();
                $evaluations = \App\Models\Evaluation::where('instructor_id', $instructor->id)->get();
                
                $ratings = [];
                foreach ($questions as $index => $question) {
                    $questionId = $question->id;
                    $total = 0;
                    $count = 0;
                    foreach ($evaluations as $evaluation) {
                        $response = $evaluation->responses()
                            ->where('question_id', $questionId)
                            ->first();
                        if ($response) {
                            $total += $response->rating;
                            $count++;
                        }
                    }
                    $ratings['q' . ($index + 1)] = $count > 0 ? $total / $count : null;
                }
                
                $overallRating = 0;
                if (!empty($ratings) && count($questions) > 0) {
                    $sum = array_sum($ratings);
                    $count = count($ratings);
                    if ($count > 0) {
                        $overallRating = ($sum / $count) * 20;
                    }
                }
                $instructor->overallRating = $overallRating;

                $pdfUrl = url("api/instructors/{$instructor->id}/pdf");

                // Send mail
                Mail::to($instructor->email)->send(new InstructorResultMail($instructor, $pdfUrl));
                $sentCount++;
            } catch (\Exception $e) {
                $failedCount++;
                $failedEmails[] = $instructor->email;
                \Log::error("Failed to send result to {$instructor->email}: " . $e->getMessage());
            }
        }

        return response()->json([
            'message' => 'Bulk email sending completed.',
            'sent_count' => $sentCount,
            'failed_count' => $failedCount,
            'failed_emails' => $failedEmails,
        ]); 
    }

    public function getAssignedPrograms($instructorId) {
        $instructor = Instructor::with(['programs'])->findOrFail($instructorId);

        return response()->json([
            'message' => 'Programs fetched successfully',
            'programs' => $instructor->programs
        ]);
    }


    public function getInstructorAverageRatings($instructorId)
    {
        $averageRatings = DB::table('evaluation_responses')
            ->join('evaluations', 'evaluation_responses.evaluation_id', '=', 'evaluations.id')
            ->join('questions', 'evaluation_responses.question_id', '=', 'questions.id')
            ->select(
                'questions.id as question_id',
                'questions.question as question_text',
                DB::raw('AVG(evaluation_responses.rating) as avg_rating')
            )
            ->where('evaluations.instructor_id', $instructorId)
            ->groupBy('questions.id', 'questions.question')
            ->orderBy('questions.id')
            ->get();
    
        return response()->json($averageRatings);
    }
    
public function getInstructorCommentsWithStudentNames($instructorId)
    {
        // Ensure the instructor exists
        $instructor = Instructor::findOrFail($instructorId);

        $comments = DB::table('evaluation_responses')
            ->join('evaluations', 'evaluation_responses.evaluation_id', '=', 'evaluations.id')
            ->join('users', 'evaluations.student_id', '=', 'users.id')
            ->select(
                'evaluation_responses.comment',
                'users.name as student_name'
            )
            ->where('evaluations.instructor_id', $instructorId)
            ->whereNotNull('evaluation_responses.comment')
            ->where('evaluation_responses.comment', '<>', '')
            ->distinct() 
            ->get();

        return response()->json($comments);
    }

    public function getCommentsWithStudentNames($instructorId)
    {
        $comments = DB::table('evaluation_responses')
            ->join('evaluations', 'evaluation_responses.evaluation_id', '=', 'evaluations.id')
            ->join('users', 'evaluations.student_id', '=', 'users.id')
            ->join('programs', 'users.program_id', '=', 'programs.id')
            ->select(
                DB::raw('MIN(evaluation_responses.comment) as comment'),
                'users.name as student_name',
                'evaluations.student_id',
                'programs.code as program_code'
            )
            ->where('evaluations.instructor_id', $instructorId)
            ->whereNotNull('evaluation_responses.comment')
            ->where('evaluation_responses.comment', '<>', '')
            ->groupBy('evaluations.student_id', 'users.name', 'programs.code')
            ->get();

        return response()->json($comments);
    }

    public function removeProgram($instructorId, $programId)
    {
        try {
            $instructor = Instructor::findOrFail($instructorId);
            $yearLevel = request()->query('yearLevel');
            
            if (!$yearLevel) {
                return response()->json([
                    'message' => 'Year level is required',
                ], 400);
            }

            // Remove the specific program-year level combination
            $instructor->programs()->wherePivot('yearLevel', $yearLevel)->detach($programId);
            
            return response()->json([
                'message' => 'Program removed successfully',
                'instructor' => $instructor->load('programs')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to remove program',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getInstructorsByProgramName($programName)
    {
        try {
            // Clean and normalize the program name
            $normalizedSearchName = trim(strtolower($programName));
            
            // Find the program by name using LIKE for more flexible matching
            $program = Program::where(function($query) use ($normalizedSearchName) {
                $query->whereRaw('LOWER(name) LIKE ?', ['%' . $normalizedSearchName . '%'])
                      ->orWhereRaw('LOWER(name) LIKE ?', ['%' . str_replace(' - ', '%', $normalizedSearchName) . '%']);
            })->first();

            if (!$program) {
                \Log::info('Program not found for name:', ['search_name' => $programName, 'normalized' => $normalizedSearchName]);
                return response()->json(['message' => 'Program not found'], 404);
            }

            // Get instructors for this program with the year level from the pivot table
            $instructors = $program->instructors()->withPivot('yearLevel')->get();

            if ($instructors->isEmpty()) {
                \Log::info('No instructors found for program:', ['program_id' => $program->id, 'program_name' => $program->name]);
                return response()->json(['message' => 'No instructors found for this program'], 200);
            }

            \Log::info('Found instructors for program:', [
                'program_id' => $program->id,
                'program_name' => $program->name,
                'instructor_count' => $instructors->count()
            ]);

            return response()->json($instructors);
        } catch (\Exception $e) {
            \Log::error('Error fetching instructors by program name:', [
                'error' => $e->getMessage(),
                'program_name' => $programName,
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Failed to fetch instructors'], 500);
        }
    }
}
