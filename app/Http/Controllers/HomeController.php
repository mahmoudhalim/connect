<?php

namespace App\Http\Controllers;

use App\Models\JobPosting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function jobs(Request $request)
    {
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
            ->when($request->maxSalary, function ($query) use ($request) {
                $query->where('minSalary', '<=', $request->maxSalary);
            })
            ->where('status', 'active')
            ->latest()
            ->paginate(12);

        return Inertia::render('jobs/index', [
            'jobs' => $jobs,
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
