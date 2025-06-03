<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            // include evaluation_phase right away
            $table->string('evaluation_phase')->default('Phase 1');
            $table->timestamps();
        });

        // (Optional) seed an initial row if you rely on exactly one settings record
        DB::table('settings')->insert([
            'evaluation_phase' => 'Phase 1',
            'created_at'       => now(),
            'updated_at'       => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
