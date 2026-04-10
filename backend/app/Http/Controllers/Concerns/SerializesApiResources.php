<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Booking;
use App\Models\EventType;
use App\Models\Owner;

trait SerializesApiResources
{
    private function serializeOwner(Owner $owner): array
    {
        return [
            'id' => $owner->id,
            'name' => $owner->name,
            'timezone' => $owner->timezone,
        ];
    }

    private function serializeEventType(EventType $eventType): array
    {
        return [
            'id' => $eventType->id,
            'name' => $eventType->name,
            'description' => $eventType->description,
            'durationMinutes' => $eventType->duration_minutes,
        ];
    }

    private function serializeBooking(Booking $booking): array
    {
        return [
            'id' => $booking->id,
            'eventTypeId' => $booking->event_type_id,
            'eventTypeName' => $booking->eventType->name,
            'startAt' => $booking->start_at->toIso8601String(),
            'endAt' => $booking->end_at->toIso8601String(),
            'guestName' => $booking->guest_name,
            'guestEmail' => $booking->guest_email,
            'createdAt' => $booking->created_at->toIso8601String(),
            'status' => $booking->status->value,
        ];
    }

    private function serializeGuestBooking(Booking $booking): array
    {
        return [
            ...$this->serializeBooking($booking),
            'guestCancelToken' => $booking->guest_cancel_token,
        ];
    }
}
