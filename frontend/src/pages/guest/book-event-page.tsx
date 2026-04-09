import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAvailableSlots, usePublicEventTypes } from "../../lib/api-hooks";
import { formatDate, formatTime, getSlotQueryRange, groupSlotsByDay } from "../../lib/date";
import { getErrorMessage } from "../../lib/errors";
import { Calendar } from "../../components/ui/calendar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { EmptyState, ErrorState, LoadingState } from "../../components/shared/states";
import { SectionHeading } from "../../components/shared/section-heading";

export function BookEventPage() {
  const { eventTypeId = "" } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const eventTypesQuery = usePublicEventTypes();
  const selectedEventType = eventTypesQuery.data?.items.find((item) => item.id === eventTypeId);
  const slotQuery = useMemo(
    () => (eventTypeId ? { eventTypeId, ...getSlotQueryRange(selectedDate) } : undefined),
    [eventTypeId, selectedDate],
  );
  const slotsQuery = useAvailableSlots(slotQuery);

  if (eventTypesQuery.isLoading) {
    return <LoadingState title="Loading event type..." />;
  }

  if (eventTypesQuery.error) {
    return (
      <ErrorState
        description={getErrorMessage(eventTypesQuery.error, "Unable to load event types.")}
        title="Event type unavailable"
      />
    );
  }

  if (!selectedEventType) {
    return (
      <ErrorState
        action={
          <Button asChild>
            <Link to="/">Back to list</Link>
          </Button>
        }
        description="The requested event type was not found in the public catalog."
        title="Event type not found"
      />
    );
  }

  if (slotsQuery.error) {
    return (
      <ErrorState
        description={getErrorMessage(slotsQuery.error, "Could not load available slots for this day.")}
        title="Slots unavailable"
      />
    );
  }

  const availableSlots = slotsQuery.data?.items.filter((slot) => slot.isAvailable) ?? [];
  const slotsByDay = groupSlotsByDay(availableSlots);

  return (
    <section className="space-y-6">
      <SectionHeading
        eyebrow="Pick a slot"
        title={selectedEventType.name}
        description={selectedEventType.description ?? "Choose a day, inspect free slots, and continue to checkout."}
      />
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <Badge>{selectedEventType.durationMinutes} min</Badge>
            <CardTitle>Select a date</CardTitle>
            <CardDescription>Slots are fetched for the selected local day and grouped with your browser timezone.</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" onSelect={(date) => date && setSelectedDate(date)} selected={selectedDate} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Badge>{slotsQuery.isFetching ? "Refreshing" : "Available slots"}</Badge>
            <CardTitle>{formatDate(selectedDate.toISOString())}</CardTitle>
            <CardDescription>
              Choose one of the free start times below to continue to checkout.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {slotsQuery.isLoading ? (
              <LoadingState title="Loading slots..." />
            ) : availableSlots.length === 0 ? (
              <EmptyState
                description="Try another date or create more event types and bookings in Prism-backed mocks."
                title="No free slots on this day"
              />
            ) : (
              <div className="space-y-5">
                {Object.entries(slotsByDay).map(([day, slots]) => (
                  <div key={day} className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {formatDate(slots[0]?.startAt ?? day)}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {slots.map((slot) => (
                        <Button asChild key={slot.startAt} variant="outline">
                          <Link to={`/book/${selectedEventType.id}/checkout?startAt=${encodeURIComponent(slot.startAt)}`}>
                            {formatTime(slot.startAt)}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
