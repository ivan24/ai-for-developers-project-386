<?php

namespace Database\Seeders;

use App\Models\Owner;
use Illuminate\Database\Seeder;

class OwnerSeeder extends Seeder
{
    public function run(): void
    {
        Owner::query()->create([
            'name' => 'Demo Owner',
            'timezone' => 'UTC',
        ]);
    }
}
