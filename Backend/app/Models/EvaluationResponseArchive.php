<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluationResponseArchive extends Model
{
    protected $table = 'evaluation_responses_archive';
    protected $guarded = [];
    
    public function evaluation()
    {
        return $this->belongsTo(EvaluationArchive::class);
    }
}
