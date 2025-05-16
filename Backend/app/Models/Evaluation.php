<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    protected $fillable = [
    'student_id', 
    'instructor_id', 
    'school_year',
    'status',
    'evaluated_at',
    'semester',]; 

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function responses()
    {
        return $this->hasMany(EvaluationResponse::class);
    }

}



