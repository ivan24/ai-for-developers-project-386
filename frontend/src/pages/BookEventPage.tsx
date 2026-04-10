import { Button, Card, Stack, Stepper } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Link, useParams } from "react-router-dom";
import { usePublicEventTypes } from "../api/hooks";
import { ErrorState, LoadingState } from "../components/common/PageState";

// UI Components
import { BookingHero } from "../components/booking/BookingHero";
import { BookingNavigation } from "../components/booking/BookingNavigation";

// Steps
import { BookingCompletedStep } from "../components/booking/steps/BookingCompletedStep";
import { GuestDetailsStep } from "../components/booking/steps/GuestDetailsStep";
import { ScheduleStep } from "../components/booking/steps/ScheduleStep";

// Hooks
import { useBookingFlow } from "../components/booking/hooks/useBookingFlow";

export const BookEventPage = () => {
  const { eventTypeId } = useParams();
  const isMobile = useMediaQuery("(max-width: 48em)");
  const eventTypesQuery = usePublicEventTypes();

  const {
    activeStep,
    setActiveStep,
    selectedDate,
    selectedSlot,
    createdBooking,
    slots,
    slotsQuery,
    form,
    selectedDateLabel,
    canContinueFromSchedule,
    canSubmit,
    isCreatingBooking,
    handlers,
  } = useBookingFlow({ eventTypeId });

  const selectedEventType = (eventTypesQuery.data ?? []).find(
    (item) => item.id === eventTypeId,
  );

  if (eventTypesQuery.isLoading) {
    return <LoadingState label="Loading event details..." />;
  }

  if (eventTypesQuery.isError) {
    return <ErrorState message="Event details are unavailable right now." />;
  }

  if (!selectedEventType) {
    return (
      <ErrorState
        message="The requested event type was not found."
        action={
          <Button component={Link} to="/">
            Back to event types
          </Button>
        }
      />
    );
  }

  return (
    <Stack gap="xl">
      <BookingHero eventType={selectedEventType} />

      <Card className="surface-card booking-stepper">
        <Stack gap="xl">
          <Stepper
            active={activeStep}
            onStepClick={setActiveStep}
            allowNextStepsSelect={false}
            orientation={isMobile ? "vertical" : "horizontal"}
            color="indigo"
            iconSize={42}
            styles={{ separator: { marginInline: 12 } }}
          >
            <Stepper.Step
              label="Schedule"
              description="Pick day & time"
              loading={activeStep === 0 && slotsQuery.isFetching}
            >
              <ScheduleStep
                selectedDate={selectedDate}
                onDateChange={handlers.onDateChange}
                selectedDateLabel={selectedDateLabel}
                slots={slots}
                isLoading={slotsQuery.isLoading}
                isError={slotsQuery.isError}
                selectedSlot={selectedSlot}
                onSlotSelect={handlers.onSlotSelect}
              />
            </Stepper.Step>

            <Stepper.Step label="Details" description="Guest info">
              <GuestDetailsStep
                form={form}
                selectedSlot={selectedSlot}
              />
            </Stepper.Step>

            <Stepper.Completed>
              <BookingCompletedStep
                createdBooking={createdBooking}
                onBookAnother={handlers.onBookAnother}
              />
            </Stepper.Completed>
          </Stepper>

          <BookingNavigation
            activeStep={activeStep}
            canContinueFromSchedule={canContinueFromSchedule}
            canSubmit={canSubmit}
            isPending={isCreatingBooking}
            onBack={handlers.onBack}
            onNextFromSchedule={handlers.onNextFromSchedule}
            onCreateBooking={handlers.onCreateBooking}
          />
        </Stack>
      </Card>
    </Stack>
  );
};
