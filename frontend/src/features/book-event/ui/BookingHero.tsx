import { Badge, Group, Paper, Stack, Text, Title } from "@mantine/core";
import type { EventType } from "@/shared/api/types";
import type { Slot } from "@/shared/api/types";
import { formatDateTime, formatDuration, formatTime } from "@/shared/lib/format";

interface BookingHeroProps {
  eventType: EventType;
  selectedDateLabel: string;
  selectedSlot: Slot | null;
}

const getSummaryHint = (selectedSlot: Slot | null) => {
  if (selectedSlot) {
    return "Selected a slot already. Continue to the details step when ready.";
  }

  return "Start with a date, then choose one available time to continue.";
};

export const BookingHero = ({
  eventType,
  selectedDateLabel,
  selectedSlot,
}: BookingHeroProps) => (
  <Paper
    className="surface-card page-hero booking-event-summary booking-summary-card"
    p={{ base: "lg", sm: "xl" }}
    radius="xl"
  >
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start" gap="sm">
        <div className="booking-summary-copy">
          <Text className="section-kicker">Guest booking</Text>
          <Title order={2} className="booking-summary-title">
            {eventType.name}
          </Title>
        </div>
        <Badge color="indigo" size="lg" variant="light">
          {formatDuration(eventType.durationMinutes)}
        </Badge>
      </Group>

      {eventType.description ? (
        <Text c="dimmed" lineClamp={3}>
          {eventType.description}
        </Text>
      ) : null}

      <Stack gap="sm">
        <Paper className="booking-summary-fact" p="md" radius="lg">
          <Text className="muted-label">Selected date</Text>
          <Text fw={700}>{selectedDateLabel}</Text>
        </Paper>

        <Paper className="booking-summary-fact" p="md" radius="lg">
          <Text className="muted-label">Selected time</Text>
          <Text fw={700}>
            {selectedSlot ? formatTime(selectedSlot.startAt) : "Choose an available slot"}
          </Text>
          {selectedSlot ? (
            <Text c="dimmed" fz="sm">
              {formatDateTime(selectedSlot.startAt)}
            </Text>
          ) : null}
        </Paper>
      </Stack>

      <Text c="dimmed" fz="sm" className="booking-summary-note">
        {getSummaryHint(selectedSlot)}
      </Text>
    </Stack>
  </Paper>
);
