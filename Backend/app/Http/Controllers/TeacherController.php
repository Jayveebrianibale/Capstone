<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function index()
    {
        return Teacher::all();
    }

    public function show($id)
    {
        return Teacher::with('evaluations')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
        ]);

        return Teacher::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'string|max:255',
            'subject' => 'string|max:255',
        ]);

        $teacher = Teacher::findOrFail($id);
        $teacher->update($request->all());

        return $teacher;
    }

    public function destroy($id)
    {
        $teacher = Teacher::findOrFail($id);
        $teacher->delete();

        return response()->noContent();
    }
}

