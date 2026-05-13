<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SavedJobController extends Controller
{
    public function index(Request $request)
    {
        $savedJobs = $request->user()->savedJobs()
            ->with(['employer.companyProfile', 'category'])
            ->latest()
            ->paginate(12);

        return Inertia::render('candidate/saved/index', [
            'savedJobs' => $savedJobs,
        ]);
    }

    public function store(JobPosting $jobPosting, Request $request)
    {
        $request->user()->savedJobs()->syncWithoutDetaching([$jobPosting->id]);

        return back()->with('success', 'Job saved successfully.');
    }

    public function destroy(JobPosting $jobPosting, Request $request)
    {
        $request->user()->savedJobs()->detach($jobPosting->id);

        return back()->with('success', 'Job removed from saved.');
    }
}
