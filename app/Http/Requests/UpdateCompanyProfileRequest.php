<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanyProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:255'],
            'company_description' => ['nullable', 'string', 'max:2000'],
            'website' => ['nullable', 'url', 'max:500'],
            'industry' => ['nullable', 'string', 'max:255'],
            'company_size' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
            'founded_year' => ['nullable', 'integer', 'min:1800', 'max:' . date('Y')],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }
}
