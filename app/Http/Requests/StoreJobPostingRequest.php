<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreJobPostingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|min:5|max:30',
            'employmentType' => 'required|in:full-time,part-time,contract,freelance',
            'workPlaceType' => 'required|in:hybrid,remote,onsite',
            'location' => 'required|string|max:255',
            'description' => 'required|string|min:5|max:1023',
            'minSalary' => 'required|numeric|lt:maxSalary',
            'maxSalary' => 'required|numeric|gt:minSalary',
            'status' => 'nullable|in:pending,active,closed',
        ];
    }
}
