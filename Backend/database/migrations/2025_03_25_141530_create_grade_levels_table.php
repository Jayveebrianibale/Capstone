<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::create('grade_levels', function (Blueprint $table) {
        $table->id();
        $table->string('name')->unique();
        $table->enum('category', ['Senior_High', 'Junior_High', 'Intermediate']);
        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('grade_levels');
    }
};
