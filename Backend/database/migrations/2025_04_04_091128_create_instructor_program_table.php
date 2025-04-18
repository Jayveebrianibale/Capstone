<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        if (!Schema::hasTable('instructor_program')) {
            Schema::create('instructor_program', function (Blueprint $table) {
                $table->id();
                $table->foreignId('instructor_id')->constrained()->onDelete('cascade');
                $table->foreignId('program_id')->constrained()->onDelete('cascade');
                $table->tinyInteger('yearLevel')->unsigned()->nullable();
                $table->timestamps();
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('instructor_program');
    }
};
