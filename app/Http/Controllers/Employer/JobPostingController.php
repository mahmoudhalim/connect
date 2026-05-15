<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreJobPostingRequest;
use App\Http\Requests\UpdateJobPostingRequest;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobPostingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->only([
            'search',
            'location',
            'employmentType',
            'workPlaceType',
            'minSalary',
            'status',
        ]);
        $filters = array_filter($filters, function ($value) {
            return $value !== null && $value !== '';
        });

        $jobs = $request->user()->jobPostings()
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
            
            ->when($request->status, function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            ->latest()
            ->paginate(6)
            ->appends($filters);

        return Inertia::render('employer/jobs/index', [
            'jobs' => $jobs,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = \App\Models\Category::all();

        return Inertia::render('employer/jobs/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJobPostingRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('company_logo')) {
            $data['company_logo'] = $request->file('company_logo')->store('company-logos', 'public');
        }

        $jobPosting = $request->user()->jobPostings()->create($data);

        return redirect()->route('employer.jobs.show', $jobPosting);
    }

    /**
     * Display the specified resource.
     */
    public function show(JobPosting $jobPosting)
    {
        $this->authorize('view', $jobPosting);

        $jobPosting->load('employer', 'category');

        return Inertia::render('employer/jobs/show', compact('jobPosting'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JobPosting $jobPosting)
    {
        $this->authorize('update', $jobPosting);

        $categories = \App\Models\Category::all();

        return Inertia::render('employer/jobs/edit', [
            'jobPosting' => $jobPosting,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJobPostingRequest $request, JobPosting $jobPosting)
    {
        $this->authorize('update', $jobPosting);

        $data = $request->validated();

        if ($request->hasFile('company_logo')) {
            $data['company_logo'] = $request->file('company_logo')->store('company-logos', 'public');
        }

        $jobPosting->update($data);

        return redirect()->route('employer.jobs.show', $jobPosting)->with('success', 'Job posting updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobPosting $jobPosting)
    {
        $this->authorize('delete', $jobPosting);

        $jobPosting->delete();

        return redirect()->route('employer.jobs.index')->with('success', 'Job posting deleted successfully.');
    }

    /**
     * Close the specified job posting.
     */
    public function close(JobPosting $jobPosting)
    {
        $this->authorize('close', $jobPosting);

        if ($jobPosting->status === 'closed') {
            return redirect()->back()->with('error', 'Job posting is already closed.');
        }

        $jobPosting->update(['status' => 'closed']);

        return redirect()->route('employer.jobs.show', $jobPosting)->with('success', 'Job posting closed successfully.');
    }
}
