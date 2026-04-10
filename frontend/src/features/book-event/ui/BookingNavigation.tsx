import { Button, Group } from "@mantine/core";

interface BookingNavigationProps {
  activeStep: number;
  canContinueFromSchedule: boolean;
  canSubmit: boolean;
  isPending: boolean;
  onBack: () => void;
  onNextFromSchedule: () => void;
  onCreateBooking: () => void;
}

export const BookingNavigation = ({
  activeStep,
  canContinueFromSchedule,
  canSubmit,
  isPending,
  onBack,
  onNextFromSchedule,
  onCreateBooking,
}: BookingNavigationProps) => {
  if (activeStep >= 2) {
    return null;
  }

  return (
    <Group justify="space-between">
      <Button variant="default" disabled={activeStep === 0} onClick={onBack}>
        Back
      </Button>

      {activeStep === 0 ? (
        <Button
          disabled={!canContinueFromSchedule}
          onClick={onNextFromSchedule}
        >
          Continue to details
        </Button>
      ) : null}

      {activeStep === 1 ? (
        <Button
          loading={isPending}
          disabled={!canSubmit}
          onClick={onCreateBooking}
        >
          Create booking
        </Button>
      ) : null}
    </Group>
  );
};
