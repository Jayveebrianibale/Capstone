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
use App\Http\Controllers\InstructorController;
use App\Http\Controllers\StudentProfileController;
use App\Http\Controllers\LevelController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\GradeLevelController;
use App\Models\Program;
use App\Http\Controllers\PDFController;

// Authentication Routes
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'getUser']);
Route::middleware('auth:sanctum')->post('/logout', [GoogleAuthController::class, 'logout']);
Route::get('/auth/google', [GoogleAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);

// **Student Profile Setup**
Route::middleware('auth:sanctum')->post('/student/setup-profile', [StudentProfileController::class, 'setupProfile']);
Route::middleware('auth:sanctum')->get('/student/profile', [StudentProfileController::class, 'getProfile']);

// Student Routes
Route::get('/students', [UserController::class, 'getAllStudents']);
Route::get('/students/{student}/instructors', [StudentController::class, 'getStudentInstructors']);

//Evaluation Routes
Route::middleware('auth:sanctum')->post('/evaluations', [EvaluationController::class, 'store']);
Route::middleware('auth:sanctum')->get('/evaluations', [EvaluationController::class, 'index']);
Route::middleware('auth:sanctum')->get('/evaluations/{evaluation}/responses', [EvaluationController::class, 'getEvaluationWithResponses']);
Route::get('/check-evaluation/{instructorId}', [EvaluationController::class, 'checkEvaluationStatus']);
Route::post('/evaluations/submit-all', [EvaluationController::class, 'submitAll'])->middleware('auth:sanctum');
Route::get('/programs/{code}/instructor-results', [ProgramController::class, 'getInstructorResultsByProgram']);
Route::get('/top-instructors', [EvaluationController::class, 'topRatedInstructors']);
Route::get('/instructor-distributions', [EvaluationController::class, 'getAllInstructorDistributions']);



// Instructor Routes
Route::post('/instructors/{id}/assign-programs', [InstructorController::class, 'assignProgram']);
Route::get('/instructors/program/{programId}/year/{yearLevel}', [InstructorController::class, 'getInstructorsByProgramAndYear']);
Route::get('/instructors/by-course', [InstructorController::class, 'getInstructorsByCourse']);
Route::get('/instructors', [InstructorController::class, 'index']);
Route::post('/instructors', [InstructorController::class, 'store']);
Route::put('/instructors/{id}', [InstructorController::class, 'update']);
Route::delete('/instructors/{id}', [InstructorController::class, 'destroy']);
//PDF Routes
Route::get('/instructors/{id}/pdf', [PDFController::class, 'generatePDF']);
Route::post('instructors/{id}/send-result', [InstructorController::class, 'sendResult']);
Route::get('/instructors/{id}/programs', [InstructorController::class, 'getAssignedPrograms']);
Route::post('/instructors/bulk-upload', [InstructorController::class, 'bulkUpload']);

//get instructor results by intructor id
Route::get('/instructor/{id}/ratings', [InstructorController::class, 'getInstructorAverageRatings']);
Route::get('/instructors/{id}/comments-with-students', [InstructorController::class, 'getInstructorCommentsWithStudentNames']); // New route
Route::get('/evaluation-submission-overall', [EvaluationController::class, 'overallEvaluationSubmissionStats']);
Route::get('/evaluation-submission-stats', [EvaluationController::class, 'evaluationSubmissionStats']);
Route::get('/program-evaluation-stats', [EvaluationController::class, 'programEvaluationStats']);
Route::get('/course-evaluation-submission-counts', [EvaluationController::class, 'courseEvaluationSubmissionCounts']);
Route::get('/instructor/{id}/comments-with-student-names', [InstructorController::class, 'getCommentsWithStudentNames']);

Route::get('/test-cors', function () {
    return response()->json(['message' => 'CORS works!']);
});


//Programs Routes
// Bulk‐upload programs via CSV
Route::post('/programs/bulk-upload', [ProgramController::class, 'bulkUpload']);
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
Route::post('/questions/bulk-upload', [QuestionController::class, 'bulkUpload']);
Route::post('/questions', [QuestionController::class, 'store']); // Create
Route::get('/questions', [QuestionController::class, 'index']); // Fetch all questions
Route::put('/questions/{id}', [QuestionController::class, 'update']); // Update a question
Route::delete('/questions/{id}', [QuestionController::class, 'destroy']); // Delete a question
