<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['title', 'description', 'employer_id', 'status', 'location', 'employmentType', 'workPlaceType', 'minSalary', 'maxSalary', 'category_id', 'experience_level', 'requirements', 'benefits', 'deadline', 'company_logo'])]

class JobPosting extends Model
{
    /** @use HasFactory<\Database\Factories\JobPostingFactory> */
    use HasFactory;

    #[Scope]
    public function filters(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? null, fn ($q) => $q->where(fn ($inner) => $inner->where('title', 'like', "%{$filters['search']}%")->orWhere('description', 'like', "%{$filters['search']}%")))
            ->when($filters['location'] ?? null, fn ($q) => $q->where('location', 'like', "%{$filters['location']}%"))
            ->when($filters['employmentType'] ?? null, fn ($q) => $q->where('employmentType', $filters['employmentType']))
            ->when($filters['workPlaceType'] ?? null, fn ($q) => $q->where('workPlaceType', $filters['workPlaceType']))
            ->when($filters['minSalary'] ?? null, fn ($q) => $q->where('maxSalary', '>=', (int) $filters['minSalary']))
            ->when($filters['maxSalary'] ?? null, fn ($q) => $q->where('minSalary', '<=', (int) $filters['maxSalary']))
            ->when($filters['category_id'] ?? null, fn ($q) => $q->where('category_id', $filters['category_id']))
            ->when($filters['experience_level'] ?? null, fn ($q) => $q->where('experience_level', $filters['experience_level']))
            ->when($filters['datePosted'] ?? null, fn ($q) => $q->where('created_at', '>=', now()->subDays((int) $filters['datePosted'])))
            ->when($filters['status'] ?? null, fn ($q) => $q->where('status', $filters['status']));
    }

    /** @return BelongsTo<User,JobPosting> */
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

    public function savedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'saved_jobs', 'job_posting_id', 'user_id')
            ->withTimestamps();
    }
}
