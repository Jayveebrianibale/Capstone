<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = ['course_name'];

    public function instructors()
    {
        return $this->belongsToMany(Instructor::class, 'course_instructors');
    }

    public function students()
{
    return $this->belongsToMany(Student::class, 'student_courses')->withPivot('semester');
}

}
