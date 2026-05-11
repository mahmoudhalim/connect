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
        Schema::create('applications', function (Blueprint $table) {
            $table->id();

            $table->foreignId('job_posting_id')->constrained('job_postings')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('resume_path')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();

            $table->enum('status', ['under_review', 'interviewing', 'offer_extended', 'rejected', 'withdrawn'])->default('under_review');

            $table->timestamps();

            $table->unique(['job_posting_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
