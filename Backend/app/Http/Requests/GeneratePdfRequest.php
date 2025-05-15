<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GeneratePdfRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Allow the request
    }

    public function rules(): array
    {
        return [
            'yearLevel' => 'in:1,2,3,4'
        ];
    }
}
