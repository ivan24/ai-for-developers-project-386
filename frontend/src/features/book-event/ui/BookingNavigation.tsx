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
    <Group
      justify={activeStep === 0 ? "flex-end" : "space-between"}
      className="booking-navigation"
      wrap="nowrap"
      grow={activeStep > 0}
    >
      {activeStep > 0 ? (
        <Button variant="default" onClick={onBack}>
          Back
        </Button>
      ) : null}

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
