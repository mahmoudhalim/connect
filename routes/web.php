<?php

use App\Http\Controllers\Candidate\JobApplicationController;
use App\Http\Controllers\Candidate\ProfileController;
use App\Http\Controllers\Candidate\SavedJobController;
use App\Http\Controllers\Employer\ApplicationController;
use App\Http\Controllers\Employer\CandidateSearchController;
use App\Http\Controllers\Employer\CompanyController;
use App\Http\Controllers\Employer\DashboardController;
use App\Http\Controllers\Employer\JobPostingController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// Public Job Routes
Route::get('/jobs', [HomeController::class, 'jobs'])->name('jobs.index');
Route::get('/jobs/search', [HomeController::class, 'search'])->name('jobs.search');
Route::get('/jobs/{jobPosting}', [HomeController::class, 'show'])->name('jobs.show');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dynamic dashboard redirect based on role
    Route::get('/dashboard', function () {
        $user = auth()->user();
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        } elseif ($user->isEmployer()) {
            return redirect()->route('employer.dashboard');
        } else {
            return redirect()->route('candidate.dashboard');
        }
    })->name('dashboard');

// Role-specific dashboard routes
    Route::get('/employer/dashboard', [DashboardController::class, 'index'])->name('employer.dashboard');
    Route::get('/candidate/dashboard', function () {
        $user = auth()->user();
        return \Inertia\Inertia::render('candidate/dashboard', [
            'activeApplicationsCount' => $user->applications()->count(),
            'savedJobsCount' => $user->savedJobs()->count(),
        ]);
    })->name('candidate.dashboard');

    Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [App\Http\Controllers\Admin\AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('/moderation', [App\Http\Controllers\Admin\JobApprovalController::class, 'index'])->name('moderation.index');
        Route::patch('/moderation/{jobPosting}/approve', [App\Http\Controllers\Admin\JobApprovalController::class, 'approve'])->name('moderation.approve');
        Route::patch('/moderation/{jobPosting}/reject', [App\Http\Controllers\Admin\JobApprovalController::class, 'reject'])->name('moderation.reject');
        Route::get('/categories', [App\Http\Controllers\Admin\CategoryController::class, 'index'])->name('categories.index');
        Route::post('/categories', [App\Http\Controllers\Admin\CategoryController::class, 'store'])->name('categories.store');
        Route::put('/categories/{category}', [App\Http\Controllers\Admin\CategoryController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{category}', [App\Http\Controllers\Admin\CategoryController::class, 'destroy'])->name('categories.destroy');
        Route::get('/users', [App\Http\Controllers\Admin\UserManagementController::class, 'index'])->name('users.index');
        Route::delete('/users/{user}', [App\Http\Controllers\Admin\UserManagementController::class, 'destroy'])->name('users.destroy');
    });

    // Other specific routes
    Route::inertia('/candidate/search', 'test')->name('candidate.search');
});

// Candidate Routes
Route::middleware(['auth', 'verified', 'role:candidate'])->prefix('candidate')->name('candidate.')->group(function () {
    Route::get('/applications', [JobApplicationController::class, 'index'])->name('applications.index');
    Route::post('/applications', [JobApplicationController::class, 'store'])->name('applications.store');
    Route::get('/applications/{jobApplication}', [JobApplicationController::class, 'show'])->name('applications.show');
    Route::patch('/applications/{jobApplication}', [JobApplicationController::class, 'update'])->name('applications.update');
    Route::post('/applications/{jobApplication}/archive', [JobApplicationController::class, 'archive'])->name('applications.archive');
    Route::post('/applications/{jobApplication}/restore', [JobApplicationController::class, 'restore'])->name('applications.restore');
    Route::delete('/applications/{jobApplication}', [JobApplicationController::class, 'destroy'])->name('applications.cancel');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/profile/view', [ProfileController::class, 'show'])->name('profile.show');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('/saved', [SavedJobController::class, 'index'])->name('saved.index');
    Route::post('/saved/{jobPosting}', [SavedJobController::class, 'store'])->name('saved.store');
    Route::delete('/saved/{jobPosting}', [SavedJobController::class, 'destroy'])->name('saved.destroy');
});


// Employer Routes
Route::middleware(['auth', 'role:employer'])->prefix('employer')->name('employer.')->group(function () {
    Route::resource('jobs', JobPostingController::class)->only('index', 'create', 'store');
    Route::get('/jobs/{jobPosting}', [JobPostingController::class, 'show'])->name('jobs.show');
    Route::get('/jobs/{jobPosting}/edit', [JobPostingController::class, 'edit'])->name('jobs.edit');
    Route::put('/jobs/{jobPosting}', [JobPostingController::class, 'update'])->name('jobs.update');
    Route::delete('/jobs/{jobPosting}', [JobPostingController::class, 'destroy'])->name('jobs.destroy');
    Route::get('/applicants', [ApplicationController::class, 'index'])->name('applicants.index');
    Route::get('/applicants/{application}', [ApplicationController::class, 'show'])->name('applicants.show');
    Route::patch('/applicants/{application}/status', [ApplicationController::class, 'updateStatus'])->name('applicants.updateStatus');
    Route::get('/candidates', [CandidateSearchController::class, 'index'])->name('candidates.index');
    Route::get('/candidates/{candidate}', [CandidateSearchController::class, 'show'])->name('candidates.show');
    Route::get('/company', [CompanyController::class, 'edit'])->name('company.edit');
    Route::patch('/company', [CompanyController::class, 'update'])->name('company.update');
});

require __DIR__.'/settings.php';
