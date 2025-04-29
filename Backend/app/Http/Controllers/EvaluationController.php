<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Instructor;
use App\Models\Course;
use App\Models\Evaluation;
use App\Models\EvaluationResponse;
use App\Models\Question;


class EvaluationController extends Controller
{
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
    ]);

    $evaluation = Evaluation::create([
        'student_id' => $user->id,
        'instructor_id' => $validated['instructor_id'],
    ]);

    foreach ($validated['responses'] as $response) {
        EvaluationResponse::create([
            'evaluation_id' => $evaluation->id,
            'question_id' => $response['question_id'],
            'rating' => $response['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);
    }

    return response()->json(['message' => 'Evaluation submitted successfully.'], 201);
}
}
