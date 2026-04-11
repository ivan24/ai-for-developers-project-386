<?php

namespace Database\Seeders;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\EventType;
use App\Models\Owner;
use Carbon\CarbonImmutable;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class E2eBookingSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        Booking::query()->delete();
        EventType::query()->delete();
        Owner::query()->delete();

        Owner::query()->create([
            'name' => 'E2E Owner',
            'timezone' => 'UTC',
        ]);

        $eventType = EventType::query()->create([
            'name' => 'E2E Intro Call',
            'description' => 'Stable fixture for the guest booking Playwright flow.',
            'duration_minutes' => 30,
        ]);

        $today = CarbonImmutable::now('UTC')->startOfDay();
        $blockedSlotStart = $today->setTime(11, 0);

        Booking::query()->create([
            'event_type_id' => $eventType->id,
            'start_at' => $blockedSlotStart,
            'end_at' => $blockedSlotStart->addMinutes(30),
            'guest_name' => 'Existing Fixture Guest',
            'guest_email' => 'fixture@example.com',
            'guest_cancel_token' => 'fixture-guest-token',
            'status' => BookingStatus::Active,
        ]);
    }
}
