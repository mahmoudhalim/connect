<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateCompanyProfileRequest;
use App\Models\CompanyProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function edit(Request $request)
    {
        $profile = CompanyProfile::where('user_id', $request->user()->id)->first();

        return Inertia::render('employer/company/index', [
            'profile' => $profile,
        ]);
    }

    public function update(UpdateCompanyProfileRequest $request)
    {
        $data = $request->validated();
        $userId = $request->user()->id;

        $existing = CompanyProfile::where('user_id', $userId)->first();

        $logoPath = null;
        if ($request->hasFile('logo')) {
            if ($existing && $existing->company_logo) {
                Storage::disk('public')->delete($existing->company_logo);
            }
            $logoPath = $request->file('logo')->store('company-logos', 'public');
        }

        $profileData = collect($data)->except('logo')->toArray();
        if ($logoPath) {
            $profileData['company_logo'] = $logoPath;
        }

        CompanyProfile::updateOrCreate(
            ['user_id' => $userId],
            $profileData
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Company profile updated successfully.']);

        return redirect()->back();
    }
}
