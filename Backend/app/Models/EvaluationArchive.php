<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EvaluationArchive extends Model
{
    use SoftDeletes;
    
    protected $table = 'evaluations_archive';
    protected $guarded = [];
    
    public function responses()
    {
        return $this->hasMany(EvaluationResponseArchive::class, 'evaluation_id');
    }
}
