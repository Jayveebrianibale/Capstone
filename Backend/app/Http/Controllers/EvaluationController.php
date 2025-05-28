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


            public function store(Request $request)
        {
            $user = auth()->user();

            if ($user->role !== 'Student') {
                return response()->json(['message' => 'Only students can submit evaluations.'], 403);
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

        public function overallEvaluationSubmissionStats() {
            // Get all students' IDs
            $allStudents = DB::table('users')
                ->where('role', 'Student')
                ->pluck('id');
        
            // Get distinct student IDs who submitted evaluations
            $submittedStudentIds = DB::table('evaluations')
                ->distinct()
                ->pluck('student_id');
        
            // Count submitted and not submitted
            $submittedCount = $submittedStudentIds->count();
            $notSubmittedCount = $allStudents->diff($submittedStudentIds)->count();
        
            return response()->json([
                'total_students'    => $allStudents->count(),
                'submitted'         => $submittedCount,
                'not_submitted'     => $notSubmittedCount,
            ]);
        }

    public function programEvaluationStats(Request $request)
    {
        $programsData = DB::table('programs')
            ->select('id as program_id', 'code as program_code', 'name as program_name')
            ->get();

        $results = [];

        foreach ($programsData as $program) {
            // Total students in this program
            $totalStudents = DB::table('users')
                ->where('role', 'Student')
                ->where('program_id', $program->program_id)
                ->count();

            // Students in this program who have submitted at least one evaluation
            // We need to count distinct students who have an entry in the evaluations table for any instructor.
            $submittedStudents = DB::table('evaluations')
                ->join('users', 'evaluations.student_id', '=', 'users.id')
                ->where('users.role', 'Student')
                ->where('users.program_id', $program->program_id)
                ->distinct('evaluations.student_id')
                ->count('evaluations.student_id');
            
            // Only add if there are students in the program, to avoid cluttering with empty programs
            if ($totalStudents > 0) {
                $results[] = [
                    // 'instructor' field is not relevant here as per the desired output structure
                    'program'        => $program->program_name,
                    'program_code'   => $program->program_code,
                    'yearLevel'      => null, 
                    'total_students' => $totalStudents,
                    'submitted'      => $submittedStudents,
                    'not_submitted'  => $totalStudents - $submittedStudents,
                    'school_year'    => null, 
                    'semester'       => null  
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



}
