<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\SerializesApiResources;
use App\Http\Requests\ListAvailableSlotsRequest;
use App\Services\BookingService;
use App\Services\EventTypeService;
use Illuminate\Http\JsonResponse;

class PublicEventTypeController extends Controller
{
    use SerializesApiResources;

    public function __construct(
        private readonly EventTypeService $eventTypes,
        private readonly BookingService $bookings,
    ) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'items' => $this->eventTypes
                ->listPublicEventTypes()
                ->map(fn ($eventType) => $this->serializeEventType($eventType))
                ->all(),
        ]);
    }

    public function slots(ListAvailableSlotsRequest $request, string $eventTypeId): JsonResponse
    {
        $result = $this->bookings->listAvailableSlots($eventTypeId, $request->validated());

        return response()->json([
            'items' => $result['items'],
            'meta' => [
                'total' => $result['total'],
                'limit' => $result['limit'],
                'offset' => $result['offset'],
            ],
        ]);
    }
}
