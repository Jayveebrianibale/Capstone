<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model {
    use HasFactory;

    protected $fillable = ['name', 'code', 'yearLevel', 'category', 'status'];
    
    protected $attributes = [
        'status' => 'active'
    ];

    public function levels() {
        return $this->hasMany(Level::class);
    }

    public function yearLevels() {
        return $this->hasMany(YearLevel::class);
    }

    public function instructors()
    {   
        return $this->belongsToMany(Instructor::class, 'instructor_program', 'program_id', 'instructor_id')
                ->withPivot('yearLevel')
                ->withTimestamps();
    }

    

}   

