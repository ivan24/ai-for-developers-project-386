import { Alert, Button, Group, Stack } from "@mantine/core";
import { Link } from "react-router-dom";
import type { GuestBooking } from "@/shared/api/types";
import { formatDateTime } from "@/shared/lib/format";

interface BookingCompletedStepProps {
  createdBooking: GuestBooking | null;
  onBookAnother: () => void;
}

export const BookingCompletedStep = ({
  createdBooking,
  onBookAnother,
}: BookingCompletedStepProps) => (
  <Stack gap="lg" pt="md">
    <Alert data-testid="booking-confirmed-alert" color="teal" title="Booking confirmed">
      {createdBooking ? (
        <>
          {createdBooking.guestName}, your booking is set for{" "}
          {formatDateTime(createdBooking.startAt)}. Guest token:{" "}
          {createdBooking.guestCancelToken}
        </>
      ) : (
        "The booking was created successfully."
      )}
    </Alert>

    <Group>
      <Button onClick={onBookAnother}>Book another slot</Button>
      <Button component={Link} to="/" variant="light">
        Back to event types
      </Button>
    </Group>
  </Stack>
);
