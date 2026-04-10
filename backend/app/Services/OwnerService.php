<?php

namespace App\Services;

use App\Exceptions\ApiNotFoundException;
use App\Models\Owner;
use App\Repositories\OwnerRepository;

class OwnerService
{
    public function __construct(private readonly OwnerRepository $owners) {}

    public function getProfile(): Owner
    {
        $owner = $this->owners->first();

        if ($owner === null) {
            throw new ApiNotFoundException('Owner profile was not found.');
        }

        return $owner;
    }
}
