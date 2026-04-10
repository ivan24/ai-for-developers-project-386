import { Button, Card, Grid, Stack, Stepper } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Link, useParams } from "react-router-dom";
import { usePublicEventTypes } from "../api/hooks";
import { ErrorState, LoadingState } from "../components/common/PageState";

// UI Components
import { BookingHero } from "../components/booking/BookingHero";
import { BookingNavigation } from "../components/booking/BookingNavigation";
import { BookingSidebar } from "../components/booking/BookingSidebar";

// Steps
import { BookingCompletedStep } from "../components/booking/steps/BookingCompletedStep";
import { DateSelectionStep } from "../components/booking/steps/DateSelectionStep";
import { GuestDetailsStep } from "../components/booking/steps/GuestDetailsStep";
import { SlotSelectionStep } from "../components/booking/steps/SlotSelectionStep";

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
    canContinueFromSlot,
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

      <Grid gap="xl" align="start">
        <Grid.Col span={{ base: 12, xl: 8 }}>
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
                  label="Date"
                  description="Pick a day"
                  loading={activeStep === 0 && slotsQuery.isFetching}
                >
                  <DateSelectionStep
                    selectedDate={selectedDate}
                    onDateChange={handlers.onDateChange}
                    selectedDateLabel={selectedDateLabel}
                  />
                </Stepper.Step>

                <Stepper.Step label="Slot" description="Choose time">
                  <SlotSelectionStep
                    slots={slots}
                    isLoading={slotsQuery.isLoading}
                    isError={slotsQuery.isError}
                    selectedSlot={selectedSlot}
                    selectedDateLabel={selectedDateLabel}
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
                canContinueFromSlot={canContinueFromSlot}
                canSubmit={canSubmit}
                isPending={isCreatingBooking}
                onBack={handlers.onBack}
                onNextFromDate={handlers.onNextFromDate}
                onNextFromSlot={handlers.onNextFromSlot}
                onCreateBooking={handlers.onCreateBooking}
              />
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, xl: 4 }}>
          <BookingSidebar
            eventType={selectedEventType}
            selectedDateLabel={selectedDateLabel}
            selectedSlot={selectedSlot}
            createdBooking={createdBooking}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
