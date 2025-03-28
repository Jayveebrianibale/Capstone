<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('level_id');
            $table->timestamps();
        });
        
        
    }

    public function down()
    {
        Schema::dropIfExists('students');
    }
};
