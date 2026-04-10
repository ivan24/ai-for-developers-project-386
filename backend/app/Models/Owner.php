<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Owner extends Model
{
    use HasUlids;

    protected $fillable = [
        'name',
        'timezone',
    ];
}
