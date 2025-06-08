<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Instructor;
use App\Models\Course;
use App\Models\Evaluation;
use App\Models\EvaluationResponse;
use App\Models\Question;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Setting;
use App\Models\EvaluationArchive;
use App\Models\EvaluationResponseArchive;
use PDF;// Add this at the top of your controller
use Illuminate\Support\Str;





class EvaluationController extends Controller {


    public function index(Request $request)
            {
                $user = $request->user();
                $evaluations = Evaluation::with(['instructor', 'student']) 
                    ->where('student_id', $user->id)
                    ->get()
                    ->groupBy('instructor_id');

                return response()->json($evaluations);
            }


            public function store(Request $request) {
            $user = auth()->user();
            $currentPhase = Setting::first()->evaluation_phase ?? 'Phase 1';

            if ($user->role !== 'Student') {
                return response()->json(['message' => 'Only students can submit evaluations.'], 403);
            }

            if ($currentPhase !== 'Phase 1') {
                return response()->json([
                    'message' => 'Evaluations are currently closed. Phase 1 has ended.',
                    'current_phase' => $currentPhase
                ], 403);
            }

                $validated = $request->validate([
                    'instructor_id' => 'required|exists:instructors,id',
                    'responses' => 'required|array|min:1',
                    'responses.*.question_id' => 'required|exists:questions,id',
                    'responses.*.rating' => 'required|integer|between:1,5',
                    'comment' => 'nullable|string',
                    'school_year' => 'required|string',
                    'semester' => 'required|string',
                ]);



            // ✅ Check if this student already evaluated this instructor
            $existingEvaluation = Evaluation::where('student_id', $user->id)
                ->where('instructor_id', $validated['instructor_id'])
                ->first();

            if ($existingEvaluation) {
                return response()->json(['message' => 'You have already submitted an evaluation for this instructor.'], 409);
            }

            // ✅ Create evaluation and responses
                $evaluation = Evaluation::create([
                    'student_id' => $user->id,
                    'instructor_id' => $validated['instructor_id'],
                    'school_year' => $validated['school_year'],
                    'semester' => $validated['semester'],
                    'status' => 'Evaluated',
                    'evaluated_at' => now(),
                ]);




            foreach ($validated['responses'] as $response) {
                EvaluationResponse::create([
                    'evaluation_id' => $evaluation->id,
                    'question_id' => $response['question_id'],
                    'rating' => $response['rating'],
                    'comment' => $validated['comment'] ?? null,
                ]);
            }

        return response()->json([
                'message' => 'Evaluation submitted successfully.',
                'status' => $evaluation->status,
                'evaluated_at' => $evaluation->evaluated_at,
            ], 201);

        }



    public function getEvaluationWithResponses($evaluationId) {
            
            $evaluation = Evaluation::with('responses.question')->find($evaluationId);

            if (!$evaluation) {
                return response()->json(['error' => 'Evaluation not found'], 404);
            }

            return response()->json($evaluation);
        }

        public function submitAll(Request $request) {
            $user = auth()->user();

            if ($user->role !== 'Student') {
                return response()->json(['message' => 'Only students can submit evaluations.'], 403);
            }

            $validated = $request->validate([
                'evaluations' => 'required|array|min:1',
                'evaluations.*.instructor_id' => 'required|exists:instructors,id',
                'evaluations.*.responses' => 'required|array|min:1',
                'evaluations.*.responses.*.question_id' => 'required|exists:questions,id',
                'evaluations.*.responses.*.rating' => 'required|integer|between:1,5',
                'evaluations.*.comment' => 'nullable|string',
                'school_year' => 'required|string',
                'semester' => 'required|string',
            ]);

            // Check for existing evaluations
            $instructorIds = collect($validated['evaluations'])->pluck('instructor_id');
            $existingEvaluations = Evaluation::where('student_id', $user->id)
                ->whereIn('instructor_id', $instructorIds)
                ->get();

            if ($existingEvaluations->isNotEmpty()) {
                $evaluatedInstructors = $existingEvaluations->pluck('instructor_id');
                return response()->json([
                    'message' => 'You have already evaluated some instructors.',
                    'evaluated_instructors' => $evaluatedInstructors,
                    'error' => 'DUPLICATE_EVALUATION'
                ], 409);
            }

            $submitted = [];

            foreach ($validated['evaluations'] as $eval) {
                $evaluation = Evaluation::create([
                    'student_id' => $user->id,
                    'instructor_id' => $eval['instructor_id'],
                    'school_year' => $validated['school_year'],
                    'semester' => $validated['semester'],
                    'status' => 'Evaluated',
                    'evaluated_at' => now(),
                ]);

                foreach ($eval['responses'] as $response) {
                    EvaluationResponse::create([
                        'evaluation_id' => $evaluation->id,
                        'question_id' => $response['question_id'],
                        'rating' => $response['rating'],
                        'comment' => $eval['comment'] ?? null,
                    ]);
                }

                $submitted[] = [
                    'instructor_id' => $eval['instructor_id'],
                    'submitted_at' => $evaluation->evaluated_at->toDateTimeString(),
                ];
            }

            return response()->json([
                'message' => 'Evaluations submitted successfully.',
                'submissions' => $submitted,
            ], 201);
        }

        public function topRatedInstructors() {
            // Get the top 3 instructors based on average rating
            $topInstructors = DB::table('evaluations')
                ->join('evaluation_responses', 'evaluations.id', '=', 'evaluation_responses.evaluation_id')
                ->join('instructors', 'evaluations.instructor_id', '=', 'instructors.id')
                ->select(
                    'instructors.id',
                    'instructors.name',
                    DB::raw('AVG(evaluation_responses.rating) as avg_rating'),
                    DB::raw('ROUND((AVG(evaluation_responses.rating) / 5) * 100, 2) as percentage')
                )
                ->groupBy('instructors.id', 'instructors.name')
                ->orderByDesc('percentage')
                ->limit(3)
                ->get();

            return response()->json($topInstructors);
        }
        // Get all average ratings for instructors (5, 4, 3, 2, 1)
        public function getAllInstructorDistributions(Request $request) {
            $educationLevel = $request->query('educationLevel');

            $validLevels = ['Higher Education', 'Intermediate', 'Junior High', 'Senior High'];

            // Optional: validate the educationLevel input
            if ($educationLevel && !in_array($educationLevel, $validLevels)) {
                return response()->json([
                    'message' => 'Invalid education level.'
                ], 400);
            }

            $instructors = DB::table('evaluations')
                ->join('evaluation_responses', 'evaluations.id', '=', 'evaluation_responses.evaluation_id')
                ->join('instructors', 'evaluations.instructor_id', '=', 'instructors.id')
                ->join('users', 'evaluations.student_id', '=', 'users.id')
                ->when($educationLevel, function ($query, $educationLevel) {
                    return $query->where('users.educationLevel', $educationLevel);
                })
                ->select(
                    'instructors.id',
                    'instructors.name',
                    DB::raw('AVG(evaluation_responses.rating) as avg_rating'),
                    DB::raw('ROUND((AVG(evaluation_responses.rating) / 5) * 100, 2) as percentage'),
                    DB::raw('SUM(CASE WHEN evaluation_responses.rating = 1 THEN 1 ELSE 0 END) as rating_1_count'),
                    DB::raw('SUM(CASE WHEN evaluation_responses.rating = 2 THEN 1 ELSE 0 END) as rating_2_count'),
                    DB::raw('SUM(CASE WHEN evaluation_responses.rating = 3 THEN 1 ELSE 0 END) as rating_3_count'),
                    DB::raw('SUM(CASE WHEN evaluation_responses.rating = 4 THEN 1 ELSE 0 END) as rating_4_count'),
                    DB::raw('SUM(CASE WHEN evaluation_responses.rating = 5 THEN 1 ELSE 0 END) as rating_5_count')
                )
                ->groupBy('instructors.id', 'instructors.name')
                ->orderByDesc('percentage')
                ->get();

            return response()->json([
                'data' => $instructors
            ]);
        }


        public function evaluationSubmissionStats(Request $request) {
            $schoolYear = $request->input('school_year');
            $semester   = $request->input('semester');

            $instructorPrograms = DB::table('instructor_program')
                ->join('instructors', 'instructor_program.instructor_id', '=', 'instructors.id')
                ->join('programs',    'instructor_program.program_id',    '=', 'programs.id')
                ->select(
                    'instructor_program.instructor_id',
                    'programs.id as program_id',
                    'programs.code as program_code',
                    'instructors.name as instructor_name',
                    'programs.name as program_name',
                    'instructor_program.yearLevel'
                )
                ->get();

            $results = [];

            foreach ($instructorPrograms as $ip) {
                $studentIds = DB::table('users')
                    ->where('role', 'Student')
                    ->where('program_id', $ip->program_id)
                    ->where('yearLevel',  $ip->yearLevel)
                    ->pluck('id');

                $totalStudents = $studentIds->count();

                $submittedCount = DB::table('evaluations')
                    ->where('instructor_id', $ip->instructor_id)
                    ->whereIn('student_id', $studentIds)
                    ->distinct()
                    ->count('student_id');

                $results[] = [
                    'instructor'     => $ip->instructor_name,
                    'program'        => $ip->program_name,
                    'program_code'   => $ip->program_code,
                    'yearLevel'      => $ip->yearLevel,
                    'total_students' => $totalStudents,
                    'submitted'      => $submittedCount,
                    'not_submitted'  => $totalStudents - $submittedCount,
                    'school_year'    => $schoolYear,
                    'semester'       => $semester,
                ];
            }

            return response()->json(['data' => $results]);
        }

        public function overallEvaluationSubmissionStats(Request $request) {
            $educationLevel = $request->query('educationLevel');
            $validLevels = ['Higher Education', 'Intermediate', 'Junior High', 'Senior High'];
        
            // Validate education level if provided
            if ($educationLevel && !in_array($educationLevel, $validLevels)) {
                return response()->json([
                    'message' => 'Invalid education level.'
                ], 400);
            }
        
            // Base query for all students
            $allStudentsQuery = DB::table('users')
                ->where('role', 'Student');
        
            // Apply education level filter if provided
            if ($educationLevel) {
                $allStudentsQuery->where('educationLevel', $educationLevel);
            }
        
            $allStudents = $allStudentsQuery->pluck('id');
        
            // Base query for submitted evaluations
            $submittedQuery = DB::table('evaluations')
                ->select('student_id')
                ->distinct();
        
            // If filtering by education level, join with users table
            if ($educationLevel) {
                $submittedQuery->join('users', 'evaluations.student_id', '=', 'users.id')
                    ->where('users.educationLevel', $educationLevel);
            }
        
            $submittedStudentIds = $submittedQuery->pluck('student_id');
        
            // Count submitted and not submitted
            $submittedCount = $submittedStudentIds->count();
            $notSubmittedCount = $allStudents->diff($submittedStudentIds)->count();
        
            return response()->json([
                'total_students'    => $allStudents->count(),
                'submitted'         => $submittedCount,
                'not_submitted'     => $notSubmittedCount,
                'education_level'   => $educationLevel ?: 'All'
            ]);
        }

        public function programEvaluationStats(Request $request) {
            // 1) Fetch all programs
            $programsData = DB::table('programs')
                ->select('id as program_id', 'code as program_code', 'name as program_name')
                ->get();
        
            $results = [];
        
            foreach ($programsData as $program) {
                // 2) For each program, get distinct yearLevel values among Student users
                $yearLevels = DB::table('users')
                    ->where('role', 'Student')
                    ->where('program_id', $program->program_id)
                    ->distinct()
                    ->pluck('yearLevel'); 
        
                // If no students exist, skip to next program
                if ($yearLevels->isEmpty()) {
                    continue;
                }
        
                // 3) Loop through each yearLevel and compute stats
                foreach ($yearLevels as $yearLevel) {
                    // Total students in this program & year level
                    $totalStudents = DB::table('users')
                        ->where('role', 'Student')
                        ->where('program_id', $program->program_id)
                        ->where('yearLevel', $yearLevel)
                        ->count();
        
                    // Students in this program & year level who have submitted ≥1 evaluation
                    $submittedStudents = DB::table('evaluations')
                        ->join('users', 'evaluations.student_id', '=', 'users.id')
                        ->where('users.role', 'Student')
                        ->where('users.program_id', $program->program_id)
                        ->where('users.yearLevel', $yearLevel)
                        ->distinct('evaluations.student_id')
                        ->count('evaluations.student_id');
        
                    // 4) Push result for this (program, yearLevel)
                    $results[] = [
                        'program'        => $program->program_name,
                        'program_code'   => $program->program_code,
                        'yearLevel'      => $yearLevel,
                        'total_students' => $totalStudents,
                        'submitted'      => $submittedStudents,
                        'not_submitted'  => $totalStudents - $submittedStudents,
                        'school_year'    => null,
                        'semester'       => null,
                    ];
                }
            }
        
            return response()->json(['data' => $results]);
        }
        
        
    public function courseEvaluationSubmissionCounts(Request $request)
    {
    
        $courses = DB::table('programs')
            ->select('id as program_id', 'code as program_code', 'name as program_name')
            ->get();

        $results = [];

        foreach ($courses as $course) {
            $submittedCount = DB::table('evaluations')
                ->join('users', 'evaluations.student_id', '=', 'users.id')
                ->where('users.program_id', $course->program_id) 
                ->distinct('evaluations.student_id')
                ->count('evaluations.student_id');

            $results[] = [
                'course_code'   => $course->program_code, 
                'course_name'   => $course->program_name,
                'submitted_count' => $submittedCount,
            ];
        }

        return response()->json(['data' => $results]);
    }


    //Phase Management and Archives
    public function getCurrentPhase() {
        $phase = Setting::first()->evaluation_phase ?? 'Phase 1';
        return response()->json(['phase' => $phase]);
    }
    
    public function switchPhase(Request $request) {
        $request->validate([
            'phase' => 'required|in:Phase 1,Phase 2'
        ]);
    
        // Get or create settings
        $settings = Setting::first();
        if (!$settings) {
            $settings = Setting::create([
                'evaluation_phase' => 'Phase 1'
            ]);
        }
        
        $currentPhase = $settings->evaluation_phase;
        $newPhase = $request->phase;
    
        if ($currentPhase === 'Phase 1' && $newPhase === 'Phase 2') {
            $this->archiveEvaluations();
            $settings->update(['evaluation_phase' => $newPhase]);
            
            return response()->json([
                'message' => "Switched to $newPhase successfully",
                'previous_phase' => $currentPhase,
                'new_phase' => $newPhase,
                'clear_storage' => true
            ]);
        } elseif ($currentPhase === 'Phase 2' && $newPhase === 'Phase 1') {
            $this->restorePhaseOneData();
            $settings->update(['evaluation_phase' => $newPhase]);
            
            return response()->json([
                'message' => "Switched to $newPhase successfully",
                'previous_phase' => $currentPhase,
                'new_phase' => $newPhase,
                'clear_storage' => false
            ]);
        }
    
        return response()->json([
            'message' => "Switched to $newPhase successfully",
            'previous_phase' => $currentPhase,
            'new_phase' => $newPhase,
            'clear_storage' => false
        ]);
    }
    
    protected function archiveEvaluations() {
        DB::transaction(function () {
            // Archive evaluations
            $evaluations = Evaluation::with('responses')->get();

            foreach ($evaluations as $evaluation) {
                $archivedEvaluation = EvaluationArchive::create([
                    'student_id' => $evaluation->student_id,
                    'instructor_id' => $evaluation->instructor_id,
                    'school_year' => $evaluation->school_year,
                    'semester' => $evaluation->semester,
                    'status' => $evaluation->status,
                    'evaluated_at' => $evaluation->evaluated_at,
                    'phase' => 'Phase 1',
                    'created_at' => $evaluation->created_at,
                    'updated_at' => $evaluation->updated_at
                ]);

                foreach ($evaluation->responses as $response) {
                    EvaluationResponseArchive::create([
                        'evaluation_id' => $archivedEvaluation->id,
                        'question_id' => $response->question_id,
                        'rating' => $response->rating,
                        'comment' => $response->comment,
                        'created_at' => $response->created_at,
                        'updated_at' => $response->updated_at
                    ]);
                }

                $evaluation->responses()->delete();
                $evaluation->delete();
            }

            // Archive program assignments
            $programAssignments = DB::table('instructor_program')->get();
            foreach ($programAssignments as $assignment) {
                \App\Models\InstructorProgramArchive::create([
                    'instructor_id' => $assignment->instructor_id,
                    'program_id' => $assignment->program_id,
                    'yearLevel' => $assignment->yearLevel,
                    'phase' => 'Phase 1'
                ]);
            }
        });
    }
    
    protected function restorePhaseOneData() {
        DB::transaction(function () {
            // Restore evaluations
            $archivedEvaluations = EvaluationArchive::with('responses')
                ->where('phase', 'Phase 1')
                ->get();

            foreach ($archivedEvaluations as $archivedEvaluation) {
                $evaluation = Evaluation::create([
                    'student_id' => $archivedEvaluation->student_id,
                    'instructor_id' => $archivedEvaluation->instructor_id,
                    'school_year' => $archivedEvaluation->school_year,
                    'semester' => $archivedEvaluation->semester,
                    'status' => $archivedEvaluation->status,
                    'evaluated_at' => $archivedEvaluation->evaluated_at,
                    'created_at' => $archivedEvaluation->created_at,
                    'updated_at' => $archivedEvaluation->updated_at
                ]);

                foreach ($archivedEvaluation->responses as $response) {
                    EvaluationResponse::create([
                        'evaluation_id' => $evaluation->id,
                        'question_id' => $response->question_id,
                        'rating' => $response->rating,
                        'comment' => $response->comment,
                        'created_at' => $response->created_at,
                        'updated_at' => $response->updated_at
                    ]);
                }
            }

            // Restore program assignments
            $archivedAssignments = \App\Models\InstructorProgramArchive::where('phase', 'Phase 1')->get();
            foreach ($archivedAssignments as $archivedAssignment) {
                DB::table('instructor_program')->updateOrInsert(
                    [
                        'instructor_id' => $archivedAssignment->instructor_id,
                        'program_id' => $archivedAssignment->program_id,
                        'yearLevel' => $archivedAssignment->yearLevel
                    ],
                    [
                        'instructor_id' => $archivedAssignment->instructor_id,
                        'program_id' => $archivedAssignment->program_id,
                        'yearLevel' => $archivedAssignment->yearLevel
                    ]
                );
            }
        });
    }

    public function checkStorageStatus(Request $request) {
        $user = $request->user();
        if ($user->role !== 'Student') {
            return response()->json(['should_clear' => false]);
        }

        $settings = Setting::first();
        $lastClearTimestamp = $settings->storage_clear_timestamp;
        $userLastClear = $request->header('X-Last-Clear-Timestamp');

        // If there's no last clear timestamp for the user, or if the server's timestamp is newer
        $shouldClear = !$userLastClear || 
                      ($lastClearTimestamp && strtotime($lastClearTimestamp) > strtotime($userLastClear));

        return response()->json([
            'should_clear' => $shouldClear,
            'clear_timestamp' => $lastClearTimestamp
        ]);
    }

public function getInstructorEvaluationResults()
{
    $instructors = Instructor::with(['programs', 'evaluations'])
        ->withCount('evaluations')
        ->get()
        ->map(function ($instructor) {
            logger()->info("Processing instructor: " . $instructor->id);
            $ratings = [];
            for ($i = 1; $i <= 9; $i++) {
                $average = EvaluationResponse::whereHas('evaluation', function ($q) use ($instructor) {
                        $q->where('instructor_id', $instructor->id);
                    })
                    ->where('question_id', $i)
                    ->avg('rating');

                $ratings['Qn' . $i] = $average ? round($average, 2) : null;
            }

            $validRatings = array_filter($ratings);
            $overallRating = !empty($validRatings)
                ? round(array_sum($validRatings) / count($validRatings) * 20, 2)
                : 0;

            $comments = EvaluationResponse::whereHas('evaluation', function ($q) use ($instructor) {
                    $q->where('instructor_id', $instructor->id);
                })
                ->whereNotNull('comment')
                ->where('comment', '<>', '')
                ->pluck('comment')
                ->implode(' | ');

            return [
                'ID' => $instructor->id,
                'Name' => $instructor->name,
                'Email' => $instructor->email,
                'Education Level' => $instructor->educationLevel,
                'Programs' => $instructor->programs->pluck('name')->implode(', '),
                'Qn1' => $ratings['Qn1'] ?? '-',
                'Qn2' => $ratings['Qn2'] ?? '-',
                'Qn3' => $ratings['Qn3'] ?? '-',
                'Qn4' => $ratings['Qn4'] ?? '-',
                'Qn5' => $ratings['Qn5'] ?? '-',
                'Qn6' => $ratings['Qn6'] ?? '-',
                'Qn7' => $ratings['Qn7'] ?? '-',
                'Qn8' => $ratings['Qn8'] ?? '-',
                'Qn9' => $ratings['Qn9'] ?? '-',
                'Comments' => Str::limit($comments, 100, '...') ?: 'No comments',
                'Percentage' => $overallRating,
                'Evaluation Count' => $instructor->evaluations_count,
            ];
        });

    return response()->json($instructors);
}

public function exportInstructorResultsPdf()
{
    $instructors = $this->getInstructorEvaluationResults()->getData();
    
    // Convert stdClass objects to arrays if needed
    $data = array_map(function($item) {
        return (array)$item;
    }, (array)$instructors);

    $pdf = PDF::loadView('evaluations.instructors_pdf', ['data' => $data]);
    return $pdf->download('instructor-evaluation-results.pdf');
}

public function exportInstructorResultsCsv() {
    $instructors = $this->getInstructorEvaluationResults()->getData();
    
    // Convert stdClass objects to arrays if needed
    $data = array_map(function($item) {
        return (array)$item;
    }, (array)$instructors);

    $headers = [
        'Content-Type' => 'text/csv',
        'Content-Disposition' => 'attachment; filename="instructor-evaluation-results.csv"',
    ];

    // Define columns (without Education Level and Programs)
    $columns = [
        'ID', 'Name', 'Email',
        'Qn1', 'Qn2', 'Qn3', 'Qn4', 'Qn5', 'Qn6', 'Qn7', 'Qn8', 'Qn9',
        'Percentage', 'Evaluation Count'
    ];

    $callback = function () use ($data, $columns) {
        $file = fopen('php://output', 'w');
        
        // Add BOM to fix UTF-8 encoding in Excel
        fwrite($file, "\xEF\xBB\xBF");
        
        fputcsv($file, $columns);

        foreach ($data as $instructor) {
            fputcsv($file, [
                $instructor['ID'] ?? '',
                $instructor['Name'] ?? '',
                $instructor['Email'] ?? '',
                $instructor['Qn1'] ?? '-',
                $instructor['Qn2'] ?? '-',
                $instructor['Qn3'] ?? '-',
                $instructor['Qn4'] ?? '-',
                $instructor['Qn5'] ?? '-',
                $instructor['Qn6'] ?? '-',
                $instructor['Qn7'] ?? '-',
                $instructor['Qn8'] ?? '-',
                $instructor['Qn9'] ?? '-',
                $instructor['Percentage'] ?? '0',
                $instructor['Evaluation Count'] ?? '0',
            ]);
        }

        fclose($file);
    };

    return response()->stream($callback, 200, $headers);
}
}
