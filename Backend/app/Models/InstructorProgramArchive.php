<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstructorProgramArchive extends Model
{
    protected $fillable = [
        'instructor_id',
        'program_id',
        'yearLevel',
        'phase'
    ];

    public function instructor()
    {
        return $this->belongsTo(Instructor::class);
    }

    public function program()
    {
        return $this->belongsTo(Program::class);
    }
} 