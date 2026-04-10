<?php

namespace App\Repositories;

use App\Enums\BookingStatus;
use App\Models\Booking;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

class BookingRepository
{
    /**
     * @return array{items: Collection<int, Booking>, total: int, limit: int, offset: int}
     */
    public function paginateUpcoming(CarbonImmutable $from, int $limit, int $offset): array
    {
        $query = Booking::query()
            ->with('eventType')
            ->where('start_at', '>=', $from)
            ->orderBy('start_at')
            ->orderBy('created_at');

        return [
            'items' => (clone $query)->offset($offset)->limit($limit)->get(),
            'total' => (clone $query)->count(),
            'limit' => $limit,
            'offset' => $offset,
        ];
    }

    public function findById(string $bookingId): ?Booking
    {
        return Booking::query()
            ->with('eventType')
            ->find($bookingId);
    }

    public function findByGuestCancelToken(string $guestCancelToken): ?Booking
    {
        return Booking::query()
            ->with('eventType')
            ->where('guest_cancel_token', $guestCancelToken)
            ->first();
    }

    public function create(array $attributes): Booking
    {
        /** @var Booking $booking */
        $booking = Booking::query()->create($attributes);

        return $booking->load('eventType');
    }

    public function save(Booking $booking): Booking
    {
        $booking->save();

        return $booking->refresh()->load('eventType');
    }

    public function hasActiveConflict(CarbonImmutable $startAt, CarbonImmutable $endAt): bool
    {
        return Booking::query()
            ->where('status', BookingStatus::Active->value)
            ->where('start_at', '<', $endAt)
            ->where('end_at', '>', $startAt)
            ->exists();
    }

    /**
     * @return Collection<int, Booking>
     */
    public function findActiveOverlappingWindow(CarbonImmutable $startAt, CarbonImmutable $endAt): Collection
    {
        return Booking::query()
            ->where('status', BookingStatus::Active->value)
            ->where('start_at', '<', $endAt)
            ->where('end_at', '>', $startAt)
            ->orderBy('start_at')
            ->get();
    }
}
