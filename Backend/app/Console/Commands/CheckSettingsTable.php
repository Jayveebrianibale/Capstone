<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CheckSettingsTable extends Command
{
    protected $signature = 'settings:check-table';
    protected $description = 'Check and fix the settings table structure';

    public function handle()
    {
        if (!Schema::hasTable('settings')) {
            $this->info('Settings table does not exist. Creating it...');
            Schema::create('settings', function ($table) {
                $table->id();
                $table->string('evaluation_phase')->default('Phase 1');
                $table->boolean('should_clear_storage')->default(false);
                $table->timestamp('storage_clear_timestamp')->nullable();
                $table->timestamps();
            });
            $this->info('Settings table created successfully.');
        } else {
            $this->info('Settings table exists. Checking structure...');
            
            // Check if all required columns exist
            $columns = Schema::getColumnListing('settings');
            $requiredColumns = ['id', 'evaluation_phase', 'should_clear_storage', 'storage_clear_timestamp', 'created_at', 'updated_at'];
            
            $missingColumns = array_diff($requiredColumns, $columns);
            
            if (!empty($missingColumns)) {
                $this->info('Missing columns: ' . implode(', ', $missingColumns));
                $this->info('Attempting to add missing columns...');
                
                Schema::table('settings', function ($table) use ($missingColumns) {
                    if (in_array('evaluation_phase', $missingColumns)) {
                        $table->string('evaluation_phase')->default('Phase 1');
                    }
                    if (in_array('should_clear_storage', $missingColumns)) {
                        $table->boolean('should_clear_storage')->default(false);
                    }
                    if (in_array('storage_clear_timestamp', $missingColumns)) {
                        $table->timestamp('storage_clear_timestamp')->nullable();
                    }
                });
                
                $this->info('Missing columns added successfully.');
            } else {
                $this->info('All required columns exist.');
            }
        }

        // Check if there's at least one record
        $settings = DB::table('settings')->first();
        if (!$settings) {
            $this->info('No settings record found. Creating initial record...');
            DB::table('settings')->insert([
                'evaluation_phase' => 'Phase 1',
                'should_clear_storage' => false,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            $this->info('Initial settings record created successfully.');
        } else {
            $this->info('Settings record exists.');
        }
    }
} 