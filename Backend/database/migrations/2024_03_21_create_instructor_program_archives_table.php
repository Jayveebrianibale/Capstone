<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('instructor_program_archives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('instructor_id')->constrained('instructors');
            $table->foreignId('program_id')->constrained('programs');
            $table->integer('yearLevel');
            $table->string('phase');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('instructor_program_archives');
    }
}; 