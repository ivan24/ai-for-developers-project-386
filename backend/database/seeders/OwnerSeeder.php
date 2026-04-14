<?php

namespace Database\Seeders;

use App\Models\Owner;
use Database\Seeders\Support\DemoSeedData;
use Illuminate\Database\Seeder;

class OwnerSeeder extends Seeder
{
    public function run(): void
    {
        Owner::query()->create(DemoSeedData::owner());
    }
}
