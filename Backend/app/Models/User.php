<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'name',
        'email',
        'password',
        'verification_code',
        'profile_picture',
        'google_id',
        'email_verified_at',
        'role',
        'profile_completed',
        'educationLevel',
        'program_id',
        'program_name',
        'yearLevel',


    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


        public function evaluationsGiven()
        {
            return $this->hasMany(Evaluation::class, 'student_id');
        }

        public function evaluationsReceived()
        {
            return $this->hasMany(Evaluation::class, 'instructor_id');
        }

        public function program() {
            return $this->belongsTo(Program::class);
        }
        

//     public function getProfilePictureUrlAttribute()
//     {
//         return $this->profile_picture ? Storage::url($this->profile_picture) : null;
//     }

//     public function resetTwoFactorCode()
//     {
//         $this->two_factor_code = null;
//         $this->two_factor_expires_at = null;
//         $this->save();
//     }

//     public function courses()
//     {
//         return $this->belongsToMany(Course::class, 'course_student', 'user_id', 'course_id')
//             ->withPivot('semester');
//     }

//    public function studentProfile()
//     {
//     return $this->hasOne(StudentProfile::class);
//     }

}
