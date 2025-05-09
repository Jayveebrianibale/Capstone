<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Instructor extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'email'];

    public function courses() {
        return $this->belongsToMany(Course::class, 'course_instructor', 'instructor_id', 'course_id');
    }

    public function programs() {
        return $this->belongsToMany(Program::class, 'instructor_program', 'instructor_id', 'program_id')
                    ->withPivot('yearLevel')->withTimestamps();
    }

    public function yearLevel() {
        return $this->belongsTo(YearLevel::class);
    }

    public function evaluations() {
        return $this->hasMany(Evaluation::class);
    }
    



}

