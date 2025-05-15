<?php

namespace App\Http\Controllers;

use App\Models\Instructor;
use App\Models\Question;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;

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
            $ratings = json_decode($instructor->ratings, true) ?? [];
            $comments = $instructor->comments ?? 'Not specified';

            // Calculate overall rating (average of all ratings, as percentage)
            $overallRating = 0;
            if (!empty($ratings) && count($questions) > 0) {
                $sum = 0;
                $count = 0;
                foreach ($questions as $index => $question) {
                    $key = 'q' . ($index + 1);
                    if (isset($ratings[$key])) {
                        $sum += $ratings[$key];
                        $count++;
                    }
                }
                if ($count > 0) {
                    // If your ratings are out of 5, convert to percent
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
                'overallRating' => $overallRating
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
