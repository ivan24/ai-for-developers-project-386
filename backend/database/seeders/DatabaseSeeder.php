<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\EventType;
use App\Models\Owner;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        Booking::query()->delete();
        EventType::query()->delete();
        Owner::query()->delete();

        $this->call(DemoDataSeeder::class);
    }
}
