<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $name
 * @property string $timezone
 */
class Owner extends Model
{
    use HasUlids;

    protected $fillable = [
        'name',
        'timezone',
    ];
}
