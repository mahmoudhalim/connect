<?php

namespace Database\Seeders;

use App\Models\JobPosting;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
        ]);

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'role' => 'admin',
            'password' => Hash::make('password'),
        ]);
        User::factory()->create([
            'name' => 'candidate',
            'email' => 'user@test.com',
            'role' => 'candidate',
            'password' => Hash::make('asdfasdf'),
        ]);

        User::factory()->create([
            'name' => 'emp',
            'email' => 'emp@test.com',
            'role' => 'employer',
            'password' => Hash::make('asdfasdf'),
        ]);


        User::factory(10)->candidate()->create();
        User::factory(10)->employer()->has(JobPosting::factory()->count(5), 'jobPostings')->create();
    }
}
