<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Question;
use App\Models\Instructor;

class InstructorEvaluationResult extends Mailable
{
    use Queueable, SerializesModels;

    public $instructor;
    public $comments;
    public $questions;
    public $ratings;
    public $pdfUrl;

    public function __construct(Instructor $instructor, array $comments, string $pdfUrl)
    {
        $this->instructor = $instructor;
        $this->comments = $comments;
        $this->pdfUrl = $pdfUrl;
        
        // Get questions and calculate ratings
        $this->questions = Question::all();
        $this->ratings = [];
        
        foreach ($this->questions as $index => $question) {
            $questionId = $question->id;
            $total = 0;
            $count = 0;
            
            $evaluations = $instructor->evaluations;
            foreach ($evaluations as $evaluation) {
                $response = $evaluation->responses()
                    ->where('question_id', $questionId)
                    ->first();
                if ($response) {
                    $total += $response->rating;
                    $count++;
                }
            }
            
            $this->ratings['q' . ($index + 1)] = $count > 0 ? $total / $count : null;
        }
    }

    public function build()
    {
        return $this->subject('Your Instructor Evaluation Results')
                    ->view('emails.instructor-result')
                    ->with([
                        'instructor' => $this->instructor,
                        'comments' => $this->comments,
                        'questions' => $this->questions,
                        'ratings' => $this->ratings,
                        'pdfUrl' => $this->pdfUrl
                    ]);
    }
} 