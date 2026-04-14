<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\EventType;
use Carbon\CarbonImmutable;
use Database\Seeders\Support\DemoSeedData;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use RuntimeException;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        /** @var Collection<string, EventType> $eventTypes */
        $eventTypes = EventType::query()->orderBy('duration_minutes')->get()->keyBy('name');
        $now = CarbonImmutable::now(DemoSeedData::owner()['timezone']);

        foreach ($this->bookingDefinitions($eventTypes, $now) as $definition) {
            Booking::query()->create($definition);
        }
    }

    /**
     * @param  Collection<string, EventType>  $eventTypes
     * @return array<int, array<string, mixed>>
     */
    private function bookingDefinitions(Collection $eventTypes, CarbonImmutable $now): array
    {
        $definitions = [];

        foreach (DemoSeedData::bookings($now) as $definition) {
            $eventType = $eventTypes->get($definition['event_type_name']);

            if (! $eventType instanceof EventType) {
                throw new RuntimeException(
                    sprintf('Demo booking references unknown event type "%s".', $definition['event_type_name']),
                );
            }

            unset($definition['event_type_name']);

            $definitions[] = [
                ...$definition,
                'event_type_id' => $eventType->id,
                'guest_cancel_token' => (string) Str::ulid(),
            ];
        }

        return $definitions;
    }
}
