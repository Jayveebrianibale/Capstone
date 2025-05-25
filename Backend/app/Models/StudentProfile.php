<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentProfile extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'education_level', 'program', 'year_level', 'grade_level'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function student() {
     return $this->belongsTo(Student::class, 'user_id');
    }

}
