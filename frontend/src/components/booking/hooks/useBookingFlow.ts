import { type DateValue } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useAvailableSlots, useCreateBooking } from "../../../api/hooks";
import type { GuestBooking, Slot } from "../../../api/types";
import { getApiErrorMessage } from "../../../utils/format";

interface UseBookingFlowProps {
  eventTypeId: string | undefined;
}

export const useBookingFlow = ({ eventTypeId }: UseBookingFlowProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<DateValue>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [createdBooking, setCreatedBooking] = useState<GuestBooking | null>(null);

  const slotsQuery = useAvailableSlots({
    eventTypeId,
    date: selectedDate ?? new Date(),
  });

  const createBookingMutation = useCreateBooking();

  const form = useForm({
    initialValues: {
      guestName: "",
      guestEmail: "",
    },
    validateInputOnBlur: true,
    validate: {
      guestName: (value) =>
        value.trim().length >= 2 ? null : "Enter at least 2 characters.",
      guestEmail: (value) =>
        /^\S+@\S+\.\S+$/.test(value.trim()) ? null : "Enter a valid email.",
    },
  });

  const selectedDateLabel = selectedDate instanceof Date
    ? selectedDate.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "Not selected yet";

  const canContinueFromSlot = Boolean(selectedSlot);
  const canSubmit =
    canContinueFromSlot &&
    form.values.guestName.trim().length >= 2 &&
    /^\S+@\S+\.\S+$/.test(form.values.guestEmail.trim());

  const handleDateChange = (value: DateValue) => {
    setSelectedDate(value);
    setSelectedSlot(null);
    setCreatedBooking(null);

    if (activeStep > 1) {
      setActiveStep(1);
    }
  };

  const handleSlotSelect = (slot: Slot) => {
    if (!slot.isAvailable) {
      return;
    }

    setSelectedSlot(slot);
    setCreatedBooking(null);
  };

  const handleNextFromDate = () => {
    if (!selectedDate) {
      notifications.show({
        color: "red",
        title: "Pick a date",
        message: "Choose a day before moving to slot selection.",
      });

      return;
    }

    setActiveStep(1);
  };

  const handleNextFromSlot = () => {
    if (!selectedSlot) {
      notifications.show({
        color: "red",
        title: "Select a slot",
        message: "Choose one available time before entering guest details.",
      });

      return;
    }

    setActiveStep(2);
  };

  const handleCreateBooking = async () => {
    const validation = form.validate();

    if (!selectedSlot || !eventTypeId || validation.hasErrors) {
      notifications.show({
        color: "red",
        title: "Incomplete booking form",
        message: "Pick a slot and fill in your name and email.",
      });

      return;
    }

    try {
      const response = await createBookingMutation.mutateAsync({
        eventTypeId,
        startAt: selectedSlot.startAt,
        guestName: form.values.guestName.trim(),
        guestEmail: form.values.guestEmail.trim(),
      });
      setCreatedBooking(response.booking);
      setActiveStep(3);

      notifications.show({
        color: "teal",
        title: "Booking created",
        message: `Guest token: ${response.booking.guestCancelToken}`,
        autoClose: 7000,
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Unable to create booking",
        message: getApiErrorMessage(error),
      });
    }
  };

  const handleBack = () => {
    setActiveStep((current) => Math.max(current - 1, 0));
  };

  const handleBookAnother = () => {
    setCreatedBooking(null);
    setSelectedSlot(null);
    setActiveStep(1);
  };

  return {
    activeStep,
    setActiveStep,
    selectedDate,
    selectedSlot,
    createdBooking,
    slots: slotsQuery.data?.items ?? [],
    slotsQuery,
    form,
    selectedDateLabel,
    canContinueFromSlot,
    canSubmit,
    isCreatingBooking: createBookingMutation.isPending,
    handlers: {
      onDateChange: handleDateChange,
      onSlotSelect: handleSlotSelect,
      onNextFromDate: handleNextFromDate,
      onNextFromSlot: handleNextFromSlot,
      onCreateBooking: handleCreateBooking,
      onBack: handleBack,
      onBookAnother: handleBookAnother,
    },
  };
};
