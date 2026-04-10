<?php

namespace App\Repositories;

use App\Models\EventType;
use Illuminate\Support\Collection;

class EventTypeRepository
{
    /**
     * @return Collection<int, EventType>
     */
    public function all(): Collection
    {
        return EventType::query()
            ->orderBy('created_at')
            ->orderBy('name')
            ->get();
    }

    public function findById(string $eventTypeId): ?EventType
    {
        return EventType::query()->find($eventTypeId);
    }

    public function create(array $attributes): EventType
    {
        /** @var EventType $eventType */
        $eventType = EventType::query()->create($attributes);

        return $eventType->refresh();
    }

    public function update(EventType $eventType, array $attributes): EventType
    {
        $eventType->fill($attributes);
        $eventType->save();

        return $eventType->refresh();
    }
}
