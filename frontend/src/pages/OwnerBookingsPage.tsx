import {
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  useCancelBooking,
  useUpcomingBookings,
} from "../api/hooks";
import { ErrorState, LoadingState } from "../components/common/PageState";
import { formatDateTime, getApiErrorMessage } from "../utils/format";

export const OwnerBookingsPage = () => {
  const bookingsQuery = useUpcomingBookings();
  const cancelBookingMutation = useCancelBooking();

  const handleCancel = async (bookingId: string) => {
    try {
      await cancelBookingMutation.mutateAsync(bookingId);
      notifications.show({
        color: "teal",
        title: "Booking cancelled",
        message: "The booking has been marked as cancelled.",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Unable to cancel booking",
        message: getApiErrorMessage(error),
      });
    }
  };

  if (bookingsQuery.isLoading) {
    return <LoadingState label="Loading upcoming bookings..." />;
  }

  if (bookingsQuery.isError) {
    return <ErrorState message="Upcoming bookings are unavailable right now." />;
  }

  const bookings = bookingsQuery.data?.items ?? [];

  return (
    <Stack gap="xl">
      <div>
        <Text className="section-kicker">Owner dashboard</Text>
        <Title order={1}>Upcoming bookings</Title>
        <Text c="dimmed" mt={6}>
          Review all meetings across event types and cancel individual bookings
          when plans change.
        </Text>
      </div>

      <Stack gap="md">
        {bookings.map((booking) => (
          <Card key={booking.id} className="surface-card" padding="xl" radius="xl">
            <Stack gap="md">
              <Group justify="space-between" align="start">
                <Stack gap={4}>
                  <Text fw={700} size="lg">
                    {booking.eventTypeName}
                  </Text>
                  <Text c="dimmed">
                    {booking.guestName} · {booking.guestEmail}
                  </Text>
                </Stack>
                <Badge
                  variant="light"
                  color={booking.status === "active" ? "teal" : "gray"}
                  radius="xl"
                >
                  {booking.status}
                </Badge>
              </Group>

              <Group gap="xl">
                <div>
                  <Text fz="sm" c="dimmed">
                    Starts
                  </Text>
                  <Text fw={600}>{formatDateTime(booking.startAt)}</Text>
                </div>
                <div>
                  <Text fz="sm" c="dimmed">
                    Ends
                  </Text>
                  <Text fw={600}>{formatDateTime(booking.endAt)}</Text>
                </div>
              </Group>

              <Group justify="space-between" align="center">
                <Text fz="sm" c="dimmed">
                  Booking ID: {booking.id}
                </Text>
                <Button
                  radius="xl"
                  color="red"
                  variant="light"
                  disabled={booking.status !== "active"}
                  loading={
                    cancelBookingMutation.isPending &&
                    cancelBookingMutation.variables === booking.id
                  }
                  onClick={() => handleCancel(booking.id)}
                >
                  Cancel booking
                </Button>
              </Group>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};
