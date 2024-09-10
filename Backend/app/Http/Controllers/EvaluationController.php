<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use Illuminate\Http\Request;

class EvaluationController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'rating' => 'required|integer|between:1,5',
            'comment' => 'string|nullable',
        ]);

        return Evaluation::create($request->all());
    }
}

