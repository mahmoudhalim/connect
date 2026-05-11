<?php

namespace App\Http\Controllers;

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
        ]);
        $filters = array_filter($filters, function ($value) {
            return $value !== null && $value !== '';
        });

        $jobs = JobPosting::with('employer')
            ->when($request->search, function ($query) use ($request) {
                $query->where('title', 'like', "%{$request->search}%")
                    ->orWhere('description', 'like', "%{$request->search}%");
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
            
            ->where('status', 'active')
            ->latest()
            ->paginate(12)
            ->appends($filters);

        return Inertia::render('jobs/index', [
            'jobs' => $jobs,
            'filters' => $filters,
        ]);
    }

    public function search(Request $request)
    {
        return $this->jobs($request);
    }

    public function show(JobPosting $jobPosting)
    {
        $jobPosting->load('employer');

        return Inertia::render('jobs/show', [
            'job' => $jobPosting,
        ]);
    }
}
