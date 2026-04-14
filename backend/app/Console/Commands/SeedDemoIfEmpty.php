<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Models\EventType;
use Database\Seeders\DemoDataSeeder;
use Illuminate\Console\Command;

class SeedDemoIfEmpty extends Command
{
    protected $signature = 'app:seed-demo-if-empty';

    protected $description = 'Seed demo data only when the booking tables are still empty';

    public function handle(): int
    {
        $hasEventTypes = EventType::query()->exists();
        $hasBookings = Booking::query()->exists();

        if ($hasEventTypes || $hasBookings) {
            $this->comment('Skipping demo seed because the database already contains booking data.');

            return self::SUCCESS;
        }

        $this->call('db:seed', [
            '--class' => DemoDataSeeder::class,
            '--force' => true,
        ]);

        $this->info('Demo data seeded.');

        return self::SUCCESS;
    }
}
