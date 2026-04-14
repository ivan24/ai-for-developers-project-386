<?php

use App\Models\Booking;
use App\Models\EventType;
use App\Models\Owner;

test('demo seed command populates empty database once', function () {
    $this->artisan('app:seed-demo-if-empty')
        ->expectsOutputToContain('Demo data seeded.')
        ->assertSuccessful();

    expect(Owner::query()->count())->toBe(1)
        ->and(EventType::query()->count())->toBe(4)
        ->and(Booking::query()->count())->toBe(5);

    $this->artisan('app:seed-demo-if-empty')
        ->expectsOutputToContain('Skipping demo seed')
        ->assertSuccessful();

    expect(Owner::query()->count())->toBe(1)
        ->and(EventType::query()->count())->toBe(4)
        ->and(Booking::query()->count())->toBe(5);
});

test('demo seed command does not add demo data to a non-empty booking setup', function () {
    Owner::query()->create([
        'name' => 'Manual Owner',
        'timezone' => 'UTC',
    ]);

    EventType::query()->create([
        'name' => 'Manual Event Type',
        'description' => 'Created manually.',
        'duration_minutes' => 30,
    ]);

    $this->artisan('app:seed-demo-if-empty')
        ->expectsOutputToContain('Skipping demo seed')
        ->assertSuccessful();

    expect(Owner::query()->count())->toBe(1)
        ->and(EventType::query()->count())->toBe(1)
        ->and(Booking::query()->count())->toBe(0);
});
