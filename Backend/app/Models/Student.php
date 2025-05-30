<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'email', 'course_id', 'level_id'];

    public function courses() {
        return $this->belongsToMany(Course::class, 'course_student')->withPivot('semester');
    }

    public function level() {
        return $this->belongsTo(Level::class);
    }

    public function instructors() {
        return $this->hasManyThrough(Instructor::class, Course::class, 'course_student', 'id', 'id', 'course_id');
    }

    public function profile() {
     return $this->hasOne(StudentProfile::class, 'user_id');
    }


    
}



