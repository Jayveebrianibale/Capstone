<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Program extends Model {
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'code', 'yearLevel', 'category'];
    

    public function levels() {
        return $this->hasMany(Level::class);
    }

    public function yearLevels() {
        return $this->hasMany(YearLevel::class);
    }

    public function instructors()
    {   
        return $this->belongsToMany(Instructor::class, 'instructor_program')
                ->withPivot('yearLevel', 'section_id')
                ->withTimestamps();
    }

    public function sections()
    {
        return $this->hasMany(Section::class);
    }

}   

