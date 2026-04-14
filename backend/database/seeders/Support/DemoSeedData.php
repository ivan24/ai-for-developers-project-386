<?php

namespace Database\Seeders\Support;

use App\Enums\BookingStatus;
use Carbon\CarbonImmutable;

final class DemoSeedData
{
    /**
     * @return array{name: string, timezone: string}
     */
    public static function owner(): array
    {
        return [
            'name' => 'Demo Owner',
            'timezone' => 'UTC',
        ];
    }

    /**
     * @return array<int, array{name: string, description: string, duration_minutes: int}>
     */
    public static function eventTypes(): array
    {
        return [
            [
                'name' => 'Intro Call',
                'description' => 'Quick intro and project context.',
                'duration_minutes' => 30,
            ],
            [
                'name' => 'Product Demo',
                'description' => 'Walkthrough of the product and Q&A.',
                'duration_minutes' => 45,
            ],
            [
                'name' => 'Deep Dive',
                'description' => 'Longer technical session.',
                'duration_minutes' => 60,
            ],
            [
                'name' => 'Weekly Sync',
                'description' => 'Short recurring sync format.',
                'duration_minutes' => 15,
            ],
        ];
    }

    /**
     * @return array<int, array{
     *   event_type_name: string,
     *   start_at: CarbonImmutable,
     *   end_at: CarbonImmutable,
     *   guest_name: string,
     *   guest_email: string,
     *   status: BookingStatus,
     *   created_at: CarbonImmutable,
     *   updated_at: CarbonImmutable
     * }>
     */
    public static function bookings(CarbonImmutable $now): array
    {
        return [
            self::makeBooking(
                'Weekly Sync',
                $now->addDay()->setTime(9, 0),
                15,
                'Alice Active',
                'alice@example.com',
                BookingStatus::Active,
            ),
            self::makeBooking(
                'Intro Call',
                $now->addDays(2)->setTime(10, 0),
                30,
                'Bob Cancelled',
                'bob@example.com',
                BookingStatus::Cancelled,
            ),
            self::makeBooking(
                'Product Demo',
                $now->subDay()->setTime(11, 0),
                45,
                'Carol Past',
                'carol@example.com',
                BookingStatus::Active,
            ),
            self::makeBooking(
                'Deep Dive',
                $now->subDays(2)->setTime(13, 0),
                60,
                'Dave Old Cancelled',
                'dave@example.com',
                BookingStatus::Cancelled,
            ),
            self::makeBooking(
                'Intro Call',
                $now->addDay()->setTime(11, 0),
                30,
                'Erin Blocks Slot',
                'erin@example.com',
                BookingStatus::Active,
            ),
        ];
    }

    /**
     * @return array{
     *   event_type_name: string,
     *   start_at: CarbonImmutable,
     *   end_at: CarbonImmutable,
     *   guest_name: string,
     *   guest_email: string,
     *   status: BookingStatus,
     *   created_at: CarbonImmutable,
     *   updated_at: CarbonImmutable
     * }
     */
    private static function makeBooking(
        string $eventTypeName,
        CarbonImmutable $startAt,
        int $durationMinutes,
        string $guestName,
        string $guestEmail,
        BookingStatus $status,
    ): array {
        return [
            'event_type_name' => $eventTypeName,
            'start_at' => $startAt,
            'end_at' => $startAt->addMinutes($durationMinutes),
            'guest_name' => $guestName,
            'guest_email' => $guestEmail,
            'status' => $status,
            'created_at' => $startAt->subDay(),
            'updated_at' => $startAt->subDay(),
        ];
    }
}
