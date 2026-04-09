import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useCancelOwnerBooking, useOwnerBooking } from "../../lib/api-hooks";
import { formatDateTime } from "../../lib/date";
import { getErrorMessage } from "../../lib/errors";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { ErrorState, LoadingState } from "../../components/shared/states";
import { SectionHeading } from "../../components/shared/section-heading";

export function OwnerBookingDetailsPage() {
  const { bookingId = "" } = useParams();
  const bookingQuery = useOwnerBooking(bookingId);
  const cancelMutation = useCancelOwnerBooking();

  if (bookingQuery.isLoading) {
    return <LoadingState title="Loading booking details..." />;
  }

  if (bookingQuery.error) {
    return (
      <ErrorState
        action={
          <Button asChild>
            <Link to="/owner/bookings">Back to bookings</Link>
          </Button>
        }
        description={getErrorMessage(bookingQuery.error, "Unable to load booking details.")}
        title="Booking details unavailable"
      />
    );
  }

  if (!bookingQuery.data) {
    return null;
  }

  return (
    <section className="space-y-6">
      <SectionHeading
        description="Owner detail page for a single booking, including cancellation."
        eyebrow="Owner / booking detail"
        title={bookingQuery.data.eventTypeName}
      />
      <Card>
        <CardHeader>
          <Badge>{bookingQuery.data.status}</Badge>
          <CardTitle>{bookingQuery.data.guestName}</CardTitle>
          <CardDescription>{bookingQuery.data.guestEmail}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[24px] bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Booking id</p>
            <p className="mt-2 break-all font-medium text-foreground">{bookingQuery.data.id}</p>
          </div>
          <div className="rounded-[24px] bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Created at</p>
            <p className="mt-2 font-medium text-foreground">{formatDateTime(bookingQuery.data.createdAt)}</p>
          </div>
          <div className="rounded-[24px] bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Start</p>
            <p className="mt-2 font-medium text-foreground">{formatDateTime(bookingQuery.data.startAt)}</p>
          </div>
          <div className="rounded-[24px] bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">End</p>
            <p className="mt-2 font-medium text-foreground">{formatDateTime(bookingQuery.data.endAt)}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-2">
            <Button asChild variant="ghost">
              <Link to="/owner/bookings">Back to bookings</Link>
            </Button>
            <Button
              disabled={bookingQuery.data.status === "cancelled" || cancelMutation.isPending}
              onClick={async () => {
                try {
                  await cancelMutation.mutateAsync(bookingId);
                  toast.success("Booking cancelled.");
                } catch (error) {
                  toast.error(getErrorMessage(error, "Could not cancel booking."));
                }
              }}
              variant="destructive"
            >
              {cancelMutation.isPending ? "Cancelling..." : "Cancel booking"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
