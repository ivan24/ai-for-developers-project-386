import { Group, Paper, Stack, Text } from "@mantine/core";
import type { EventType, Slot } from "@/shared/api/types";
import { formatDateTime, formatDuration, formatTime } from "@/shared/lib/format";

interface SelectedSlotSummaryProps {
  eventType: EventType;
  selectedDateLabel: string;
  selectedSlot: Slot | null;
}

export const SelectedSlotSummary = ({
  eventType,
  selectedDateLabel,
  selectedSlot,
}: SelectedSlotSummaryProps) => {
  if (!selectedSlot) {
    return null;
  }

  return (
    <Paper className="booking-selected-slot-summary" p="md" radius="xl">
      <Stack gap={6}>
        <Group justify="space-between" align="flex-start" gap="sm">
          <div>
            <Text className="muted-label">Selected slot</Text>
            <Text fw={700}>{selectedDateLabel}</Text>
          </div>

          <Text fw={700} c="indigo">
            {formatDuration(eventType.durationMinutes)}
          </Text>
        </Group>

        <Text fw={700} fz="lg">
          {formatTime(selectedSlot.startAt)}
        </Text>
        <Text c="dimmed" fz="sm">
          {formatDateTime(selectedSlot.startAt)}
        </Text>
      </Stack>
    </Paper>
  );
};
