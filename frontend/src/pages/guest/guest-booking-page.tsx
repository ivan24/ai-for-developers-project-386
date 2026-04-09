import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useCancelGuestBooking, useGuestBooking } from "../../lib/api-hooks";
import { formatDateTime } from "../../lib/date";
import { getErrorMessage } from "../../lib/errors";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ErrorState, LoadingState } from "../../components/shared/states";
import { SectionHeading } from "../../components/shared/section-heading";
import { useParams } from "react-router-dom";

export function GuestBookingPage() {
  const { guestCancelToken = "" } = useParams();
  const [searchParams] = useSearchParams();
  const bookingQuery = useGuestBooking(guestCancelToken);
  const cancelMutation = useCancelGuestBooking();
  const created = searchParams.get("created") === "1";

  if (bookingQuery.isLoading) {
    return <LoadingState title="Loading booking..." />;
  }

  if (bookingQuery.error) {
    return (
      <ErrorState
        action={
          <Button asChild>
            <Link to="/">Back to booking list</Link>
          </Button>
        }
        description={getErrorMessage(bookingQuery.error, "Could not load booking by token.")}
        title="Booking not found"
      />
    );
  }

  if (!bookingQuery.data) {
    return null;
  }

  return (
    <section className="space-y-6">
      <SectionHeading
        eyebrow="Guest self-service"
        title="Manage your booking"
        description="This route is keyed by the guest cancel token returned at booking creation time."
      />
      <Card>
        <CardHeader>
          <Badge>{bookingQuery.data.status}</Badge>
          <CardTitle>{bookingQuery.data.eventTypeName}</CardTitle>
          <CardDescription>
            {created ? "Booking created successfully. Keep this page or token to cancel later." : "Guest token flow without auth."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[24px] bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Guest</p>
            <p className="mt-2 font-medium text-foreground">{bookingQuery.data.guestName}</p>
            <p className="text-sm text-muted-foreground">{bookingQuery.data.guestEmail}</p>
          </div>
          <div className="rounded-[24px] bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Start time</p>
            <p className="mt-2 font-medium text-foreground">{formatDateTime(bookingQuery.data.startAt)}</p>
            <p className="text-sm text-muted-foreground">End: {formatDateTime(bookingQuery.data.endAt)}</p>
          </div>
          <div className="rounded-[24px] bg-white/70 p-4 lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Guest cancel token</p>
            <p className="mt-2 break-all font-medium text-foreground">{bookingQuery.data.guestCancelToken}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-2">
            <Button
              disabled={bookingQuery.data.status === "cancelled" || cancelMutation.isPending}
              onClick={async () => {
                try {
                  await cancelMutation.mutateAsync(guestCancelToken);
                  toast.success("Booking cancelled.");
                } catch (error) {
                  toast.error(getErrorMessage(error, "Could not cancel booking."));
                }
              }}
              variant="destructive"
            >
              {cancelMutation.isPending ? "Cancelling..." : "Cancel booking"}
            </Button>
            <Button asChild variant="ghost">
              <Link to="/">Book another event</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
