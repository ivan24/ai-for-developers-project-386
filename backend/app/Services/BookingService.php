<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Exceptions\ApiNotFoundException;
use App\Exceptions\SlotConflictException;
use App\Models\Booking;
use App\Models\EventType;
use App\Models\Owner;
use App\Repositories\BookingRepository;
use App\Repositories\EventTypeRepository;
use App\Repositories\OwnerRepository;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BookingService
{
    public function __construct(
        private readonly BookingRepository $bookings,
        private readonly EventTypeRepository $eventTypes,
        private readonly OwnerRepository $owners,
    ) {}

    /**
     * @param  array{from?: string|null, limit?: int|string|null, offset?: int|string|null}  $input
     * @return array{items: Collection<int, Booking>, total: int, limit: int, offset: int}
     */
    public function listUpcoming(array $input): array
    {
        $from = isset($input['from'])
            ? CarbonImmutable::parse($input['from'])->utc()
            : CarbonImmutable::now('UTC');

        $limit = isset($input['limit']) ? (int) $input['limit'] : 20;
        $offset = isset($input['offset']) ? (int) $input['offset'] : 0;

        return $this->bookings->paginateUpcoming($from, $limit, $offset);
    }

    public function getById(string $bookingId): Booking
    {
        $booking = $this->bookings->findById($bookingId);

        if ($booking === null) {
            throw new ApiNotFoundException('Booking was not found.');
        }

        return $booking;
    }

    public function getByGuestToken(string $guestCancelToken): Booking
    {
        $booking = $this->bookings->findByGuestCancelToken($guestCancelToken);

        if ($booking === null) {
            throw new ApiNotFoundException('Booking was not found.');
        }

        return $booking;
    }

    /**
     * @param  array{from: string, to: string, timezone?: string|null, limit?: int|string|null, offset?: int|string|null}  $input
     * @return array{items: array<int, array{eventTypeId: string, startAt: string, endAt: string, isAvailable: bool}>, total: int, limit: int, offset: int}
     */
    public function listAvailableSlots(string $eventTypeId, array $input): array
    {
        $eventType = $this->requireEventType($eventTypeId);
        $owner = $this->requireOwner();

        $fromUtc = CarbonImmutable::parse($input['from'])->utc();
        $toUtc = CarbonImmutable::parse($input['to'])->utc();
        $limit = isset($input['limit']) ? (int) $input['limit'] : 20;
        $offset = isset($input['offset']) ? (int) $input['offset'] : 0;

        $windowBookings = $this->bookings->findActiveOverlappingWindow($fromUtc, $toUtc);
        $slots = $this->buildSlots($owner, $eventType, $fromUtc, $toUtc, $windowBookings);
        $total = count($slots);

        return [
            'items' => array_slice($slots, $offset, $limit),
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset,
        ];
    }

    /**
     * @param  array{eventTypeId: string, startAt: string, guestName: string, guestEmail: string}  $input
     */
    public function create(array $input): Booking
    {
        $eventType = $this->requireEventType((string) $input['eventTypeId']);
        $startAt = CarbonImmutable::parse($input['startAt'])->utc();
        $endAt = $startAt->addMinutes($eventType->duration_minutes);

        return DB::transaction(function () use ($input, $eventType, $startAt, $endAt): Booking {
            if ($this->bookings->hasActiveConflict($startAt, $endAt)) {
                throw new SlotConflictException;
            }

            return $this->bookings->create([
                'event_type_id' => $eventType->id,
                'start_at' => $startAt,
                'end_at' => $endAt,
                'guest_name' => trim((string) $input['guestName']),
                'guest_email' => trim((string) $input['guestEmail']),
                'guest_cancel_token' => (string) Str::ulid(),
                'status' => BookingStatus::Active,
            ]);
        });
    }

    public function cancelByOwner(string $bookingId): Booking
    {
        return $this->cancel($this->getById($bookingId));
    }

    public function cancelByGuestToken(string $guestCancelToken): Booking
    {
        return $this->cancel($this->getByGuestToken($guestCancelToken));
    }

    /**
     * @param  Collection<int, Booking>  $windowBookings
     * @return array<int, array{eventTypeId: string, startAt: string, endAt: string, isAvailable: bool}>
     */
    private function buildSlots(
        Owner $owner,
        EventType $eventType,
        CarbonImmutable $fromUtc,
        CarbonImmutable $toUtc,
        Collection $windowBookings,
    ): array {
        $ownerTimezone = $owner->timezone;
        $durationMinutes = $eventType->duration_minutes;

        $startDay = $fromUtc->setTimezone($ownerTimezone)->startOfDay();
        $endDay = $toUtc->setTimezone($ownerTimezone)->startOfDay();
        $currentDay = $startDay;
        $slots = [];

        while ($currentDay->lessThanOrEqualTo($endDay)) {
            $workdayStart = $currentDay->setTime(9, 0);
            $workdayEnd = $currentDay->setTime(18, 0);
            $slotStart = $workdayStart;

            while ($slotStart->addMinutes($durationMinutes)->lessThanOrEqualTo($workdayEnd)) {
                $slotEnd = $slotStart->addMinutes($durationMinutes);
                $slotStartUtc = $slotStart->utc();
                $slotEndUtc = $slotEnd->utc();

                if (
                    $slotStartUtc->greaterThanOrEqualTo($fromUtc)
                    && $slotEndUtc->lessThanOrEqualTo($toUtc)
                ) {
                    $isAvailable = ! $windowBookings->contains(
                        fn (Booking $booking): bool => $booking->start_at->lt($slotEndUtc)
                            && $booking->end_at->gt($slotStartUtc)
                    );

                    $slots[] = [
                        'eventTypeId' => $eventType->id,
                        'startAt' => $slotStartUtc->toIso8601String(),
                        'endAt' => $slotEndUtc->toIso8601String(),
                        'isAvailable' => $isAvailable,
                    ];
                }

                $slotStart = $slotStart->addMinutes($durationMinutes);
            }

            $currentDay = $currentDay->addDay();
        }

        return $slots;
    }

    private function cancel(Booking $booking): Booking
    {
        if ($booking->status === BookingStatus::Cancelled) {
            return $booking;
        }

        $booking->status = BookingStatus::Cancelled;

        return $this->bookings->save($booking);
    }

    private function requireEventType(string $eventTypeId): EventType
    {
        $eventType = $this->eventTypes->findById($eventTypeId);

        if ($eventType === null) {
            throw new ApiNotFoundException('Event type was not found.');
        }

        return $eventType;
    }

    private function requireOwner(): Owner
    {
        $owner = $this->owners->first();

        if ($owner === null) {
            throw new ApiNotFoundException('Owner profile was not found.');
        }

        return $owner;
    }
}
