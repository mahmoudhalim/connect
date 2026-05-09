<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Candidate\ApplyJobRequest;
use App\Models\JobApplication;
use App\Models\JobPosting;
use Inertia\Inertia;

class JobApplicationController extends Controller
{
    public function index()
    {
        $applications = JobApplication::with('jobPosting')
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(10);

        return Inertia::render('Candidate/Applications/Index', [
            'applications' => $applications,
        ]);
    }

    public function store(ApplyJobRequest $request)
    {
        $jobPosting = JobPosting::findOrFail($request->job_posting_id);

        $existingApplication = JobApplication::where('job_posting_id', $jobPosting->id)
            ->where('user_id', auth()->id())
            ->exists();

        if ($existingApplication) {
            return back()->with('error', 'You have already applied for this job.');
        }

        JobApplication::create([
            'job_posting_id' => $jobPosting->id,
            'user_id' => auth()->id(),
            'resume_path' => $request->resume_path,
            'contact_email' => $request->contact_email,
            'contact_phone' => $request->contact_phone,
            'status' => 'pending',
        ]);

        return redirect()->route('candidate.applications.index')
            ->with('success', 'Application submitted successfully!');
    }

    public function show(JobApplication $jobApplication)
    {
        $this->authorize('view', $jobApplication);

        $jobApplication->load('jobPosting.employer');

        return Inertia::render('Candidate/Applications/Show', [
            'application' => $jobApplication,
        ]);
    }

    public function destroy(JobApplication $jobApplication)
    {
        $this->authorize('delete', $jobApplication);

        $jobApplication->delete();

        return redirect()->route('candidate.applications.index')
            ->with('success', 'Application cancelled successfully.');
    }
}
