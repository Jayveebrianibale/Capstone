<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateSettingsTable extends Command
{
    protected $signature = 'settings:create-table';
    protected $description = 'Create the settings table if it does not exist';

    public function handle()
    {
        if (!Schema::hasTable('settings')) {
            Schema::create('settings', function ($table) {
                $table->id();
                $table->string('evaluation_phase')->default('Phase 1');
                $table->boolean('should_clear_storage')->default(false);
                $table->timestamp('storage_clear_timestamp')->nullable();
                $table->timestamps();
            });

            // Create initial settings record
            DB::table('settings')->insert([
                'evaluation_phase' => 'Phase 1',
                'should_clear_storage' => false,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            $this->info('Settings table created successfully.');
        } else {
            $this->info('Settings table already exists.');
        }
    }
} 