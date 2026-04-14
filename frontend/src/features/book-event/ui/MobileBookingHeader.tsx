import { Badge, Group, Paper, Stack, Text, Title } from "@mantine/core";
import type { EventType } from "@/shared/api/types";
import { formatDuration } from "@/shared/lib/format";

interface MobileBookingHeaderProps {
  eventType: EventType;
}

export const MobileBookingHeader = ({
  eventType,
}: MobileBookingHeaderProps) => (
  <Paper className="surface-card mobile-booking-header" p="md" radius="xl">
    <Group justify="space-between" align="flex-start" gap="sm" wrap="nowrap">
      <Stack gap={4} className="mobile-booking-header-copy">
        <Text className="section-kicker">Guest booking</Text>
        <Title order={3} className="mobile-booking-title">
          {eventType.name}
        </Title>
        {eventType.description ? (
          <Text c="dimmed" lineClamp={1} fz="sm">
            {eventType.description}
          </Text>
        ) : null}
      </Stack>

      <Badge color="indigo" size="lg" variant="light">
        {formatDuration(eventType.durationMinutes)}
      </Badge>
    </Group>
  </Paper>
);
