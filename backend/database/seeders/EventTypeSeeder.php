<?php

namespace Database\Seeders;

use App\Models\EventType;
use Illuminate\Database\Seeder;

class EventTypeSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->eventTypes() as $attributes) {
            EventType::query()->create($attributes);
        }
    }

    /**
     * @return array<int, array{name: string, description: string, duration_minutes: int}>
     */
    private function eventTypes(): array
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
}
