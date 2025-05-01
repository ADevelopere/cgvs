<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Log;

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
            
        // Template recipients routes
        Route::prefix('templates/{template}/recipients')->group(function() {
            Route::get('/', [\App\Http\Controllers\Admin\TemplateRecipientsController::class, 'index']);
            Route::get('/template', [\App\Http\Controllers\Admin\TemplateRecipientsController::class, 'downloadTemplate']);
            Route::post('/validate', [\App\Http\Controllers\Admin\TemplateRecipientsController::class, 'validateExcel']);
            Route::post('/import', [\App\Http\Controllers\Admin\TemplateRecipientsController::class, 'import']);
            Route::delete('/{id}', [\App\Http\Controllers\Admin\TemplateRecipientsController::class, 'destroy']);
        });
    });

    Route::get('/test-log', function() {
        Log::info('Test log entry');
        return response()->json(['message' => 'Test log written']);
    });
});
