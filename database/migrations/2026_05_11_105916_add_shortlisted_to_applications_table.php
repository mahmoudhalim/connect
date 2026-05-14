<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE applications MODIFY COLUMN status ENUM('under_review', 'shortlisted', 'interviewing', 'offer_extended', 'rejected', 'withdrawn') NOT NULL DEFAULT 'under_review'");
        }
    }

    public function down(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE applications MODIFY COLUMN status ENUM('under_review', 'interviewing', 'offer_extended', 'rejected', 'withdrawn') NOT NULL DEFAULT 'under_review'");
        }
    }
};
