<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\VerificationController;
use Illuminate\Support\Facades\Mail;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

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

Route::get('/', function () {
    return view('welcome');
});
Route::get('/verify-code', 'VerificationController@showVerificationPage')->name('verification.page');
Route::post('/verify-code', 'VerificationController@verifyCode')->name('verification.verify');

