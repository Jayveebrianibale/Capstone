<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    // Archive table for evaluations
    Schema::create('evaluations_archive', function (Blueprint $table) {
        $table->id();
        $table->foreignId('student_id')->constrained('users');
        $table->foreignId('instructor_id')->constrained('instructors');
        $table->string('school_year');
        $table->string('semester');
        $table->string('status');
        $table->timestamp('evaluated_at');
        $table->string('phase')->default('Phase 1');
        $table->timestamps();
        $table->softDeletes(); // Optional for extra safety
    });

    // Archive table for responses
    Schema::create('evaluation_responses_archive', function (Blueprint $table) {
        $table->id();
        $table->foreignId('evaluation_id')->constrained('evaluations_archive');
        $table->foreignId('question_id')->constrained('questions');
        $table->integer('rating');
        $table->text('comment')->nullable();
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('evaluation_responses_archive');
    Schema::dropIfExists('evaluations_archive');
}
};
