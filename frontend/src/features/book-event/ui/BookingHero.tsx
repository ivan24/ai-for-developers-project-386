import { Badge, Group, Paper, Stack, Text, Title } from "@mantine/core";
import type { EventType } from "@/shared/api/types";
import { formatDuration } from "@/shared/lib/format";

interface BookingHeroProps {
  eventType: EventType;
}

export const BookingHero = ({ eventType }: BookingHeroProps) => (
  <Paper className="surface-card page-hero" p="xl">
    <Stack gap="md">
      <Group justify="space-between" align="start">
        <div>
          <Text className="section-kicker">Guest booking</Text>
          <Title order={1}>{eventType.name}</Title>
        </div>
        <Badge color="indigo" size="lg">
          {formatDuration(eventType.durationMinutes)}
        </Badge>
      </Group>
      <Text c="dimmed">
        {eventType.description || "No description provided yet."}
      </Text>
      <Text c="dimmed" fz="sm">
        Pick a date, choose an available slot, and confirm the booking without
        extra UI noise.
      </Text>
    </Stack>
  </Paper>
);
