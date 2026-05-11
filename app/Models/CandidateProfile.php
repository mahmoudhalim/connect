<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CandidateProfile extends Model
{
    protected $fillable = [
        'user_id',
        'headline',
        'bio',
        'location',
        'phone',
        'portfolio_url',
        'linkedin_url',
        'resume_path',
        'experience_years',
        'education',
        'skills',
    ];

    protected function casts(): array
    {
        return [
            'skills' => 'array',
            'experience_years' => 'float',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
