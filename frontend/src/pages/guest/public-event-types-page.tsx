import { Link } from "react-router-dom";
import { usePublicEventTypes } from "../../lib/api-hooks";
import { getErrorMessage } from "../../lib/errors";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { EmptyState, ErrorState, LoadingState } from "../../components/shared/states";
import { SectionHeading } from "../../components/shared/section-heading";

export function PublicEventTypesPage() {
  const eventTypesQuery = usePublicEventTypes();

  if (eventTypesQuery.isLoading) {
    return <LoadingState title="Loading public event types..." />;
  }

  if (eventTypesQuery.error) {
    return (
      <ErrorState
        description={getErrorMessage(eventTypesQuery.error, "Unable to load event types.")}
        title="Public event types unavailable"
      />
    );
  }

  const items = eventTypesQuery.data?.items ?? [];

  return (
    <section>
      <SectionHeading
        eyebrow="Guest booking"
        title="Choose the format that fits your conversation"
        description="Guests can browse event types, inspect duration, open the calendar, and lock a free slot without registration."
      />
      {items.length === 0 ? (
        <EmptyState
          description="Once the owner creates event types, they will appear here for guests."
          title="No event types published yet"
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="flex h-full flex-col justify-between">
              <CardHeader>
                <Badge>{item.durationMinutes} min</Badge>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description ?? "No description provided yet."}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-[24px] bg-white/70 p-4 text-sm text-muted-foreground">
                  Booking conflicts are global across all event types, so only truly free slots will be shown.
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={`/book/${item.id}`}>Open booking calendar</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
