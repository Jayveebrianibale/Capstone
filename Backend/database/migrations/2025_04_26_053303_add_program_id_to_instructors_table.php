<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::table('instructors', function (Blueprint $table) {
        $table->unsignedBigInteger('program_id')->nullable()->after('id');
    });
}
};
