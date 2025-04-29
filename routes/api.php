<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;

// Public routes
Route::middleware(['api'])->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected routes
Route::middleware(['api', 'auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index']);
        Route::get('/templates/config', [\App\Http\Controllers\Admin\TemplateController::class, 'config']);
        Route::apiResource('templates', \App\Http\Controllers\Admin\TemplateController::class);
        
        // Template variables routes
        Route::apiResource('templates.variables', \App\Http\Controllers\Admin\TemplateVariableController::class)
            ->only(['index', 'store']);
            
        // Shallow routes for variables
        Route::apiResource('variables', \App\Http\Controllers\Admin\TemplateVariableController::class)
            ->only(['show', 'update', 'destroy']);
    });
});
