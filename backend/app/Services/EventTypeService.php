<?php

namespace App\Services;

use App\Exceptions\ApiNotFoundException;
use App\Models\EventType;
use App\Repositories\EventTypeRepository;
use Illuminate\Support\Collection;

class EventTypeService
{
    public function __construct(private readonly EventTypeRepository $eventTypes) {}

    public function create(array $input): EventType
    {
        return $this->eventTypes->create($this->normalizeAttributes($input));
    }

    public function update(string $eventTypeId, array $input): EventType
    {
        $eventType = $this->eventTypes->findById($eventTypeId);

        if ($eventType === null) {
            throw new ApiNotFoundException('Event type was not found.');
        }

        return $this->eventTypes->update($eventType, $this->normalizeAttributes($input, true));
    }

    /**
     * @return Collection<int, EventType>
     */
    public function listOwnerEventTypes(): Collection
    {
        return $this->eventTypes->all();
    }

    /**
     * @return Collection<int, EventType>
     */
    public function listPublicEventTypes(): Collection
    {
        return $this->eventTypes->all();
    }

    private function normalizeAttributes(array $input, bool $partial = false): array
    {
        $attributes = [];

        if (! $partial || array_key_exists('name', $input)) {
            $attributes['name'] = trim((string) ($input['name'] ?? ''));
        }

        if (! $partial || array_key_exists('description', $input)) {
            $description = array_key_exists('description', $input)
                ? trim((string) ($input['description'] ?? ''))
                : null;

            $attributes['description'] = $description !== '' ? $description : null;
        }

        if (! $partial || array_key_exists('durationMinutes', $input)) {
            $attributes['duration_minutes'] = (int) ($input['durationMinutes'] ?? 0);
        }

        return $attributes;
    }
}
