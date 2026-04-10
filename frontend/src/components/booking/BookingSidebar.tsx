import { Alert, Badge, Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import type { EventType, GuestBooking, Slot } from "../../api/types";
import { formatDuration, formatTime } from "../../utils/format";

interface BookingSidebarProps {
  eventType: EventType;
  selectedDateLabel: string;
  selectedSlot: Slot | null;
  createdBooking: GuestBooking | null;
}

export const BookingSidebar = ({
  eventType,
  selectedDateLabel,
  selectedSlot,
  createdBooking,
}: BookingSidebarProps) => (
  <Card className="surface-card booking-summary-card">
    <Stack gap="lg">
      <div>
        <Text className="section-kicker">Booking progress</Text>
        <Title order={3}>Your selection</Title>
      </div>

      <Stack gap="xs">
        <Text fw={700}>Event type</Text>
        <Text c="dimmed">{eventType.name}</Text>
      </Stack>

      <Group justify="space-between">
        <Text fw={700}>Duration</Text>
        <Badge color="indigo">
          {formatDuration(eventType.durationMinutes)}
        </Badge>
      </Group>

      <Stack gap="xs">
        <Text fw={700}>Date</Text>
        <Text c="dimmed">{selectedDateLabel}</Text>
      </Stack>

      <Stack gap="xs">
        <Text fw={700}>Time</Text>
        <Text c="dimmed">
          {selectedSlot
            ? `${formatTime(selectedSlot.startAt)} - ${formatTime(selectedSlot.endAt)}`
            : "Not selected yet"}
        </Text>
      </Stack>

      <Alert
        color={createdBooking ? "teal" : selectedSlot ? "indigo" : "gray"}
        title={createdBooking ? "Ready" : selectedSlot ? "Almost there" : "Next step"}
      >
        {createdBooking
          ? "Booking created successfully."
          : selectedSlot
            ? "Enter guest details and confirm the booking."
            : "Choose a date and then select one of the available slots."}
      </Alert>

      <Button component={Link} to="/" variant="subtle">
        Back to event types
      </Button>
    </Stack>
  </Card>
);
