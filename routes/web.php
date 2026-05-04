<?php

use App\Http\Controllers\Employer\JobPostingController;
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



    // Other specific routes
    Route::inertia('/candidate/search', 'test')->name('candidate.search');
});


// Employer Routes
Route::middleware(['auth', 'role:employer'])->prefix('employer')->name('employer.')->group(function () {
    Route::resource('jobs', JobPostingController::class)->only('index', 'create', 'store');
    Route::get('/jobs/{jobPosting}', [JobPostingController::class, 'show'])->name('jobs.show');
    Route::get('/jobs/{jobPosting}/edit', [JobPostingController::class, 'edit'])->name('jobs.edit');
    Route::put('/jobs/{jobPosting}', [JobPostingController::class, 'update'])->name('jobs.update');
});



require __DIR__ . '/settings.php';
