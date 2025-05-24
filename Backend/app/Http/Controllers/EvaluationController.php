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
        public function getAllInstructorDistributions() {
            $instructors = DB::table('evaluations')
                ->join('evaluation_responses', 'evaluations.id', '=', 'evaluation_responses.evaluation_id')
                ->join('instructors', 'evaluations.instructor_id', '=', 'instructors.id')
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
    
    

}
