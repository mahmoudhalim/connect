<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use App\Models\User;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'pendingJobs' => JobPosting::where('status', 'pending')->count(),
            'activeJobs' => JobPosting::where('status', 'active')->count(),
            'totalUsers' => User::count(),
            'totalEmployers' => User::where('role', 'employer')->count(),
            'totalCandidates' => User::where('role', 'candidate')->count(),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
        ]);
    }
}
