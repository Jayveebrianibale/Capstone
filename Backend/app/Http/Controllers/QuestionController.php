<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Question;

class QuestionController extends Controller
{
    // Store Multiple Questions
    public function store(Request $request)
    {
        $validated = $request->validate([
            'questions' => 'required|array|min:1',
            'questions.*.question' => 'required|string',
            'questions.*.type' => 'required|string',
            'questions.*.category' => 'required|string',
        ]);

        $createdQuestions = Question::insert($validated['questions']);

        return response()->json(['message' => 'Questions saved successfully', 'questions' => $createdQuestions], 201);
    }

    // Get All Questions
    public function index()
    {
        return response()->json(Question::all());
    }

    // Update a question
    public function update(Request $request, $id)
    {
        $question = Question::find($id);
    
        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }
    
        $request->validate([
            'question' => 'required|string',
            'type' => 'required|string',
            'category' => 'required|string',
        ]);
    
        $question->update($request->all());
    
        return response()->json(['message' => 'Question updated successfully', 'question' => $question]);
    }
    

    // Delete a question
    public function destroy($id)
    {
        $question = Question::findOrFail($id);
        $question->delete();

        return response()->json(['message' => 'Question deleted successfully']);
    }
}

