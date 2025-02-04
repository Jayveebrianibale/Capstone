<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\VerificationController;
use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Mail;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\GoogleAuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application.
| These routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Test Email Route
Route::get('/test-email', function () {
    try {
        Mail::raw('Testing SMTP configuration', function ($message) {
            $message->to('jayveebrianibale29@gmail.com')
                ->subject('Test Email');
        });
        return 'Email sent successfully';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

// Home Route
Route::get('/', function () {
    return view('welcome');
});

// Verification Routes
Route::get('/verify-code', [VerificationController::class, 'showVerificationPage'])->name('verification.page');
Route::post('/verify-code', [VerificationController::class, 'verifyCode'])->name('verification.verify');

// Google Authentication Routes
Route::get('/auth/google', [GoogleAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);

Route::get('/auth/google', function () {
    return Socialite::driver('google')->stateless()->redirect();
});

Route::get('/auth/google/callback', function () {
    try {
        $googleUser = Socialite::driver('google')->stateless()->user();

        // Restrict login to @student.laverdad.edu.ph emails
        if (!str_ends_with($googleUser->getEmail(), '@student.laverdad.edu.ph')) {
            return redirect('http://localhost:5173/login?error=Use your La Verdad email');
        }

        // Find or create user
        $user = User::updateOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name' => $googleUser->getName(),
                'google_id' => $googleUser->getId(),
                'profile_picture' => $googleUser->getAvatar(),
                'password' => bcrypt(str()->random(16)), 
                'email_verified_at' => now(), // Mark email as verified
            ]
        );

        // Authenticate user
        Auth::login($user);
        $token = $user->createToken('authToken')->plainTextToken;

        // Redirect to frontend with token
        return redirect("http://localhost:5173/dashboard?token={$token}");

    } catch (\Exception $e) {
        return redirect('http://localhost:5173/login?error=Google authentication failed');
    }
});
