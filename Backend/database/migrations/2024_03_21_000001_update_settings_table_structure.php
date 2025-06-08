<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class UpdateSettingsTableStructure extends Migration
{
    public function up()
    {
        if (Schema::hasTable('settings')) {
            // Check if required columns exist
            $columns = Schema::getColumnListing('settings');
            $requiredColumns = [
                'evaluation_phase' => 'string',
                'should_clear_storage' => 'boolean',
                'storage_clear_timestamp' => 'timestamp'
            ];

            Schema::table('settings', function (Blueprint $table) use ($columns, $requiredColumns) {
                foreach ($requiredColumns as $column => $type) {
                    if (!in_array($column, $columns)) {
                        if ($type === 'string') {
                            $table->string($column)->default('Phase 1');
                        } elseif ($type === 'boolean') {
                            $table->boolean($column)->default(false);
                        } elseif ($type === 'timestamp') {
                            $table->timestamp($column)->nullable();
                        }
                    }
                }
            });

            // Ensure there's at least one record
            if (DB::table('settings')->count() === 0) {
                DB::table('settings')->insert([
                    'evaluation_phase' => 'Phase 1',
                    'should_clear_storage' => false,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }
    }

    public function down()
    {
        // No need to reverse this migration as it only adds missing columns
    }
} 