import { Link, useSearchParams } from "react-router-dom";
import { useOwnerBookings } from "../../lib/api-hooks";
import { formatDateTime } from "../../lib/date";
import { getErrorMessage } from "../../lib/errors";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { EmptyState, ErrorState, LoadingState } from "../../components/shared/states";
import { SectionHeading } from "../../components/shared/section-heading";

export function OwnerBookingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const limit = Number(searchParams.get("limit") ?? 50);
  const offset = Number(searchParams.get("offset") ?? 0);
  const bookingsQuery = useOwnerBookings({
    from: new Date().toISOString(),
    limit,
    offset,
  });

  if (bookingsQuery.isLoading) {
    return <LoadingState title="Loading owner bookings..." />;
  }

  if (bookingsQuery.error) {
    return (
      <ErrorState
        description={getErrorMessage(bookingsQuery.error, "Unable to load upcoming bookings.")}
        title="Bookings unavailable"
      />
    );
  }

  const response = bookingsQuery.data;
  const items = response?.items ?? [];
  const meta = response?.meta;

  return (
    <section>
      <SectionHeading
        description="This view aggregates upcoming bookings across all event types using the owner API."
        eyebrow="Owner / bookings"
        title="Upcoming bookings"
      />
      {items.length === 0 ? (
        <EmptyState
          description="Once guests create bookings, they will appear here in a single combined list."
          title="No upcoming bookings"
        />
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Badge>{item.status}</Badge>
                    <CardTitle className="mt-3">{item.eventTypeName}</CardTitle>
                    <CardDescription>{formatDateTime(item.startAt)}</CardDescription>
                  </div>
                  <div className="rounded-[22px] bg-white/70 px-4 py-3 text-right text-sm text-muted-foreground">
                    <p>{item.guestName}</p>
                    <p>{item.guestEmail}</p>
                  </div>
                </div>
              </CardHeader>
              <CardFooter>
                <Button asChild variant="outline">
                  <Link to={`/owner/bookings/${item.id}`}>View booking details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-border bg-white/60 p-4">
            <p className="text-sm text-muted-foreground">
              Showing {offset + 1}-{Math.min(offset + limit, meta?.total ?? offset + items.length)} of {meta?.total ?? items.length}
            </p>
            <div className="flex gap-3">
              <Button
                disabled={offset <= 0}
                onClick={() => setSearchParams({ limit: String(limit), offset: String(Math.max(0, offset - limit)) })}
                variant="ghost"
              >
                Previous
              </Button>
              <Button
                disabled={!meta || offset + limit >= meta.total}
                onClick={() => setSearchParams({ limit: String(limit), offset: String(offset + limit) })}
                variant="outline"
              >
                Next page
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
