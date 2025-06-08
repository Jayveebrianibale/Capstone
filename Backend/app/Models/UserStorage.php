<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserStorage extends Model
{
    protected $table = 'user_storage';
    
    protected $fillable = [
        'user_id',
        'storage_type',
        'key',
        'value'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 