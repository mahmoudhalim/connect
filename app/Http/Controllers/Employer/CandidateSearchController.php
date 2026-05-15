<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\CandidateProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CandidateSearchController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'location', 'experienceMin']);
        $filters = array_filter($filters, fn($v) => $v !== null && $v !== '');

        $candidates = CandidateProfile::with('user')
            ->when($request->search, function ($query) use ($request) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('headline', 'like', "%{$search}%")
                        ->orWhere('bio', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%")
                        ->orWhere('skills', 'like', "%\"{$search}\"%");
                });
            })
            ->when($request->location, function ($query) use ($request) {
                $query->where('location', 'like', "%{$request->location}%");
            })
            ->when($request->experienceMin !== null && $request->experienceMin !== '', function ($query) use ($request) {
                $query->where('experience_years', '>=', (float) $request->experienceMin);
            })
            ->latest()
            ->paginate(12)
            ->appends($filters);

        return Inertia::render('employer/candidates/index', [
            'candidates' => $candidates,
            'filters' => $filters,
        ]);
    }

    public function show(CandidateProfile $candidate)
    {
        $candidate->load('user');

        return Inertia::render('employer/candidates/show', [
            'candidate' => $candidate,
        ]);
    }
}
