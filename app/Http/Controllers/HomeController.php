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
            ->when($request->search, function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('title', 'like', "%{$request->search}%")
                        ->orWhere('description', 'like', "%{$request->search}%");
                });
            })
            ->when($request->location, function ($query) use ($request) {
                $query->where('location', 'like', "%{$request->location}%");
            })
            ->when($request->employmentType, function ($query) use ($request) {
                $query->where('employmentType', $request->employmentType);
            })
            ->when($request->workPlaceType, function ($query) use ($request) {
                $query->where('workPlaceType', $request->workPlaceType);
            })
            ->when($request->minSalary, function ($query) use ($request) {
                $query->where('maxSalary', '>=', $request->minSalary);
            })
            ->when($request->maxSalary, function ($query) use ($request) {
                $query->where('minSalary', '<=', $request->maxSalary);
            })
            ->when($request->category_id, function ($query) use ($request) {
                $query->where('category_id', $request->category_id);
            })
            ->when($request->experience_level, function ($query) use ($request) {
                $query->where('experience_level', $request->experience_level);
            })
            ->when($request->datePosted, function ($query) use ($request) {
                $days = (int) $request->datePosted;
                $query->where('created_at', '>=', now()->subDays($days));
            })
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

    public function search(Request $request)
    {
        return $this->jobs($request);
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
