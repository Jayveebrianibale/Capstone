<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up() {
    Schema::table('evaluations', function (Blueprint $table) {
        $table->text('comment')->nullable();
    });
    }

    public function down() {
        Schema::table('evaluations', function (Blueprint $table) {
            $table->dropColumn('comment');
        });
    }

};
