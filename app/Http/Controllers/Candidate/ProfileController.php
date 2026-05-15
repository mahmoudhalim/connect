<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateCandidateProfileRequest;
use App\Models\CandidateProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $profile = CandidateProfile::with('user')->where('user_id', auth()->id())->first();

        return Inertia::render('candidate/profile/show', [
            'candidate' => $profile,
        ]);
    }

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

        $existing = CandidateProfile::where('user_id', $userId)->first();
        $oldResumePath = $existing?->resume_path;
        $oldAvatarPath = $existing?->avatar_path;

        $profileData = collect($data)->except('resume', 'remove_resume', 'avatar', 'remove_avatar')->toArray();

        if (isset($data['skills']) && is_string($data['skills'])) {
            $skills = array_filter(array_map('trim', explode(',', $data['skills'])));
            $profileData['skills'] = $skills ? array_values($skills) : null;
        }

        $newResumePath = null;
        $shouldDeleteOldResume = false;

        if ($request->hasFile('resume')) {
            $newResumePath = $request->file('resume')->store('resumes', 'public');
            $profileData['resume_path'] = $newResumePath;
            $shouldDeleteOldResume = (bool) $oldResumePath;
        } elseif (!empty($data['remove_resume'])) {
            $profileData['resume_path'] = null;
            $shouldDeleteOldResume = (bool) $oldResumePath;
        }

        CandidateProfile::updateOrCreate(
            ['user_id' => $userId],
            $profileData
        );

        if ($shouldDeleteOldResume && $oldResumePath && $oldResumePath !== $newResumePath) {
            Storage::disk('public')->delete($oldResumePath);
        }

        $newAvatarPath = null;
        $shouldDeleteOldAvatar = false;

        if ($request->hasFile('avatar')) {
            $newAvatarPath = $request->file('avatar')->store('avatars', 'public');
            $profileData['avatar_path'] = $newAvatarPath;
            $shouldDeleteOldAvatar = (bool) $oldAvatarPath;
        } elseif (!empty($data['remove_avatar'])) {
            $profileData['avatar_path'] = null;
            $shouldDeleteOldAvatar = (bool) $oldAvatarPath;
        }

        if ($shouldDeleteOldAvatar && $oldAvatarPath && $oldAvatarPath !== $newAvatarPath) {
            Storage::disk('public')->delete($oldAvatarPath);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Profile updated successfully.']);

        return redirect()->back();
    }
}
