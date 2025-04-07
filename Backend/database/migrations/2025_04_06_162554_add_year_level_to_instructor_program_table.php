<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('instructor_program', function (Blueprint $table) {
            $table->string('yearLevel')->nullable();
        });
    }
    
    public function down()
    {
        Schema::table('instructor_program', function (Blueprint $table) {
            $table->dropColumn('yearLevel');
        });
    }
    
};
