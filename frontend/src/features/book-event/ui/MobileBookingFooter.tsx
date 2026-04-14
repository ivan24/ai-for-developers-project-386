import { Button, Group, Paper, Stack, Text } from "@mantine/core";
import type { Slot } from "@/shared/api/types";
import { formatDuration, formatTime } from "@/shared/lib/format";

interface MobileBookingFooterProps {
  activeStep: number;
  durationMinutes: number;
  selectedDateLabel: string;
  selectedSlot: Slot | null;
  canContinueFromSchedule: boolean;
  canSubmit: boolean;
  isPending: boolean;
  onBack: () => void;
  onNextFromSchedule: () => void;
  onCreateBooking: () => void;
}

export const MobileBookingFooter = ({
  activeStep,
  durationMinutes,
  selectedDateLabel,
  selectedSlot,
  canContinueFromSchedule,
  canSubmit,
  isPending,
  onBack,
  onNextFromSchedule,
  onCreateBooking,
}: MobileBookingFooterProps) => {
  if (activeStep >= 2) {
    return null;
  }

  return (
    <div className="booking-mobile-footer-wrap">
      <Paper className="surface-card booking-mobile-footer" p="md" radius="xl">
        <Stack gap="sm">
          {selectedSlot ? (
            <div>
              <Text className="muted-label">Selected</Text>
              <Text fw={700}>
                {selectedDateLabel} at {formatTime(selectedSlot.startAt)}
              </Text>
              <Text c="dimmed" fz="sm">
                {formatDuration(durationMinutes)}
              </Text>
            </div>
          ) : (
            <Text c="dimmed" fz="sm">
              Choose a date and one available time to continue.
            </Text>
          )}

          {activeStep === 0 ? (
            <Button
              fullWidth
              disabled={!canContinueFromSchedule}
              onClick={onNextFromSchedule}
            >
              Continue to details
            </Button>
          ) : (
            <Group grow wrap="nowrap">
              <Button variant="default" onClick={onBack}>
                Back
              </Button>
              <Button
                loading={isPending}
                disabled={!canSubmit}
                onClick={onCreateBooking}
              >
                Create booking
              </Button>
            </Group>
          )}
        </Stack>
      </Paper>
    </div>
  );
};
