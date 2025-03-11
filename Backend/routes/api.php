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
use App\Http\Controllers\InstructorController;


Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'getUser']);
Route::get('/auth/google', [GoogleAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);
Route::middleware('auth:sanctum')->get('/student/instructors', [EvaluationController::class, 'getStudentInstructors']);



// Student 
Route::post('/student/setup-profile', [StudentController::class, 'setupProfile']);
Route::post('/students', [StudentController::class, 'createStudent']);
Route::post('/students/register', [StudentController::class, 'registerStudent']);
Route::get('/students/{student}', [StudentController::class, 'getStudent']);
Route::post('/students/{student}/enrollment-check', [StudentController::class, 'checkEnrollment']);
Route::get('/students/{student}/instructors', [StudentController::class, 'getStudentInstructors']);

// Course Routes
Route::post('/courses', [CourseController::class, 'createCourse']);
Route::get('/courses', [CourseController::class, 'getAllCourses']);
Route::post('/students/{student}/enroll', [CourseController::class, 'enrollStudent']);
Route::get('/students/{student}/courses', [CourseController::class, 'getEnrolledCourses']);

// Instructor Routes
Route::post('/instructors/assign', [InstructorController::class, 'assignInstructor']);
Route::post('/instructors/by-course', [InstructorController::class, 'getInstructorsByCourse']);


//Create Questions Routes
Route::post('/questions', [QuestionController::class, 'store']);  // Create
Route::get('/questions', [QuestionController::class, 'index']);   // Fetch all questions
Route::put('/questions/{id}', [QuestionController::class, 'update']); // Update a question
Route::delete('/questions/{id}', [QuestionController::class, 'destroy']); // Delete a question

