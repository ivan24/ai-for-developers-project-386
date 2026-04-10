import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAvailableSlots } from "@/entities/booking/api/hooks";
import { api } from "@/shared/api/client";
import type { GuestBooking, Slot } from "@/shared/api/types";
import {
  formatSelectedDate,
  getApiErrorMessage,
  getTodayDateValue,
} from "@/shared/lib/format";

interface UseBookingFlowProps {
  eventTypeId: string | undefined;
}

export const useBookingFlow = ({ eventTypeId }: UseBookingFlowProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    getTodayDateValue(),
  );
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [createdBooking, setCreatedBooking] = useState<GuestBooking | null>(null);

  const slotsQuery = useAvailableSlots({
    eventTypeId,
    date: selectedDate ?? getTodayDateValue(),
  });

  const createBookingMutation = useMutation({
    mutationFn: api.createBooking,
  });

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

  const selectedDateLabel = formatSelectedDate(selectedDate);

  const canContinueFromSchedule = Boolean(selectedSlot);
  const canSubmit =
    canContinueFromSchedule &&
    form.values.guestName.trim().length >= 2 &&
    /^\S+@\S+\.\S+$/.test(form.values.guestEmail.trim());

  const handleDateChange = (value: string | null) => {
    setSelectedDate(value);
    setSelectedSlot(null);
    setCreatedBooking(null);

    if (activeStep > 0) {
      setActiveStep(0);
    }
  };

  const handleSlotSelect = (slot: Slot) => {
    if (!slot.isAvailable) {
      return;
    }

    setSelectedSlot(slot);
    setCreatedBooking(null);
  };

  const handleNextFromSchedule = () => {
    if (!selectedSlot) {
      notifications.show({
        color: "red",
        title: "Select a slot",
        message: "Choose one available time before entering guest details.",
      });

      return;
    }

    setActiveStep(1);
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
      setActiveStep(2);

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
    setActiveStep(0);
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
    canContinueFromSchedule,
    canSubmit,
    isCreatingBooking: createBookingMutation.isPending,
    handlers: {
      onDateChange: handleDateChange,
      onSlotSelect: handleSlotSelect,
      onNextFromSchedule: handleNextFromSchedule,
      onCreateBooking: handleCreateBooking,
      onBack: handleBack,
      onBookAnother: handleBookAnother,
    },
  };
};
