<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'year_level',
        'category'
    ];

    public function instructors()
    {
        return $this->belongsToMany(Instructor::class, 'instructor_program', 'section_id', 'instructor_id')
                    ->withPivot('program_id', 'yearLevel')
                    ->withTimestamps();
    }

    public function program()
    {
        return $this->belongsTo(Program::class);
    }
} 