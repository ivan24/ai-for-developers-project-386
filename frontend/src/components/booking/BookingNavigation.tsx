import { Button, Group } from "@mantine/core";

interface BookingNavigationProps {
  activeStep: number;
  canContinueFromSlot: boolean;
  canSubmit: boolean;
  isPending: boolean;
  onBack: () => void;
  onNextFromDate: () => void;
  onNextFromSlot: () => void;
  onCreateBooking: () => void;
}

export const BookingNavigation = ({
  activeStep,
  canContinueFromSlot,
  canSubmit,
  isPending,
  onBack,
  onNextFromDate,
  onNextFromSlot,
  onCreateBooking,
}: BookingNavigationProps) => {
  if (activeStep >= 3) {
    return null;
  }

  return (
    <Group justify="space-between">
      <Button
        variant="default"
        disabled={activeStep === 0}
        onClick={onBack}
      >
        Back
      </Button>

      {activeStep === 0 && (
        <Button onClick={onNextFromDate}>
          Continue to slots
        </Button>
      )}

      {activeStep === 1 && (
        <Button
          disabled={!canContinueFromSlot}
          onClick={onNextFromSlot}
        >
          Continue to details
        </Button>
      )}

      {activeStep === 2 && (
        <Button
          loading={isPending}
          disabled={!canSubmit}
          onClick={onCreateBooking}
        >
          Create booking
        </Button>
      )}
    </Group>
  );
};
