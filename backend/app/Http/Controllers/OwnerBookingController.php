<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\SerializesApiResources;
use App\Http\Requests\ListBookingsRequest;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;

class OwnerBookingController extends Controller
{
    use SerializesApiResources;

    public function __construct(private readonly BookingService $bookings) {}

    public function index(ListBookingsRequest $request): JsonResponse
    {
        $result = $this->bookings->listUpcoming($request->validated());

        return response()->json([
            'items' => $result['items']
                ->map(fn ($booking) => $this->serializeBooking($booking))
                ->all(),
            'meta' => [
                'total' => $result['total'],
                'limit' => $result['limit'],
                'offset' => $result['offset'],
            ],
        ]);
    }

    public function show(string $bookingId): JsonResponse
    {
        return response()->json($this->serializeBooking($this->bookings->getById($bookingId)));
    }

    public function cancel(string $bookingId): JsonResponse
    {
        return response()->json($this->serializeBooking($this->bookings->cancelByOwner($bookingId)));
    }
}
