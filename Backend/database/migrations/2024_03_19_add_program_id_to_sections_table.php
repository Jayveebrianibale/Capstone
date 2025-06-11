<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('sections', function (Blueprint $table) {
            if (!Schema::hasColumn('sections', 'program_id')) {
                $table->foreignId('program_id')->nullable()->constrained('programs')->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sections', function (Blueprint $table) {
            if (Schema::hasColumn('sections', 'program_id')) {
                $table->dropForeign(['program_id']);
                $table->dropColumn('program_id');
            }
        });
    }
}; 