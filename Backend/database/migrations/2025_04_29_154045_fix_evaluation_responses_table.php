<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
{
    Schema::table('evaluation_responses', function (Blueprint $table) {
        if (!Schema::hasColumn('evaluation_responses', 'evaluation_id')) {
            $table->foreignId('evaluation_id')->constrained()->onDelete('cascade');
        }
    });
}

public function down(): void
{
    Schema::table('evaluation_responses', function (Blueprint $table) {
        $table->dropForeign(['evaluation_id']);
        $table->dropColumn('evaluation_id');
    });
}

};
