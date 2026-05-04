<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employer_id')->constrained('users')->cascadeOnDelete();

            $table->string('title');
            $table->enum('employmentType', ['full-time', 'part-time', 'contract', 'freelance'])->default('full-time');
            $table->enum('workPlaceType', ['onsite', 'remote', 'hybrid'])->default('onsite');
            $table->string('location');
            $table->decimal('minSalary', 10, 2);
            $table->decimal('maxSalary', 10, 2);
            $table->text('description');
            $table->enum('status', ['pending', 'active', 'closed', 'draft'])->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_postings');
    }
};
