<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'evaluation_phase',
        'should_clear_storage',
        'storage_clear_timestamp'
    ];
    
    protected $casts = [
        'should_clear_storage' => 'boolean',
        'storage_clear_timestamp' => 'datetime'
    ];

    /**
     * Get or create the first settings record
     */
    public static function getSettings()
    {
        return self::firstOrCreate([], ['evaluation_phase' => 'Phase 1']);
    }
}
