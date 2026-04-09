import { useState } from "react";
import { toast } from "sonner";
import { useCreateEventType, useOwnerEventTypes, useUpdateEventType } from "../../lib/api-hooks";
import { getErrorMessage } from "../../lib/errors";
import { EventTypeFormDialog } from "../../features/owner/event-type-form-dialog";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { EmptyState, ErrorState, LoadingState } from "../../components/shared/states";
import { SectionHeading } from "../../components/shared/section-heading";
import type { EventType } from "@calendar-booking/api-client";

export function OwnerEventTypesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEventType, setEditingEventType] = useState<EventType | undefined>();
  const eventTypesQuery = useOwnerEventTypes();
  const createMutation = useCreateEventType();
  const updateMutation = useUpdateEventType();

  if (eventTypesQuery.isLoading) {
    return <LoadingState title="Loading owner event types..." />;
  }

  if (eventTypesQuery.error) {
    return (
      <ErrorState
        description={getErrorMessage(eventTypesQuery.error, "Unable to load event types.")}
        title="Owner event types unavailable"
      />
    );
  }

  const items = eventTypesQuery.data?.items ?? [];
  const activeMutation = editingEventType ? updateMutation : createMutation;

  return (
    <section>
      <SectionHeading
        action={
          <Button
            onClick={() => {
              setEditingEventType(undefined);
              setDialogOpen(true);
            }}
          >
            New event type
          </Button>
        }
        description="Create and update the event types exposed in the public catalog. Delete is intentionally omitted because the contract does not provide it."
        eyebrow="Owner / event types"
        title="Manage public event offerings"
      />
      {items.length === 0 ? (
        <EmptyState
          action={
            <Button
              onClick={() => {
                setEditingEventType(undefined);
                setDialogOpen(true);
              }}
            >
              Create first event type
            </Button>
          }
          description="Guests will only see event types after they are created here."
          title="No event types yet"
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="flex h-full flex-col justify-between">
              <CardHeader>
                <Badge>{item.durationMinutes} min</Badge>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description ?? "No description yet."}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-[24px] bg-white/70 p-4 text-sm text-muted-foreground">
                  Event type id: <span className="font-medium text-foreground">{item.id}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => {
                    setEditingEventType(item);
                    setDialogOpen(true);
                  }}
                  variant="outline"
                >
                  Edit event type
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <EventTypeFormDialog
        errorMessage={activeMutation.error ? getErrorMessage(activeMutation.error) : null}
        eventType={editingEventType}
        isPending={activeMutation.isPending}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingEventType(undefined);
          }
        }}
        onSubmit={async (values) => {
          try {
            if (editingEventType) {
              await updateMutation.mutateAsync({
                eventTypeId: editingEventType.id,
                payload: values,
              });
              toast.success("Event type updated.");
            } else {
              await createMutation.mutateAsync(values);
              toast.success("Event type created.");
            }
            setDialogOpen(false);
            setEditingEventType(undefined);
          } catch (error) {
            toast.error(getErrorMessage(error, "Could not save event type."));
            throw error;
          }
        }}
        open={dialogOpen}
      />
    </section>
  );
}
