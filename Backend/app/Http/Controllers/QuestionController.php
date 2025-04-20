<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Question;

/**
 * Class QuestionController
 * 
 * Handles operations for creating, retrieving, updating, and deleting questions.
 */
class QuestionController extends Controller
{
    /**
     * Stores multiple questions in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validate the incoming questions array
        $validated = $request->validate([
            'questions' => 'required|array|min:1',
            'questions.*.question' => 'required|string',
            'questions.*.type' => 'required|string',
            'questions.*.category' => 'required|string',
        ]);

        // Insert multiple questions at once
        $createdQuestions = Question::insert($validated['questions']);

        return response()->json([
            'message' => 'Questions saved successfully',
            'questions' => $createdQuestions
        ], 201);
    }

    /**
     * Retrieves all questions.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return response()->json(Question::all());
    }

    /**
     * Updates a specific question by its ID.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $question = Question::find($id);

        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        // Validate the updated data
        $request->validate([
            'question' => 'required|string',
            'type' => 'required|string',
            'category' => 'required|string',
        ]);

        // Update the question with the validated data
        $question->update($request->all());

        return response()->json([
            'message' => 'Question updated successfully',
            'question' => $question
        ]);
    }

    /**
     * Deletes a specific question by its ID.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $question = Question::findOrFail($id);
        $question->delete();

        return response()->json(['message' => 'Question deleted successfully']);
    }
}
