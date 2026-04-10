<?php

use App\Exceptions\ApiNotFoundException;
use App\Exceptions\SlotConflictException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: '',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (ApiNotFoundException $exception, Request $request) {
            return response()->json([
                'code' => 'not_found',
                'message' => $exception->getMessage(),
            ], 404);
        });

        $exceptions->render(function (SlotConflictException $exception, Request $request) {
            return response()->json([
                'code' => 'slot_conflict',
                'message' => $exception->getMessage(),
            ], 409);
        });
    })->create();
