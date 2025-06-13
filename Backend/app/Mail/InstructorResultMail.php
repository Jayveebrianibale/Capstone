<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InstructorResultMail extends Mailable
{
    use Queueable, SerializesModels;

    public $instructor;
    public $pdfUrl;
    public $comments;

    public function __construct($instructor, $pdfUrl, $comments = [])
    {
        $this->instructor = $instructor;
        $this->pdfUrl = $pdfUrl;
        $this->comments = $comments;
    }

    public function build()
    {
        return $this->subject("Evaluation Result for {$this->instructor->name}")
                    ->view('emails.instructor-result');
    }
}
