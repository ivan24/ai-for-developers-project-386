<?php

namespace Database\Seeders;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\EventType;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        /** @var Collection<string, EventType> $eventTypes */
        $eventTypes = EventType::query()->orderBy('duration_minutes')->get()->keyBy('name');
        $now = CarbonImmutable::now('UTC');

        foreach ($this->bookingDefinitions($eventTypes, $now) as $definition) {
            Booking::query()->create($definition);
        }
    }

    /**
     * @param Collection<string, EventType> $eventTypes
     * @return array<int, array<string, mixed>>
     */
    private function bookingDefinitions(Collection $eventTypes, CarbonImmutable $now): array
    {
        $weeklySync = $eventTypes->get('Weekly Sync');
        $introCall = $eventTypes->get('Intro Call');
        $productDemo = $eventTypes->get('Product Demo');
        $deepDive = $eventTypes->get('Deep Dive');

        return [
            $this->makeBooking(
                $weeklySync->id,
                $now->addDay()->setTime(9, 0),
                15,
                'Alice Active',
                'alice@example.com',
                BookingStatus::Active,
            ),
            $this->makeBooking(
                $introCall->id,
                $now->addDays(2)->setTime(10, 0),
                30,
                'Bob Cancelled',
                'bob@example.com',
                BookingStatus::Cancelled,
            ),
            $this->makeBooking(
                $productDemo->id,
                $now->subDay()->setTime(11, 0),
                45,
                'Carol Past',
                'carol@example.com',
                BookingStatus::Active,
            ),
            $this->makeBooking(
                $deepDive->id,
                $now->subDays(2)->setTime(13, 0),
                60,
                'Dave Old Cancelled',
                'dave@example.com',
                BookingStatus::Cancelled,
            ),
            $this->makeBooking(
                $introCall->id,
                $now->addDay()->setTime(11, 0),
                30,
                'Erin Blocks Slot',
                'erin@example.com',
                BookingStatus::Active,
            ),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function makeBooking(
        string $eventTypeId,
        CarbonImmutable $startAt,
        int $durationMinutes,
        string $guestName,
        string $guestEmail,
        BookingStatus $status,
    ): array {
        return [
            'event_type_id' => $eventTypeId,
            'start_at' => $startAt,
            'end_at' => $startAt->addMinutes($durationMinutes),
            'guest_name' => $guestName,
            'guest_email' => $guestEmail,
            'guest_cancel_token' => (string) Str::ulid(),
            'status' => $status,
            'created_at' => $startAt->subDay(),
            'updated_at' => $startAt->subDay(),
        ];
    }
}
