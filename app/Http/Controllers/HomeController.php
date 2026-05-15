<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function jobs(Request $request)
    {
        $filters = $request->only([
            'search',
            'location',
            'employmentType',
            'workPlaceType',
            'minSalary',
            'maxSalary',
            'category_id',
            'experience_level',
            'datePosted',
        ]);
        $filters = array_filter($filters, function ($value) {
            return $value !== null && $value !== '';
        });

        $jobs = JobPosting::with(['employer.companyProfile', 'category'])
            ->filters($filters)
            ->where('status', 'active')
            ->latest()
            ->paginate(12)
            ->appends($filters);

        $savedIds = [];
        if (auth()->check() && auth()->user()->isCandidate()) {
            $savedIds = auth()->user()->savedJobs()->pluck('job_posting_id')->toArray();
        }

        return Inertia::render('jobs/index', [
            'jobs' => $jobs,
            'filters' => $filters,
            'categories' => Category::all(),
            'savedIds' => $savedIds,
        ]);
    }

    public function show(JobPosting $jobPosting)
    {
        $jobPosting->load(['employer.companyProfile', 'category']);

        $isSaved = auth()->check() && auth()->user()->isCandidate()
            ? auth()->user()->savedJobs()->where('job_posting_id', $jobPosting->id)->exists()
            : false;

        $hasApplied = auth()->check() && auth()->user()->isCandidate()
            ? auth()->user()->applications()
                ->where('job_posting_id', $jobPosting->id)
                ->where('status', '!=', 'withdrawn')
                ->exists()
            : false;

        return Inertia::render('jobs/show', [
            'job' => $jobPosting,
            'isSaved' => $isSaved,
            'hasApplied' => $hasApplied,
        ]);
    }
}
