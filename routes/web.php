<?php

use App\Http\Controllers\Candidate\JobApplicationController;
use App\Http\Controllers\Employer\ApplicationController;
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
    Route::inertia('/admin/dashboard', 'admin/dashboard')->name('admin.dashboard');
    Route::inertia('/employer/dashboard', 'employer/dashboard')->name('employer.dashboard');
    Route::inertia('/candidate/dashboard', 'candidate/dashboard')->name('candidate.dashboard');

    // Other specific routes
    Route::inertia('/candidate/search', 'test')->name('candidate.search');
});

// Candidate Routes
Route::middleware(['auth', 'verified', 'role:candidate'])->prefix('candidate')->name('candidate.')->group(function () {
    Route::get('/applications', [JobApplicationController::class, 'index'])->name('applications.index');
    Route::post('/applications', [JobApplicationController::class, 'store'])->name('applications.store');
    Route::get('/applications/{jobApplication}', [JobApplicationController::class, 'show'])->name('applications.show');
    Route::delete('/applications/{jobApplication}', [JobApplicationController::class, 'destroy'])->name('applications.cancel');
});


// Employer Routes
Route::middleware(['auth', 'role:employer'])->prefix('employer')->name('employer.')->group(function () {
    Route::resource('jobs', JobPostingController::class)->only('index', 'create', 'store');
    Route::get('/jobs/{jobPosting}', [JobPostingController::class, 'show'])->name('jobs.show');
    Route::get('/jobs/{jobPosting}/edit', [JobPostingController::class, 'edit'])->name('jobs.edit');
    Route::put('/jobs/{jobPosting}', [JobPostingController::class, 'update'])->name('jobs.update');
    Route::delete('/jobs/{jobPosting}', [JobPostingController::class, 'destroy'])->name('jobs.destroy');
    Route::get('/applicants', [ApplicationController::class, 'index'])->name('applicants.index');
    Route::patch('/applicants/{application}/status', [ApplicationController::class, 'updateStatus'])->name('applicants.updateStatus');
});

require __DIR__.'/settings.php';
