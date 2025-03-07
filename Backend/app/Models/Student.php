<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Student extends Authenticatable
{
    use HasFactory;

    protected $fillable = ['name', 'email'];
    
    public function courses()
{
    return $this->belongsToMany(Course::class, 'student_courses')
                ->withPivot('semester')
                ->withTimestamps();
}

}

