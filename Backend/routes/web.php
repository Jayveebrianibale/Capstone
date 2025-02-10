<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\VerificationController;
use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\TwoFactorController;

// ✅ Test Email Route
Route::get('/verify-2fa', function () {
    try {
        Mail::raw('Testing SMTP configuration', function ($message) {
            $message->to('petersthanlierayos@student.laverdad.edu.ph')
                ->subject('Test Email');
        });
        return 'Email sent successfully';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

Route::get('/', function () {
    return view('welcome');
});

//Verification Routes
Route::get('/verify-2fa', [TwoFactorController::class, 'index'])->name('2fa.index');
Route::post('/verify-2fa', [TwoFactorController::class, 'verify'])->name('2fa.verify');

//Google Authentication Routes 
Route::get('/auth/google', [GoogleAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);
