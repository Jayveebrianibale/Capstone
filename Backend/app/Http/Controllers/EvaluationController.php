<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Instructor;
use App\Models\Course;
use App\Models\Evaluation;
use App\Models\EvaluationResponse;
use App\Models\Question;


class EvaluationController extends Controller {

        public function index(Request $request) {
            $user = $request->user();
            $evaluations = Evaluation::with('instructor')
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
                'instructor_id' => 'required|exists:users,id',
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



}
