<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\SerializesApiResources;
use App\Http\Requests\CreateEventTypeRequest;
use App\Http\Requests\UpdateEventTypeRequest;
use App\Services\EventTypeService;
use Illuminate\Http\JsonResponse;

class OwnerEventTypeController extends Controller
{
    use SerializesApiResources;

    public function __construct(private readonly EventTypeService $eventTypes) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'items' => $this->eventTypes
                ->listOwnerEventTypes()
                ->map(fn ($eventType) => $this->serializeEventType($eventType))
                ->all(),
        ]);
    }

    public function store(CreateEventTypeRequest $request): JsonResponse
    {
        $eventType = $this->eventTypes->create($request->validated());

        return response()->json($this->serializeEventType($eventType), 201);
    }

    public function update(UpdateEventTypeRequest $request, string $eventTypeId): JsonResponse
    {
        return response()->json(
            $this->serializeEventType(
                $this->eventTypes->update($eventTypeId, $request->validated())
            )
        );
    }
}
