<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['title', 'description', 'employer_id', 'status'])]

class JobPosting extends Model
{
    /** @use HasFactory<\Database\Factories\JobPostingFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<User,JobPosting>
     */
    public function employer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'employer_id');
    }
}
