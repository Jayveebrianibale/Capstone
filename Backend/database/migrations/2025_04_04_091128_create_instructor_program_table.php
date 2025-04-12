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
        Schema::create('instructor_program', function (Blueprint $table) {
            $table->id();
            $table->foreignId('instructor_id')->constrained()->onDelete('cascade');
            $table->foreignId('program_id')->constrained()->onDelete('cascade');
            $table->unsignedTinyInteger('yearLevel')->nullable();
            $table->timestamps();

            $table->unique(['instructor_id', 'program_id', 'yearLevel']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('instructor_program');
    }
};
