<?php

namespace App\Http\Controllers;

use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class SectionController extends Controller
{
    public function index(Request $request)
    {
        $query = Section::query();

        if ($request->has('grade_level')) {
            $query->where('year_level', $request->grade_level);
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        // Handle both single and bulk section creation
        if ($request->has('sections')) {
            // Bulk creation
            $validator = Validator::make($request->all(), [
                'sections' => 'required|array|min:1',
                'sections.*.name' => 'required|string|max:255',
                'sections.*.year_level' => 'required|integer',
                'sections.*.category' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $createdSections = [];
            $errors = [];

            DB::beginTransaction();
            try {
                foreach ($request->sections as $sectionData) {
                    // Generate unique code for each section
                    $code = $sectionData['category'] . '-' . $sectionData['year_level'] . '-' . $sectionData['name'];
                    
                    // Check if section with same code already exists
                    $existingSection = Section::where('code', $code)->first();
                    if ($existingSection) {
                        $errors[] = [
                            'name' => $sectionData['name'],
                            'error' => 'Section with this name already exists for this grade level'
                        ];
                        continue;
                    }

                    $section = Section::create([
                        'name' => $sectionData['name'],
                        'code' => $code,
                        'year_level' => $sectionData['year_level'],
                        'category' => $sectionData['category']
                    ]);

                    $createdSections[] = $section;
                }

                DB::commit();

                return response()->json([
                    'message' => 'Sections created successfully',
                    'sections' => $createdSections,
                    'errors' => $errors
                ], 201);

            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Failed to create sections',
                    'error' => $e->getMessage()
                ], 500);
            }
        } else {
            // Single section creation
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'code' => 'required|string|unique:sections,code',
                'year_level' => 'required|integer',
                'category' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $section = Section::create($request->all());
            return response()->json($section, 201);
        }
    }

    public function destroy($id)
    {
        $section = Section::findOrFail($id);
        $section->delete();
        return response()->json(['message' => 'Section deleted successfully']);
    }

    public function update(Request $request, $id)
    {
        $section = Section::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:sections,code,' . $id,
            'year_level' => 'required|integer',
            'category' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $section->update($request->all());
        return response()->json($section);
    }
} 