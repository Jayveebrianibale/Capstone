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
            $table->unsignedBigInteger('instructor_id');
            $table->unsignedBigInteger('program_id');
            $table->integer('yearLevel');
            $table->string('phase');
            $table->timestamps();

            $table->foreign('instructor_id')
                ->references('id')
                ->on('instructors')
                ->onDelete('cascade');

            $table->foreign('program_id')
                ->references('id')
                ->on('programs')
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('instructor_program_archives');
    }
}; 