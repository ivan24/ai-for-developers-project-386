<?php

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\EventType;
use App\Models\Owner;
use Carbon\CarbonImmutable;

function createEventTypeWithOwner(): EventType
{
    Owner::query()->create([
        'name' => 'Demo Owner',
        'timezone' => 'UTC',
    ]);

    return EventType::query()->create([
        'name' => 'Intro Call',
        'description' => 'First touchpoint.',
        'duration_minutes' => 30,
    ]);
}

test('owner profile and event type crud flow', function () {
    $owner = Owner::query()->create([
        'name' => 'Demo Owner',
        'timezone' => 'UTC',
    ]);

    $eventType = EventType::query()->create([
        'name' => 'Intro Call',
        'description' => 'First touchpoint.',
        'duration_minutes' => 30,
    ]);

    $this->getJson('/owner')
        ->assertOk()
        ->assertExactJson([
            'id' => $owner->id,
            'name' => 'Demo Owner',
            'timezone' => 'UTC',
        ]);

    $this->getJson('/owner/event-types')
        ->assertOk()
        ->assertJsonPath('items.0.id', $eventType->id)
        ->assertJsonPath('items.0.durationMinutes', 30);

    $createResponse = $this->postJson('/owner/event-types', [
        'name' => 'Deep Dive',
        'description' => 'Long session.',
        'durationMinutes' => 60,
    ]);

    $createResponse
        ->assertCreated()
        ->assertJsonPath('name', 'Deep Dive')
        ->assertJsonPath('durationMinutes', 60);

    $createdId = (string) $createResponse->json('id');

    $this->patchJson("/owner/event-types/{$createdId}", [
        'description' => 'Updated description.',
    ])
        ->assertOk()
        ->assertJsonPath('id', $createdId)
        ->assertJsonPath('description', 'Updated description.');

    $this->patchJson('/owner/event-types/missing-id', [
        'name' => 'Nope',
    ])
        ->assertNotFound()
        ->assertExactJson([
            'code' => 'not_found',
            'message' => 'Event type was not found.',
        ]);
});

test('owner bookings list detail and cancel flow', function () {
    $eventType = createEventTypeWithOwner();
    $booking = Booking::query()->create([
        'event_type_id' => $eventType->id,
        'start_at' => CarbonImmutable::parse('2030-01-10T10:00:00Z'),
        'end_at' => CarbonImmutable::parse('2030-01-10T10:30:00Z'),
        'guest_name' => 'Ada Lovelace',
        'guest_email' => 'ada@example.com',
        'guest_cancel_token' => 'guest-token-1',
        'status' => BookingStatus::Active,
    ]);

    $this->getJson('/owner/bookings?from=2030-01-01T00:00:00Z&limit=20&offset=0')
        ->assertOk()
        ->assertJsonPath('items.0.id', $booking->id)
        ->assertJsonPath('items.0.eventTypeName', 'Intro Call')
        ->assertJsonPath('items.0.status', 'active')
        ->assertJsonPath('meta.total', 1);

    $this->getJson("/owner/bookings/{$booking->id}")
        ->assertOk()
        ->assertJsonPath('id', $booking->id)
        ->assertJsonPath('guestEmail', 'ada@example.com');

    $this->postJson("/owner/bookings/{$booking->id}/cancel")
        ->assertOk()
        ->assertJsonPath('status', 'cancelled');

    $this->postJson("/owner/bookings/{$booking->id}/cancel")
        ->assertOk()
        ->assertJsonPath('status', 'cancelled');
});

test('public event types and slots include unavailable slot', function () {
    Owner::query()->create([
        'name' => 'Demo Owner',
        'timezone' => 'UTC',
    ]);

    $eventType = EventType::query()->create([
        'name' => 'Intro Call',
        'description' => 'First touchpoint.',
        'duration_minutes' => 30,
    ]);

    Booking::query()->create([
        'event_type_id' => $eventType->id,
        'start_at' => CarbonImmutable::parse('2030-01-10T10:00:00Z'),
        'end_at' => CarbonImmutable::parse('2030-01-10T10:30:00Z'),
        'guest_name' => 'Busy Guest',
        'guest_email' => 'busy@example.com',
        'guest_cancel_token' => 'busy-token',
        'status' => BookingStatus::Active,
    ]);

    $this->getJson('/public/event-types')
        ->assertOk()
        ->assertJsonPath('items.0.id', $eventType->id)
        ->assertJsonPath('items.0.name', 'Intro Call');

    $response = $this->getJson('/public/event-types/'.$eventType->id.'/slots?from=2030-01-10T00:00:00Z&to=2030-01-10T23:59:59Z&limit=50&offset=0');

    $response
        ->assertOk()
        ->assertJsonPath('meta.total', 18);

    $slots = $response->json('items');
    $targetSlot = collect($slots)->firstWhere('startAt', '2030-01-10T10:00:00+00:00');

    expect($targetSlot)->not->toBeNull();
    expect($targetSlot['isAvailable'])->toBeFalse();
});

test('guest can create lookup and cancel booking', function () {
    Owner::query()->create([
        'name' => 'Demo Owner',
        'timezone' => 'UTC',
    ]);

    $eventType = EventType::query()->create([
        'name' => 'Intro Call',
        'description' => 'First touchpoint.',
        'duration_minutes' => 30,
    ]);

    $createResponse = $this->postJson('/public/bookings', [
        'eventTypeId' => $eventType->id,
        'startAt' => '2030-01-10T09:00:00Z',
        'guestName' => 'Grace Hopper',
        'guestEmail' => 'grace@example.com',
    ]);

    $createResponse
        ->assertCreated()
        ->assertJsonPath('booking.eventTypeId', $eventType->id)
        ->assertJsonPath('booking.eventTypeName', 'Intro Call')
        ->assertJsonPath('booking.status', 'active')
        ->assertJsonPath('booking.endAt', '2030-01-10T09:30:00+00:00');

    $guestToken = (string) $createResponse->json('booking.guestCancelToken');

    $this->getJson("/public/bookings/by-token/{$guestToken}")
        ->assertOk()
        ->assertJsonPath('guestCancelToken', $guestToken);

    $this->postJson("/public/bookings/by-token/{$guestToken}/cancel")
        ->assertOk()
        ->assertJsonPath('status', 'cancelled');
});

test('guest cannot create overlapping active booking', function () {
    Owner::query()->create([
        'name' => 'Demo Owner',
        'timezone' => 'UTC',
    ]);

    $eventType = EventType::query()->create([
        'name' => 'Intro Call',
        'description' => 'First touchpoint.',
        'duration_minutes' => 30,
    ]);

    Booking::query()->create([
        'event_type_id' => $eventType->id,
        'start_at' => CarbonImmutable::parse('2030-01-10T10:00:00Z'),
        'end_at' => CarbonImmutable::parse('2030-01-10T10:30:00Z'),
        'guest_name' => 'Existing Guest',
        'guest_email' => 'existing@example.com',
        'guest_cancel_token' => 'existing-token',
        'status' => BookingStatus::Active,
    ]);

    $this->postJson('/public/bookings', [
        'eventTypeId' => $eventType->id,
        'startAt' => '2030-01-10T10:00:00Z',
        'guestName' => 'Another Guest',
        'guestEmail' => 'another@example.com',
    ])
        ->assertStatus(409)
        ->assertExactJson([
            'code' => 'slot_conflict',
            'message' => 'The selected slot is no longer available.',
        ]);
});

test('validation errors return 400 payload', function () {
    $this->postJson('/owner/event-types', [
        'name' => '',
        'durationMinutes' => 0,
    ])
        ->assertStatus(400)
        ->assertJsonPath('code', 'validation_error');

    $this->getJson('/public/event-types/missing-id/slots?from=2030-01-10T00:00:00Z&limit=0')
        ->assertStatus(400)
        ->assertJsonPath('code', 'validation_error');
});
