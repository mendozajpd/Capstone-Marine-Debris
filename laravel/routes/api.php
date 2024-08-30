<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProjectController;

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


Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']); 

// PROJECTCONTROLLER
Route::post('projects', [ProjectController::class, 'createProject']);
Route::put('projects', [ProjectController::class, 'updateProject']);
Route::delete('projects', [ProjectController::class, 'deleteProject']);
Route::get('projects', [ProjectController::class, 'getAllProjects']); 
Route::get('project/{id}', [ProjectController::class, 'getProjectByProjectId']); 
Route::get('portfolios/{portfolioId}/projects', [ProjectController::class, 'getProjectsByPortfolioId']);
Route::get('auth/projects', [ProjectController::class, 'getProjectsForAuthenticatedUser']);

// USERCONTROLLER
Route::get('users', [UserController::class, 'index']);
Route::get('usersInformation', [UserController::class, 'informationIndex']);
Route::get('users/{id}', [UserController::class, 'show']);
Route::post('users', [UserController::class, 'store']);
Route::put('users/{id}', [UserController::class, 'update']);
Route::put('usersInfo/{id}', [UserController::class, 'updateInformation']);
Route::delete('users/{id}', [UserController::class, 'destroy']);

Route::group([

    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);


    
    // Route::get('email/verify/{id}', function (Request $request, $id) {
    //     $user = App\Models\User::find($id);

    //     if (!$user) {
    //         abort(404);
    //     }

    //     $user->markEmailAsVerified();

    //     return redirect(env('FRONT_END_URL') . '/home');
    // })->name('verification.verify');
});