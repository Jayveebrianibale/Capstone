<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['evaluation_phase'];
    
    protected $attributes = [
        'evaluation_phase' => 'Phase 1'
    ];

    /**
     * Get or create the first settings record
     */
    public static function getSettings()
    {
        return self::firstOrCreate([], ['evaluation_phase' => 'Phase 1']);
    }
}
