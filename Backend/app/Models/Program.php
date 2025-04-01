<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model {
    use HasFactory;

    protected $fillable = ['name', 'code', 'yearLevel', 'category'];

    public function levels() {
        return $this->hasMany(Level::class);
    }
}   

