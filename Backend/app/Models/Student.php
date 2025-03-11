<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'email'];

    public function courses() {
        return $this->belongsToMany(Course::class, 'course_student')->withPivot('semester');
    }
    
}


