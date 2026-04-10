<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\SerializesApiResources;
use App\Http\Requests\CreateBookingRequest;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;

class PublicBookingController extends Controller
{
    use SerializesApiResources;

    public function __construct(private readonly BookingService $bookings) {}

    public function store(CreateBookingRequest $request): JsonResponse
    {
        return response()->json([
            'booking' => $this->serializeGuestBooking($this->bookings->create($request->validated())),
        ], 201);
    }

    public function showByToken(string $guestCancelToken): JsonResponse
    {
        return response()->json(
            $this->serializeGuestBooking($this->bookings->getByGuestToken($guestCancelToken))
        );
    }

    public function cancelByToken(string $guestCancelToken): JsonResponse
    {
        return response()->json(
            $this->serializeGuestBooking($this->bookings->cancelByGuestToken($guestCancelToken))
        );
    }
}
