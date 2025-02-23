<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class QuestionController extends Controller {
    
    // Store multiple questions
    public function store(Request $request): JsonResponse {
        $validated = $request->validate([
            'questions' => 'required|array|min:1',
            'questions.*.question' => 'required|string|max:255',
            'questions.*.type' => 'required|in:Likert Scale,Multiple Choice,Short Answer',
            'questions.*.category' => 'required|in:Teaching Effectiveness,Classroom Management,Student Engagement',
        ]);

        // Insert questions into the database
        $savedQuestions = Question::insert($validated['questions']);

        return response()->json([
            'message' => 'Questions saved successfully!',
            'success' => $savedQuestions
        ], 201);
    }

    // Fetch all questions
    public function index(): JsonResponse {
        return response()->json(Question::all(), 200);
    }

    // Update a question
    public function update(Request $request, $id): JsonResponse {
        $question = Question::find($id);
        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'type' => 'required|in:Likert Scale,Multiple Choice,Short Answer',
            'category' => 'required|in:Teaching Effectiveness,Classroom Management,Student Engagement',
        ]);

        $question->update($validated);

        return response()->json(['message' => 'Question updated successfully!', 'question' => $question], 200);
    }

    // Delete a question
    public function destroy($id): JsonResponse {
        $question = Question::find($id);
        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        $question->delete();

        return response()->json(['message' => 'Question deleted successfully!'], 200);
    }
}

