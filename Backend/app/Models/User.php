<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\StudentProfileController;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'verification_code',
        'profile_picture',
        'google_id',
        'email_verified_at', 
        'role'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function getProfilePictureUrlAttribute()
    {
        return $this->profile_picture ? Storage::url($this->profile_picture) : null;
    }

    public function resetTwoFactorCode()
    {
        $this->two_factor_code = null;
        $this->two_factor_expires_at = null;
        $this->save();
    }
    public function enrolledCourses()
    {
        return $this->hasMany(StudentCourse::class, 'student_id');
    }

    public function studentProfile()
{
    return $this->hasOne(StudentProfile::class);
}


}
