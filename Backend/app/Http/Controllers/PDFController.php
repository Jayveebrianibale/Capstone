<?php

namespace App\Http\Controllers;

use App\Models\Instructor;
use App\Models\Question;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\Evaluation;

class PDFController extends Controller
{
    public function generatePDF($id)
    {
        try {
            // Get instructor with programs and their pivot data
            $instructor = Instructor::with(['programs' => function($query) {
                $query->withPivot('yearLevel');
            }])->findOrFail($id);

            // Get year level from the pivot table
            $yearLevel = 1; // Default to 1
            if ($instructor->programs->isNotEmpty()) {
                $firstProgram = $instructor->programs->first();
                if ($firstProgram->pivot && isset($firstProgram->pivot->yearLevel)) {
                    $yearLevel = (int)$firstProgram->pivot->yearLevel;
                }
            }

            // Get questions and ratings
            $questions = Question::all();
            
            // Fetch evaluations before using in ratings calculation
            $evaluations = Evaluation::where('instructor_id', $id)->get();
            $ratings = [];
            foreach ($questions as $index => $question) {
                $questionId = $question->id;
                $total = 0;
                $count = 0;
                foreach ($evaluations as $evaluation) {
                    // Get all responses for this evaluation and question
                    $response = $evaluation->responses()
                        ->where('question_id', $questionId)
                        ->first();
                    if ($response) {
                        $total += $response->rating;
                        $count++;
                    }
                }
                $ratings['q' . ($index + 1)] = $count > 0 ? $total / $count : null;
            }

            Log::info('Calculated Ratings:', ['ratings' => $ratings]);

            $comments = $instructor->comments ?? 'Not specified';

            // Calculate overall rating (average of all ratings, as percentage)
            $overallRating = 0;
            if (!empty($ratings) && count($questions) > 0) {
                $sum = array_sum($ratings);
                $count = count($ratings);
                if ($count > 0) {
                    $overallRating = ($sum / $count) * 20; // 5*20=100
                }
            }
            $instructor->overallRating = $overallRating;

            // Prepare data for the view
            $data = [
                'instructor' => $instructor,
                'questions' => $questions,
                'ratings' => $ratings,
                'comments' => $comments,
                'yearLevel' => $yearLevel,
                'overallRating' => $overallRating,
                'evaluations' => $evaluations 
            ];

            // Generate PDF with options
            $pdf = Pdf::loadView('pdf.instructor-evaluation', $data);
            $pdf->setPaper('A4', 'portrait')->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
                'defaultFont' => 'sans-serif',
            ]);

            return $pdf->stream("instructor_{$instructor->id}_evaluation.pdf");

        } catch (\Exception $e) {
            Log::error('PDF Generation Error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'instructor_id' => $id,
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
            return response()->json(['message' => 'Error generating PDF: ' . $e->getMessage()], 500);
        }
    }
}
