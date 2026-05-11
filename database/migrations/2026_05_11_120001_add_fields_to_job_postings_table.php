<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('job_postings', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('employer_id')->constrained('categories')->nullOnDelete();
            $table->enum('experience_level', ['entry', 'mid', 'senior', 'lead', 'executive'])->nullable()->after('workPlaceType');
            $table->text('requirements')->nullable()->after('description');
            $table->text('benefits')->nullable()->after('requirements');
            $table->date('deadline')->nullable()->after('status');
            $table->string('company_logo')->nullable()->after('deadline');
        });
    }

    public function down(): void
    {
        Schema::table('job_postings', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn(['category_id', 'experience_level', 'requirements', 'benefits', 'deadline', 'company_logo']);
        });
    }
};