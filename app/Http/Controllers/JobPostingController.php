<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJobPostingRequest;
use App\Http\Requests\UpdateJobPostingRequest;
use App\Models\JobPosting;
use Inertia\Inertia;

class JobPostingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {}

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
        return redirect()->route('jobs.show', $jobPosting);
    }

    /**
     * Display the specified resource.
     */
    public function show(JobPosting $jobPosting)
    {
        dd('you are viewing', $jobPosting);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JobPosting $jobPosting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJobPostingRequest $request, JobPosting $jobPosting)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobPosting $jobPosting)
    {
        //
    }
}
