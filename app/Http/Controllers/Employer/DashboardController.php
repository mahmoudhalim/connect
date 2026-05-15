<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\JobPosting;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $employerId = Auth::id();

        $activeJobs = JobPosting::where('employer_id', $employerId)
            ->where('status', 'active')
            ->count();

        $totalJobs = JobPosting::where('employer_id', $employerId)->count();

        $totalApplications = JobApplication::whereIn('job_posting_id', function ($query) use ($employerId) {
            $query->select('id')
                ->from('job_postings')
                ->where('employer_id', $employerId);
        })->count();

        $recentApplications = JobApplication::whereIn('job_posting_id', function ($query) use ($employerId) {
            $query->select('id')
                ->from('job_postings')
                ->where('employer_id', $employerId);
        })
            ->with(['candidate.candidateProfile', 'jobPosting'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($app) {
                return [
                    'id' => $app->id,
                    'candidate_name' => $app->candidate->name,
                    'candidate_headline' => $app->candidate->candidateProfile?->headline,
                    'job_title' => $app->jobPosting->title,
                    'status' => $app->status,
                    'applied_at' => $app->created_at->diffForHumans(),
                ];
            });

        $recentJobs = JobPosting::where('employer_id', $employerId)
            ->withCount('applications')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'status' => $job->status,
                    'applications_count' => $job->applications_count,
                    'created_at' => $job->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('employer/dashboard', [
            'stats' => [
                'activeJobs' => $activeJobs,
                'totalJobs' => $totalJobs,
                'totalApplications' => $totalApplications,
            ],
            'recentApplications' => $recentApplications,
            'recentJobs' => $recentJobs,
        ]);
    }
}
