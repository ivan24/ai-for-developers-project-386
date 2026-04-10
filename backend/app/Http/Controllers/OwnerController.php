<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\SerializesApiResources;
use App\Services\OwnerService;
use Illuminate\Http\JsonResponse;

class OwnerController extends Controller
{
    use SerializesApiResources;

    public function __construct(private readonly OwnerService $owners) {}

    public function show(): JsonResponse
    {
        return response()->json($this->serializeOwner($this->owners->getProfile()));
    }
}
