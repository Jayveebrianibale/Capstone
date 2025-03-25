<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::create('levels', function (Blueprint $table) {
        $table->id();
        $table->string('name'); 
        $table->foreignId('course_id')->constrained()->onDelete('cascade');
        $table->foreignId('program_id')->constrained('programs')->onDelete('cascade');
        $table->timestamps();
    });
}
public function down()
{
    Schema::dropIfExists('levels');
}

};
