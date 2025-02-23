<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\VerificationController; 

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\QuestionController;


// Login Routes Verify Token
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json($request->user());
});

Route::post('/verify-token', function (Request $request) {
    $user = Auth::guard('sanctum')->user();
    return response()->json(['valid' => $user ? true : false]);
});

// //Login routes
// Route::post('register', [AuthController::class, 'register']);
// Route::post('login', [AuthController::class, 'login']);
// Route::post('/verify-code', [AuthController::class, 'verifyCode']);

// //User Profile routes
// Route::post('/upload-profile-picture', [UserController::class, 'uploadProfilePicture']);

// //Evaluation Routes
// Route::apiResource('teachers', TeacherController::class);
// Route::post('evaluations', [EvaluationController::class, 'store']);

//Create Questions Routes
Route::post('/questions', [QuestionController::class, 'store']);  // Create
Route::get('/questions', [QuestionController::class, 'index']);   // Fetch all questions
Route::put('/questions/{id}', [QuestionController::class, 'update']); // Update a question
Route::delete('/questions/{id}', [QuestionController::class, 'destroy']); // Delete a question
