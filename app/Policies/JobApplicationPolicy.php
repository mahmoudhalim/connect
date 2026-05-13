<?php

namespace App\Policies;

use App\Models\JobApplication;
use App\Models\User;

class JobApplicationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isCandidate();
    }

    public function view(User $user, JobApplication $jobApplication): bool
    {
        return $user->id === $jobApplication->user_id;
    }

    public function create(User $user): bool
    {
        return $user->isCandidate();
    }

    public function update(User $user, JobApplication $jobApplication): bool
    {
        return $user->id === $jobApplication->user_id;
    }

    public function delete(User $user, JobApplication $jobApplication): bool
    {
        return $user->id === $jobApplication->user_id;
    }

    public function restore(User $user, JobApplication $jobApplication): bool
    {
        return false;
    }

    public function forceDelete(User $user, JobApplication $jobApplication): bool
    {
        return false;
    }
}