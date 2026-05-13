<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobApprovalController extends Controller
{
    public function index(Request $request)
    {
        $filter = $request->get('filter', 'pending');

        $jobs = JobPosting::with('employer', 'category')
            ->when($filter === 'pending', fn ($q) => $q->where('status', 'pending'))
            ->when($filter === 'approved', fn ($q) => $q->where('status', 'active'))
            ->when($filter === 'rejected', fn ($q) => $q->where('status', 'closed'))
            ->when($filter === 'all', fn ($q) => $q)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $counts = [
            'pending' => JobPosting::where('status', 'pending')->count(),
            'active' => JobPosting::where('status', 'active')->count(),
            'rejected' => JobPosting::where('status', 'closed')->count(),
        ];

        return Inertia::render('admin/moderation/index', [
            'jobs' => $jobs,
            'counts' => $counts,
            'filter' => $filter,
        ]);
    }

    public function approve(JobPosting $jobPosting)
    {
        $jobPosting->update(['status' => 'active']);

        return back()->with('success', 'Job posting approved.');
    }

    public function reject(Request $request, JobPosting $jobPosting)
    {
        $request->validate(['rejection_reason' => 'nullable|string|max:500']);

        if (!in_array($jobPosting->status, ['pending', 'active'], true)) {
            return back()->with('error', 'Only pending or approved jobs can be rejected.');
        }

        $jobPosting->update(['status' => 'closed']);

        return back()->with('success', 'Job posting rejected.');
    }
}
