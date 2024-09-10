<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    use HasFactory;

    protected $fillable = ['teacher_id', 'rating', 'comment'];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}

