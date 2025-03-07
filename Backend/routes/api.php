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
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\CourseController;


Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'getUser']);

Route::get('/auth/google', [GoogleAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);

// //Login routes
// Route::post('register', [AuthController::class, 'register']);
// Route::post('login', [AuthController::class, 'login']);
// Route::post('/verify-code', [AuthController::class, 'verifyCode']);

// //User Profile routes
// Route::post('/upload-profile-picture', [UserController::class, 'uploadProfilePicture']);

// //Evaluation Routes
// Route::apiResource('teachers', TeacherController::class);
// Route::post('evaluations', [EvaluationController::class, 'store']);

//StudentSetupProfile Routes

Route::get('/students/{student_id}', [StudentController::class, 'getStudent']);
Route::get('/students/{student}/check-enrollment', [StudentController::class, 'checkEnrollment']);
Route::post('/students/{student_id}/enroll', [StudentController::class, 'enroll']);
Route::get('/students/{student}/courses', [StudentController::class, 'getCourses']);
Route::get('/students/{student}/instructors', [StudentController::class, 'getInstructors']);


//Create Questions Routes
Route::post('/questions', [QuestionController::class, 'store']);  // Create
Route::get('/questions', [QuestionController::class, 'index']);   // Fetch all questions
Route::put('/questions/{id}', [QuestionController::class, 'update']); // Update a question
Route::delete('/questions/{id}', [QuestionController::class, 'destroy']); // Delete a question

