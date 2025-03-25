<?php

namespace App\Http\Controllers;

use App\Models\Level;
use Illuminate\Http\Request;

class LevelController extends Controller
{
    public function index()
    {
        return response()->json(Level::with('program')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'program_id' => 'required|exists:programs,id',
        ]);

        $level = Level::create($request->all());

        return response()->json(['message' => 'Level created', 'level' => $level], 201);
    }

    public function destroy(Level $level)
    {
        $level->delete();
        return response()->json(['message' => 'Level deleted'], 200);
    }
}
