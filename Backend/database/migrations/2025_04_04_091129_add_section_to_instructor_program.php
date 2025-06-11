<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('instructor_program', function (Blueprint $table) {
            $table->foreignId('section_id')->nullable()->after('yearLevel')
                  ->constrained('sections')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('instructor_program', function (Blueprint $table) {
            $table->dropForeign(['section_id']);
            $table->dropColumn('section_id');
        });
    }
}; 