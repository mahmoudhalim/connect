<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $jobPostingIds = JobPosting::where('employer_id', $user->id)->pluck('id');

        $query = JobApplication::with(['jobPosting', 'candidate'])
            ->whereIn('job_posting_id', $jobPostingIds);

        if ($request->search) {
            $query->whereHas('candidate', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->job_posting_id && $request->job_posting_id !== 'all') {
            $query->where('job_posting_id', $request->job_posting_id);
        }

        $applications = $query->latest()->paginate(10);

        $stats = [
            'total' => JobApplication::whereIn('job_posting_id', $jobPostingIds)->count(),
            'pending' => JobApplication::whereIn('job_posting_id', $jobPostingIds)
                ->where('status', 'under_review')->count(),
            'shortlisted' => JobApplication::whereIn('job_posting_id', $jobPostingIds)
                ->where('status', 'shortlisted')->count(),
        ];

        $jobPostings = JobPosting::where('employer_id', $user->id)
            ->where('status', 'active')
            ->select('id', 'title')
            ->get();

        return Inertia::render('Employer/Applications/Index', [
            'applications' => $applications,
            'stats' => $stats,
            'jobPostings' => $jobPostings,
            'filters' => $request->only(['search', 'status', 'job_posting_id']),
        ]);
    }

    public function updateStatus(Request $request, JobApplication $application)
    {
        $request->validate([
            'status' => 'required|in:under_review,shortlisted,interviewing,offer_extended,rejected,withdrawn',
        ]);

        $application->update(['status' => $request->status]);

        return back()->with('success', 'Status updated successfully');
    }
}