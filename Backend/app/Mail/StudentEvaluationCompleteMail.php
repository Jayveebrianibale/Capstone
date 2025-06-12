<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class StudentEvaluationCompleteMail extends Mailable
{
    use Queueable, SerializesModels;

    public $studentName;
    public $schoolYear;
    public $semester;
    public $instructorCount;
    public $submissionDate;

    /**
     * Create a new message instance.
     */
    public function __construct($studentName, $schoolYear, $semester, $instructorCount)
    {
        $this->studentName = $studentName;
        $this->schoolYear = $schoolYear;
        $this->semester = $semester;
        $this->instructorCount = $instructorCount;
        $this->submissionDate = now()->setTimezone('Asia/Manila')->format('F j, Y g:i A');
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): \Illuminate\Mail\Mailables\Envelope
    {
        return new \Illuminate\Mail\Mailables\Envelope(
            subject: 'Evaluation Completion Confirmation - LVCC',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): \Illuminate\Mail\Mailables\Content
    {
        return new \Illuminate\Mail\Mailables\Content(
            view: 'emails.student-evaluation-complete',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
} 