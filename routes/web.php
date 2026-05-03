<?php

use App\Http\Controllers\JobPostingController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

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
    Route::get('/employer/jobs/create', [JobPostingController::class, 'create'])->name('employer.jobs.create');
    Route::post('/employer/jobs/', [JobPostingController::class, 'store'])->name('employer.jobs.store');

    Route::get('/jobs/{jobPosting}', [JobPostingController::class, 'show'])->name('jobs.show');
    Route::get('/jobs/{jobPosting}/edit', [JobPostingController::class, 'edit'])->name('jobs.edit')->middleware('can:update,jobPosting');
    Route::put('/employer/jobs/{jobPosting}', [JobPostingController::class, 'update'])->name('employer.jobs.update')->middleware('can:update,jobPosting');


    Route::prefix("employer")->group(function () {
        Route::get('/jobs', [JobPostingController::class, 'index'])->name('employer.jobs.index');
    });

    // Other specific routes
    Route::inertia('/candidate/search', 'test')->name('candidate.search');
});

require __DIR__ . '/settings.php';
