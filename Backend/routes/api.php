<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\InstructorController;
use App\Http\Controllers\StudentProfileController;
use App\Http\Controllers\LevelController;
use App\Http\Controllers\ProgramController;
use App\Models\Program;

// Authentication Routes
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'getUser']);
Route::middleware('auth:sanctum')->post('/logout', [GoogleAuthController::class, 'logout']);
Route::get('/auth/google', [GoogleAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);

// **Student Profile Setup**
Route::middleware('auth:sanctum')->post('/student/setup-profile', [StudentProfileController::class, 'setupProfile']);
Route::middleware('auth:sanctum')->get('/student/profile', [StudentProfileController::class, 'getProfile']);

// Student Routes
Route::get('/students/{student}/instructors', [StudentController::class, 'getStudentInstructors']);

// Course Routes
Route::post('/courses', [CourseController::class, 'createCourse']); 
Route::get('/courses', [CourseController::class, 'getAllCourses']);
Route::post('/students/{student}/enroll', [CourseController::class, 'enrollStudent']);
Route::get('/students/{student}/courses', [CourseController::class, 'getEnrolledCourses']);

// Instructor Routes
Route::post('/instructors/{id}/assign-programs', [InstructorController::class, 'assignProgram']);
Route::get('/instructors/{programId}/{yearLevel}', [InstructorController::class, 'getInstructorsByProgramAndYear']);
Route::get('/instructors/by-course', [InstructorController::class, 'getInstructorsByCourse']);
Route::get('/instructors', [InstructorController::class, 'index']);
Route::post('/instructors', [InstructorController::class, 'store']);
Route::put('/instructors/{id}', [InstructorController::class, 'update']);
Route::delete('/instructors/{id}', [InstructorController::class, 'destroy']);

//Programs Routes
Route::get('/programs', [ProgramController::class, 'index']);
Route::post('/programs', [ProgramController::class, 'store']);
Route::get('/programs/{id}', [ProgramController::class, 'show']);
Route::put('/programs/{id}', [ProgramController::class, 'update']);
Route::delete('/programs/{id}', [ProgramController::class, 'destroy']);
Route::get('/instructors/program/{id}', [InstructorController::class, 'getByProgram']);
Route::get('/programs/{code}/instructors', [ProgramController::class, 'getInstructorsByProgramCode']);
Route::get('/programs/{program}/year-levels', [ProgramController::class, 'getYearLevels']);

// Level Routes
Route::get('/grade-levels', [GradeLevelController::class, 'index']);
Route::post('/grade-levels', [GradeLevelController::class, 'store']);
Route::put('/grade-levels/{id}', [GradeLevelController::class, 'update']);
Route::delete('/grade-levels/{id}', [GradeLevelController::class, 'destroy']);

// Question Management Routes
Route::post('/questions', [QuestionController::class, 'store']); // Create
Route::get('/questions', [QuestionController::class, 'index']); // Fetch all questions
Route::put('/questions/{id}', [QuestionController::class, 'update']); // Update a question
Route::delete('/questions/{id}', [QuestionController::class, 'destroy']); // Delete a question
