<?php

use App\Http\Controllers\OwnerBookingController;
use App\Http\Controllers\OwnerController;
use App\Http\Controllers\OwnerEventTypeController;
use App\Http\Controllers\PublicBookingController;
use App\Http\Controllers\PublicEventTypeController;
use Illuminate\Support\Facades\Route;

Route::prefix('owner')->group(function (): void {
    Route::get('/', [OwnerController::class, 'show']);
    Route::get('/event-types', [OwnerEventTypeController::class, 'index']);
    Route::post('/event-types', [OwnerEventTypeController::class, 'store']);
    Route::patch('/event-types/{eventTypeId}', [OwnerEventTypeController::class, 'update']);

    Route::get('/bookings', [OwnerBookingController::class, 'index']);
    Route::get('/bookings/{bookingId}', [OwnerBookingController::class, 'show']);
    Route::post('/bookings/{bookingId}/cancel', [OwnerBookingController::class, 'cancel']);
});

Route::prefix('public')->group(function (): void {
    Route::get('/event-types', [PublicEventTypeController::class, 'index']);
    Route::get('/event-types/{eventTypeId}/slots', [PublicEventTypeController::class, 'slots']);

    Route::post('/bookings', [PublicBookingController::class, 'store']);
    Route::get('/bookings/by-token/{guestCancelToken}', [PublicBookingController::class, 'showByToken']);
    Route::post('/bookings/by-token/{guestCancelToken}/cancel', [PublicBookingController::class, 'cancelByToken']);
});
