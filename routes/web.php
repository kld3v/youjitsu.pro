<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\VideoController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [VideoController::class, 'index'])->middleware(['auth', 'verified'])->name('videos.index');

Route::get('/upload', function () {
    return Inertia::render('Upload');
})->middleware(['auth', 'verified'])->name('upload');

Route::post('/upload', [VideoController::class, 'store'])->name('videos.store');
Route::delete('/videos/{id}', [VideoController::class, 'destroy'])->name('videos.destroy');

Route::get('/reviews/{id}', [ReviewController::class, 'show'])->middleware(['auth', 'verified'])->name('reviews');

Route::post('reviews/{id}', [ReviewController::class, 'store'])->middleware(['auth', 'verified'])->name('reviews.store');

Route::get('create-submission/{id}', [SubmissionController::class, 'create'])->middleware(['auth', 'verified'])->name('submission.create');



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';