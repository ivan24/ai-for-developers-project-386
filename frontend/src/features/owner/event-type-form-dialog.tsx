import type { EventType, EventTypeCreateInput } from "@calendar-booking/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

const eventTypeSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  description: z.string().trim().optional(),
  durationMinutes: z.coerce.number().int().min(1, "Duration should be at least 1 minute."),
});

type EventTypeFormValues = z.input<typeof eventTypeSchema>;
type EventTypeFormOutput = z.output<typeof eventTypeSchema>;

interface EventTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventType?: EventType;
  isPending?: boolean;
  errorMessage?: string | null;
  onSubmit: (values: EventTypeCreateInput) => Promise<void>;
}

export function EventTypeFormDialog({
  open,
  onOpenChange,
  eventType,
  isPending,
  errorMessage,
  onSubmit,
}: EventTypeFormDialogProps) {
  const form = useForm<EventTypeFormValues, unknown, EventTypeFormOutput>({
    resolver: zodResolver(eventTypeSchema),
    defaultValues: {
      name: eventType?.name ?? "",
      description: eventType?.description ?? "",
      durationMinutes: eventType?.durationMinutes ?? 30,
    },
  });

  useEffect(() => {
    form.reset({
      name: eventType?.name ?? "",
      description: eventType?.description ?? "",
      durationMinutes: eventType?.durationMinutes ?? 30,
    });
  }, [eventType, form, open]);

  const title = eventType ? "Edit event type" : "Create event type";

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Define the public metadata guests will see before selecting a slot.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async (values) => {
            await onSubmit({
              name: values.name,
              description: values.description || undefined,
              durationMinutes: values.durationMinutes,
            });
          })}
        >
          <div className="space-y-2">
            <Label htmlFor="event-name">Name</Label>
            <Input id="event-name" placeholder="Intro call" {...form.register("name")} />
            {form.formState.errors.name ? (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-description">Description</Label>
            <Textarea
              id="event-description"
              placeholder="What the guest can expect from this booking"
              {...form.register("description")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-duration">Duration in minutes</Label>
            <Input id="event-duration" min={1} step={1} type="number" {...form.register("durationMinutes")} />
            {form.formState.errors.durationMinutes ? (
              <p className="text-sm text-destructive">{form.formState.errors.durationMinutes.message}</p>
            ) : null}
          </div>
          {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)} type="button" variant="ghost">
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? "Saving..." : eventType ? "Save changes" : "Create event type"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
