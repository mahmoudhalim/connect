<?php

namespace App\Http\Requests\Candidate;

use Illuminate\Foundation\Http\FormRequest;

class ApplyJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'job_posting_id' => 'required|exists:job_postings,id',
            'contact_email' => 'required|email',
            'contact_phone' => 'nullable|string|max:20',
            'portfolio_url' => 'nullable|url|max:500',
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ];
    }
}
