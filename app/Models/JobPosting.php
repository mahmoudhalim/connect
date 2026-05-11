<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['title', 'description', 'employer_id', 'status', 'location', 'employmentType', 'workPlaceType', 'minSalary', 'maxSalary', 'category_id', 'experience_level', 'requirements', 'benefits', 'deadline', 'company_logo'])]

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

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class, 'job_posting_id');
    }
}
