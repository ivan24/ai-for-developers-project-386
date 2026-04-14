<?php

namespace Database\Seeders;

use App\Models\EventType;
use Database\Seeders\Support\DemoSeedData;
use Illuminate\Database\Seeder;

class EventTypeSeeder extends Seeder
{
    public function run(): void
    {
        foreach (DemoSeedData::eventTypes() as $attributes) {
            EventType::query()->create($attributes);
        }
    }
}
