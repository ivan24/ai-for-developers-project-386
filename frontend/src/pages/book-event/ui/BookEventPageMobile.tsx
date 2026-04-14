import { Card, Stack } from "@mantine/core";
import { BookingProgressCompact } from "@/features/book-event/ui/BookingProgressCompact";
import { MobileBookingFooter } from "@/features/book-event/ui/MobileBookingFooter";
import { MobileBookingHeader } from "@/features/book-event/ui/MobileBookingHeader";
import { BookingCompletedStep } from "@/features/book-event/ui/steps/BookingCompletedStep";
import { GuestDetailsStep } from "@/features/book-event/ui/steps/GuestDetailsStep";
import { ScheduleStep } from "@/features/book-event/ui/steps/ScheduleStep";
import type { BookEventPageVariantProps } from "./bookEventPage.types";

export const BookEventPageMobile = ({
  eventType,
  bookingFlow,
}: BookEventPageVariantProps) => {
  const {
    activeStep,
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
    <div className="booking-page-mobile">
      {activeStep < 2 ? (
        <>
          <MobileBookingHeader eventType={eventType} />

          <Card
            className="surface-card booking-flow-card booking-flow-card-mobile"
            p="md"
            radius="xl"
          >
            {activeStep === 0 ? (
              <ScheduleStep
                activeStep={activeStep}
                selectedDate={selectedDate}
                onDateChange={handlers.onDateChange}
                slots={slots}
                isLoading={slotsQuery.isLoading}
                isError={slotsQuery.isError}
                selectedSlot={selectedSlot}
                onSlotSelect={handlers.onSlotSelect}
              />
            ) : (
              <Stack gap="sm">
                <BookingProgressCompact
                  activeStep={activeStep}
                  totalSteps={2}
                  embedded
                  minimal
                />
                <GuestDetailsStep
                  form={form}
                  selectedSlot={selectedSlot}
                  withTopSpacing={false}
                />
              </Stack>
            )}
          </Card>

          <MobileBookingFooter
            activeStep={activeStep}
            durationMinutes={eventType.durationMinutes}
            selectedDateLabel={selectedDateLabel}
            selectedSlot={selectedSlot}
            canContinueFromSchedule={canContinueFromSchedule}
            canSubmit={canSubmit}
            isPending={isCreatingBooking}
            onBack={handlers.onBack}
            onNextFromSchedule={handlers.onNextFromSchedule}
            onCreateBooking={handlers.onCreateBooking}
          />
        </>
      ) : (
        <Card
          className="surface-card booking-flow-card booking-flow-card-mobile"
          p="md"
          radius="xl"
        >
          <BookingCompletedStep
            createdBooking={createdBooking}
            onBookAnother={handlers.onBookAnother}
          />
        </Card>
      )}
    </div>
  );
};
