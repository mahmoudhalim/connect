<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateCandidateProfileRequest;
use App\Models\CandidateProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit(Request $request)
    {
        $profile = CandidateProfile::where('user_id', auth()->id())->first();

        return Inertia::render('candidate/profile', [
            'profile' => $profile,
        ]);
    }

    public function update(UpdateCandidateProfileRequest $request)
    {
        $data = $request->validated();
        $userId = auth()->id();

        $resumePath = null;
        if ($request->hasFile('resume')) {
            $resumePath = $request->file('resume')->store('', 'public');
        }

        $profileData = collect($data)->except('resume')->toArray();
        if ($resumePath) {
            $profileData['resume_path'] = $resumePath;
        }

        CandidateProfile::updateOrCreate(
            ['user_id' => $userId],
            $profileData
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Profile updated successfully.']);

        return redirect()->back();
    }
}
