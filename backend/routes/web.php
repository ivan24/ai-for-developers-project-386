<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'Calendar API',
        'status' => 'ok',
    ]);
});

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
    ]);
});
