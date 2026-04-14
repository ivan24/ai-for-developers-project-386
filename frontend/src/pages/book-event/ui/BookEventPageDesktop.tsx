import { Card, Stack, Stepper } from "@mantine/core";
import { BookingHero } from "@/features/book-event/ui/BookingHero";
import { BookingNavigation } from "@/features/book-event/ui/BookingNavigation";
import { BookingCompletedStep } from "@/features/book-event/ui/steps/BookingCompletedStep";
import { GuestDetailsStep } from "@/features/book-event/ui/steps/GuestDetailsStep";
import { ScheduleStep } from "@/features/book-event/ui/steps/ScheduleStep";
import type { BookEventPageVariantProps } from "./bookEventPage.types";

export const BookEventPageDesktop = ({
  eventType,
  bookingFlow,
}: BookEventPageVariantProps) => {
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
  } = bookingFlow;

  return (
    <div className="booking-page-grid">
      <div className="booking-page-sidebar">
        <BookingHero
          eventType={eventType}
          selectedDateLabel={selectedDateLabel}
          selectedSlot={selectedSlot}
        />
      </div>

      <div className="booking-page-main">
        <Card
          className="surface-card booking-stepper booking-flow-card"
          p={{ base: "md", sm: "xl" }}
          radius="xl"
        >
          <Stack gap="xl">
            <Stepper
              active={activeStep}
              onStepClick={setActiveStep}
              allowNextStepsSelect={false}
              orientation="horizontal"
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
                  slots={slots}
                  isLoading={slotsQuery.isLoading}
                  isError={slotsQuery.isError}
                  selectedSlot={selectedSlot}
                  onSlotSelect={handlers.onSlotSelect}
                />
              </Stepper.Step>

              <Stepper.Step
                label="Details"
                description="Guest info"
              >
                <GuestDetailsStep form={form} selectedSlot={selectedSlot} />
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
      </div>
    </div>
  );
};
