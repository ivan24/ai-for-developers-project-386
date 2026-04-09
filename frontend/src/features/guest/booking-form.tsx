import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const bookingSchema = z.object({
  guestName: z.string().trim().min(1, "Guest name is required."),
  guestEmail: z.email("Please enter a valid email address."),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  isPending?: boolean;
  errorMessage?: string | null;
  onSubmit: (values: BookingFormValues) => Promise<void>;
}

export function BookingForm({ isPending, errorMessage, onSubmit }: BookingFormProps) {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
    },
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="guest-name">Guest name</Label>
        <Input id="guest-name" placeholder="Ada Lovelace" {...form.register("guestName")} />
        {form.formState.errors.guestName ? (
          <p className="text-sm text-destructive">{form.formState.errors.guestName.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="guest-email">Guest email</Label>
        <Input id="guest-email" placeholder="ada@example.com" type="email" {...form.register("guestEmail")} />
        {form.formState.errors.guestEmail ? (
          <p className="text-sm text-destructive">{form.formState.errors.guestEmail.message}</p>
        ) : null}
      </div>
      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
      <Button className="w-full" disabled={isPending} size="lg" type="submit">
        {isPending ? "Creating booking..." : "Confirm booking"}
      </Button>
    </form>
  );
}
