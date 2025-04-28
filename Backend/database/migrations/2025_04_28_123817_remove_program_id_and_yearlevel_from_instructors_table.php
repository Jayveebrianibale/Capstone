<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('instructors', function (Blueprint $table) {
            $table->dropColumn('program_id');
            $table->dropColumn('yearLevel');
        });
    }

    public function down(): void
    {
        Schema::table('instructors', function (Blueprint $table) {
            $table->unsignedBigInteger('program_id')->nullable();
            $table->integer('yearLevel')->default(0);
        });
    }
};
