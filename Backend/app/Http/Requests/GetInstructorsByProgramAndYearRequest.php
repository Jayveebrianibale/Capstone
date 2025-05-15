<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GetInstructorsByProgramAndYearRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // or add your own gate logic
    }

    public function rules(): array
    {
        return [
            // Laravel will pull these from the route parameters
            'programId'  => 'required|integer|exists:programs,id',
            'yearLevel'  => 'required|integer|in:1,2,3,4',
        ];
    }

    // If you need to rename the keys to match your route placeholders:
    public function validationData()
    {
        return [
            'programId' => $this->route('programId'),
            'yearLevel' => $this->route('yearLevel'),
        ];
    }
}
