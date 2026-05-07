<?php

namespace Database\Factories;

use App\Models\JobApplication;
use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JobApplication>
 */
class JobApplicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'job_posting_id' => JobPosting::factory(),
            'user_id' => User::factory(),
            'resume_path' => $this->faker->optional()->filePath(),
            'contact_email' => $this->faker->optional()->safeEmail(),
            'contact_phone' => $this->faker->optional()->phoneNumber(),
            'status' => $this->faker->randomElement(['pending', 'accepted', 'rejected']),
        ];
    }

    public function pending(): Factory
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'pending',
        ]);
    }

    public function accepted(): Factory
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'accepted',
        ]);
    }

    public function rejected(): Factory
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'rejected',
        ]);
    }
}
