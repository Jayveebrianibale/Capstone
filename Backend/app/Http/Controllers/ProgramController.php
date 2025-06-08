<?php

namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;
use App\Models\Instructor;
use Illuminate\Support\Facades\Validator;


class ProgramController extends Controller
{
    


public function bulkUpload(Request $request) {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
        ]);

        $path = $request->file('file')->getRealPath();
        $rows = array_map('str_getcsv', file($path));

        // First row = header
        $header = array_map('trim', array_shift($rows));

        $inserted = [];
        $errors   = [];
        $skipped  = [];

        foreach ($rows as $i => $row) {
            $data = array_combine($header, $row);
            $data = array_map('trim', $data);

            // Basic validation
            $validator = Validator::make($data, [
                'name'      => 'required|string|max:255',
                'code'      => 'required|string|max:255',
                'yearLevel' => 'nullable|string',
                'category'  => 'required|string',
            ]);

            if ($validator->fails()) {
                $errors[] = [
                    'row'    => $i + 2,
                    'errors' => $validator->errors()->all(),
                ];
                continue;
            }

            // Check for existing program with same code and year level
            $existingProgram = Program::where('code', $data['code'])
                                   ->where('yearLevel', $data['yearLevel'])
                                   ->where('category', ucwords(str_replace('_',' ',$data['category'])))
                                   ->first();
            
            if ($existingProgram) {
                $skipped[] = [
                    'row' => $i + 2,
                    'code' => $data['code'],
                    'yearLevel' => $data['yearLevel'],
                    'message' => "Program with code '{$data['code']}' and year level '{$data['yearLevel']}' already exists"
                ];
                continue;
            }

            try {
                // Create
                $inserted[] = Program::create([
                    'name'      => $data['name'],
                    'code'      => $data['code'],
                    'yearLevel' => $data['yearLevel'],
                    'category'  => ucwords(str_replace('_',' ',$data['category'])),
                ]);
            } catch (\Exception $e) {
                $errors[] = [
                    'row' => $i + 2,
                    'errors' => [$e->getMessage()]
                ];
            }
        }

        return response()->json([
            'message'  => 'Programs upload complete',
            'inserted' => count($inserted),
            'skipped'  => $skipped,
            'errors'   => $errors,
        ], 201);
    }

    //  Retrieves all programs.
    public function index()
    {
        $programs = Program::all();
        return response()->json(['programs' => $programs]);
    }

   
    // Stores a new program if it doesn't already exist.
    public function store(Request $request)
    {
        // Validate request data
        $request->validate([
            'name' => 'required|string',
            'code' => 'required|string',
            'yearLevel' => 'nullable|string',
            'category' => 'nullable|string',
        ]);

        // For Senior High programs, check only by name and category
        if ($request->category === 'SHS') {
            $existingProgram = Program::where('name', $request->name)
                                    ->where('category', 'SHS')
                                    ->first();
        } else {
            // For other programs, check by name, code, and year level
            $existingProgram = Program::where('name', $request->name)
                                    ->where('code', $request->code)
                                    ->where('yearLevel', $request->yearLevel)
                                    ->first();
        }

        if ($existingProgram) {
            return response()->json([
                'message' => 'Program with the same name already exists'
            ], 422);
        }

        // Create the new program
        $program = Program::create([
            'name' => $request->name,
            'code' => $request->code,
            'yearLevel' => $request->yearLevel,
            'category' => ucwords(str_replace('_', ' ', $request->category)),
        ]);

        return response()->json([
            'message' => 'Program created successfully',
            'program' => $program
        ], 201);
    }

    
    // Retrieves the year levels of a program by its ID.
    public function getYearLevels($programId)
    {
        $program = Program::find($programId);

        if (!$program) {
            return response()->json(['message' => 'Program not found'], 404);
        }

        $yearLevels = $program->yearLevel;

        return response()->json($yearLevels);
    }

    
     // Displays a specific program with its levels.
    public function show($id)
    {
        $program = Program::with('levels')->findOrFail($id);
        return response()->json($program);
    }

    
    // Updates a specific program's details.
    
    public function update(Request $request, $id)
    {
        // Validate request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:255',
            'yearLevel' => 'nullable|string',
            'category' => 'required|string'
        ]);

        // Find and update the program
        $program = Program::findOrFail($id);
        $program->update($validated);

        return response()->json([
            'message' => 'Program updated successfully',
            'program' => $program 
        ]);
    }

     // Deletes a program.
    public function destroy($id)
    {
        $program = Program::findOrFail($id);
        $program->delete();

        return response()->json(['message' => 'Program deleted successfully']);
    }

   
     // Retrieves instructors assigned to a program by its code.
    public function getInstructorsByProgramCode($programCode)
    {
        $program = Program::where('code', $programCode)->first();

        if (!$program) {
            return response()->json(['error' => 'Program not found'], 404);
        }

        $instructors = $program->instructors;
        \Log::info('Instructors for program ' . $programCode, $instructors->toArray());

        if ($instructors->isEmpty()) {
            return response()->json(['message' => 'No instructors assigned'], 200);
        }

        return response()->json($instructors);
    }

    // Retrieves programs based on category
    public function getProgramsByCategory($category)
    {
        $programs = Program::where('category', ucwords(str_replace('_', ' ', $category)))->get();

        if ($programs->isEmpty()) {
            return response()->json(['message' => 'No programs found for this category'], 404);
        }

        return response()->json($programs);
    }
    
    public function getInstructorResultsByProgram($code) {

        $program = Program::where('code', $code)->firstOrFail();

        $instructors = $program->instructors()->with(['evaluations.responses.question'])->get();

        $results = $instructors->map(function ($instructor) {
            $responses = $instructor->evaluations->flatMap->responses;

            $grouped = $responses->groupBy('question_id');

            $questionAverages = [];
            $totalSum = 0;
            $totalCount = 0;

            foreach ($grouped as $questionId => $responseGroup) {
                $ratingCounts = $responseGroup->groupBy('rating')->map->count();

                $sum = 0;
                $count = 0;
                foreach (range(1, 5) as $rating) {
                    $num = $ratingCounts->get($rating, 0);
                    $sum += $rating * $num;
                    $count += $num;
                }

                $average = $count > 0 ? $sum / $count : 0;
                $questionAverages[$questionId] = round($average, 2);

                $totalSum += $sum;
                $totalCount += $count;
            }

            $percentage = $totalCount > 0 ? ($totalSum / ($totalCount * 5)) * 100 : 0;

            $comments = $responses->pluck('comment')->filter()->unique()->values();

            return [
                'instructorId' => $instructor->id,
                'email' => $instructor->email,
                'name' => $instructor->name,
                'pivot' => [
                    'yearLevel' => $instructor->pivot->yearLevel,
                ],
                'ratings' => [
                    'q1' => $questionAverages[1] ?? null,
                    'q2' => $questionAverages[2] ?? null,
                    'q3' => $questionAverages[3] ?? null,
                    'q4' => $questionAverages[4] ?? null,
                    'q5' => $questionAverages[5] ?? null,
                    'q6' => $questionAverages[6] ?? null,
                    'q7' => $questionAverages[7] ?? null,
                    'q8' => $questionAverages[8] ?? null,
                    'q9' => $questionAverages[9] ?? null,
                ],
                'comments' => $comments->isEmpty() ? 'No comments' : $comments->join(', '),
                'overallRating' => round($percentage, 2),
            ];
        });

        return response()->json($results);
    }

    public function getFilteredInstructorResultsByProgram($code, Request $request) {
        $program = Program::where('code', $code)->firstOrFail();

        $instructors = $program->instructors()
            ->with(['evaluations' => function($query) use ($request) {
                // Apply school year filter if provided
                if ($request->has('school_year') && $request->school_year) {
                    $query->where('school_year', $request->school_year);
                }
                
                // Apply semester filter if provided
                if ($request->has('semester') && $request->semester) {
                    $query->where('semester', $request->semester);
                }
                
                $query->with('responses.question');
            }])
            ->get();

        // Reuse the exact same mapping logic from your original method
        $results = $instructors->map(function ($instructor) {
            $responses = $instructor->evaluations->flatMap->responses;

            $grouped = $responses->groupBy('question_id');

            $questionAverages = [];
            $totalSum = 0;
            $totalCount = 0;

            foreach ($grouped as $questionId => $responseGroup) {
                $ratingCounts = $responseGroup->groupBy('rating')->map->count();

                $sum = 0;
                $count = 0;
                foreach (range(1, 5) as $rating) {
                    $num = $ratingCounts->get($rating, 0);
                    $sum += $rating * $num;
                    $count += $num;
                }

                $average = $count > 0 ? $sum / $count : 0;
                $questionAverages[$questionId] = round($average, 2);

                $totalSum += $sum;
                $totalCount += $count;
            }

            $percentage = $totalCount > 0 ? ($totalSum / ($totalCount * 5)) * 100 : 0;

            $comments = $responses->pluck('comment')->filter()->unique()->values();

            return [
                'instructorId' => $instructor->id,
                'email' => $instructor->email,
                'name' => $instructor->name,
                'pivot' => [
                    'yearLevel' => $instructor->pivot->yearLevel,
                ],
                'ratings' => [
                    'q1' => $questionAverages[1] ?? null,
                    'q2' => $questionAverages[2] ?? null,
                    'q3' => $questionAverages[3] ?? null,
                    'q4' => $questionAverages[4] ?? null,
                    'q5' => $questionAverages[5] ?? null,
                    'q6' => $questionAverages[6] ?? null,
                    'q7' => $questionAverages[7] ?? null,
                    'q8' => $questionAverages[8] ?? null,
                    'q9' => $questionAverages[9] ?? null,
                ],
                'comments' => $comments->isEmpty() ? 'No comments' : $comments->join(', '),
                'overallRating' => round($percentage, 2),
            ];
        });

        return response()->json($results);
    }
}