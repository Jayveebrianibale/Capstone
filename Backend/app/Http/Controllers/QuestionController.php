<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Question;
use Illuminate\Support\Facades\Validator;

/**
 * Class QuestionController
 * 
 * Handles operations for creating, retrieving, updating, and deleting questions.
 */
class QuestionController extends Controller
{
    public function bulkUpload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
        ]);

        $path = $request->file('file')->getRealPath();
        $rows = array_map('str_getcsv', file($path));

        // first row = header
        $header = array_map('trim', array_shift($rows));

        $inserted = [];
        $errors   = [];

        foreach ($rows as $i => $row) {
            $data = array_combine($header, $row);

            $validator = Validator::make($data, [
                'question' => 'required|string',
                'type'     => 'required|string',
                'category' => 'required|string',
            ]);

            if ($validator->fails()) {
                $errors[] = [
                    'row'    => $i + 2, // account for header + zero idx
                    'errors' => $validator->errors()->all(),
                ];
                continue;
            }

            $inserted[] = Question::create([
                'question' => $data['question'],
                'type'     => $data['type'],
                'category' => $data['category'],
            ]);
        }

        return response()->json([
            'message'   => 'Questions uploaded successfully',
            'inserted'  => count($inserted),
            'errors'    => $errors,
        ], 201);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'questions' => 'required|array|min:1',
            'questions.*.question' => 'required|string',
            'questions.*.type' => 'required|string',
            'questions.*.category' => 'required|string',
        ]);

        $createdQuestions = Question::insert($validated['questions']);

        return response()->json([
            'message' => 'Questions saved successfully',
            'questions' => $createdQuestions
        ], 201);
    }

    public function index()
    {
        return response()->json(Question::whereNull('deleted_at')->get());
    }

    public function update(Request $request, $id)
    {
        $question = Question::whereNull('deleted_at')->find($id);

        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        $request->validate([
            'question' => 'required|string',
            'type' => 'required|string',
            'category' => 'required|string',
        ]);

        $question->update($request->all());

        return response()->json([
            'message' => 'Question updated successfully',
            'question' => $question
        ]);
    }

    public function destroy($id)
    {
        $question = Question::whereNull('deleted_at')->findOrFail($id);
        $question->delete(); // This will now soft delete the question

        return response()->json(['message' => 'Question deleted successfully']);
    }
}
