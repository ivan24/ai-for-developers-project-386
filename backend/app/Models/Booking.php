<?php

namespace App\Models;

use App\Enums\BookingStatus;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $event_type_id
 * @property CarbonImmutable $start_at
 * @property CarbonImmutable $end_at
 * @property string $guest_name
 * @property string $guest_email
 * @property string $guest_cancel_token
 * @property BookingStatus $status
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read EventType|null $eventType
 */
class Booking extends Model
{
    use HasUlids;

    protected $fillable = [
        'event_type_id',
        'start_at',
        'end_at',
        'guest_name',
        'guest_email',
        'guest_cancel_token',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'start_at' => 'immutable_datetime',
            'end_at' => 'immutable_datetime',
            'created_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
            'status' => BookingStatus::class,
        ];
    }

    /**
     * @return BelongsTo<EventType, $this>
     */
    public function eventType(): BelongsTo
    {
        return $this->belongsTo(EventType::class);
    }
}
