<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up()
{
    Schema::table('instructors', function (Blueprint $table) {
        $table->integer('yearLevel');
    });
}

public function down()
{
    Schema::table('instructors', function (Blueprint $table) {
        $table->dropColumn('yearLevel');
    });
}

};
