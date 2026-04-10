<?php

namespace App\Repositories;

use App\Models\Owner;

class OwnerRepository
{
    public function first(): ?Owner
    {
        return Owner::query()->orderBy('created_at')->first();
    }
}
