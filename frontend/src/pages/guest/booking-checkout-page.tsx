import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useCreateBooking, usePublicEventTypes } from "../../lib/api-hooks";
import { formatDateTime } from "../../lib/date";
import { getErrorMessage, isApiStatus } from "../../lib/errors";
import { BookingForm } from "../../features/guest/booking-form";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ErrorState, LoadingState } from "../../components/shared/states";
import { SectionHeading } from "../../components/shared/section-heading";

export function BookingCheckoutPage() {
  const { eventTypeId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const eventTypesQuery = usePublicEventTypes();
  const createBookingMutation = useCreateBooking();
  const selectedEventType = eventTypesQuery.data?.items.find((item) => item.id === eventTypeId);
  const startAt = searchParams.get("startAt") ?? "";

  if (eventTypesQuery.isLoading) {
    return <LoadingState title="Loading checkout..." />;
  }

  if (eventTypesQuery.error) {
    return (
      <ErrorState
        description={getErrorMessage(eventTypesQuery.error, "Unable to load event types.")}
        title="Checkout unavailable"
      />
    );
  }

  if (!selectedEventType || !startAt) {
    return (
      <ErrorState
        action={
          <Button asChild>
            <Link to="/">Back to home</Link>
          </Button>
        }
        description="The selected event type or start time is missing from the checkout request."
        title="Booking request is incomplete"
      />
    );
  }

  return (
    <section className="space-y-6">
      <SectionHeading
        eyebrow="Checkout"
        title="Confirm guest details"
        description="The server computes end time from the event type duration. You only send event type, slot start, guest name, and guest email."
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <Badge>Booking summary</Badge>
            <CardTitle>{selectedEventType.name}</CardTitle>
            <CardDescription>{selectedEventType.description ?? "No public description provided."}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[24px] bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Start time</p>
              <p className="mt-2 font-medium text-foreground">{formatDateTime(startAt)}</p>
            </div>
            <div className="rounded-[24px] bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Duration</p>
              <p className="mt-2 font-medium text-foreground">{selectedEventType.durationMinutes} minutes</p>
            </div>
            <Button asChild variant="ghost">
              <Link to={`/book/${selectedEventType.id}`}>Pick another slot</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Badge>Guest details</Badge>
            <CardTitle>Complete the booking</CardTitle>
            <CardDescription>After success you will receive a guest cancel token and land on the self-service page.</CardDescription>
          </CardHeader>
          <CardContent>
            <BookingForm
              errorMessage={serverError}
              isPending={createBookingMutation.isPending}
              onSubmit={async (values) => {
                try {
                  setServerError(null);
                  const result = await createBookingMutation.mutateAsync({
                    eventTypeId: selectedEventType.id,
                    startAt,
                    guestName: values.guestName,
                    guestEmail: values.guestEmail,
                  });

                  toast.success("Booking created.");
                  navigate(`/booking/${result.booking.guestCancelToken}?created=1`);
                } catch (error) {
                  const message = getErrorMessage(error, "Booking failed.");
                  setServerError(message);

                  if (isApiStatus(error, 409)) {
                    toast.error("This slot was taken. Please choose another one.");
                  } else {
                    toast.error(message);
                  }
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
