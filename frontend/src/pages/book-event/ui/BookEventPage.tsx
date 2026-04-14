import { Button } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Link, useParams } from "react-router-dom";
import { usePublicEventTypes } from "@/entities/event-type/api/hooks";
import { useBookingFlow } from "@/features/book-event/model/useBookingFlow";
import {
  ErrorState,
  LoadingState,
} from "@/shared/ui/page-state/PageState";
import { BookEventPageDesktop } from "./BookEventPageDesktop";
import { BookEventPageMobile } from "./BookEventPageMobile";

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

  const bookingFlow = {
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
  };

  return isMobile ? (
    <BookEventPageMobile
      eventType={selectedEventType}
      bookingFlow={bookingFlow}
    />
  ) : (
    <BookEventPageDesktop
      eventType={selectedEventType}
      bookingFlow={bookingFlow}
    />
  );
};
