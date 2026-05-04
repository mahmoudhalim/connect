<?php

namespace Database\Factories;

use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JobPosting>
 */
class JobPostingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->jobTitle(),
            'employmentType' => $this->faker->randomElement(['full-time', 'part-time', 'contract', 'freelance']),
            'workPlaceType' => $this->faker->randomElement(['onsite', 'remote', 'hybrid']),
            'location' => $this->faker->city(),
            'minSalary' => $this->faker->randomFloat(2, 1000, 10000),
            'maxSalary' => $this->faker->randomFloat(2, 10000, 20000),
            'description' => $this->faker->paragraphs(3, true),
            'status' => $this->faker->randomElement(['pending', 'active', 'closed']),
            'employer_id' => User::factory(),
        ];
    }

    /**
     * Indicate that the job posting is active.
     */
    public function active(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'active',
            ];
        });
    }

    /**
     * Indicate that the job posting is closed.
     */
    public function closed(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'closed',
            ];
        });
    }
}
