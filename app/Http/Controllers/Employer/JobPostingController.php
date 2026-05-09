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
        $jobs = $request->user()->jobPostings()->paginate(6);

        return Inertia::render('employer/jobs/index', compact('jobs'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('employer/jobs/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJobPostingRequest $request)
    {
        $jobPosting = $request->user()->jobPostings()->create($request->validated());

        return redirect()->route('employer.jobs.show', $jobPosting);
    }

    /**
     * Display the specified resource.
     */
    public function show(JobPosting $jobPosting)
    {
        $this->authorize('view', $jobPosting);

        return Inertia::render('employer/jobs/show', compact('jobPosting'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JobPosting $jobPosting)
    {
        $this->authorize('update', $jobPosting);

        return Inertia::render('employer/jobs/edit', compact('jobPosting'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJobPostingRequest $request, JobPosting $jobPosting)
    {
        $this->authorize('update', $jobPosting);

        $jobPosting->update($request->validated());

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
}
