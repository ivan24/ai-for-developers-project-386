import {
  Alert,
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Paper,
  Stack,
  Stepper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePicker, type DateValue } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useAvailableSlots,
  useCreateBooking,
  usePublicEventTypes,
} from "../api/hooks";
import type { GuestBooking, Slot } from "../api/types";
import { ErrorState, LoadingState } from "../components/common/PageState";
import {
  formatDateTime,
  formatDuration,
  formatTime,
  getApiErrorMessage,
} from "../utils/format";

export const BookEventPage = () => {
  const { eventTypeId } = useParams();
  const isMobile = useMediaQuery("(max-width: 48em)");
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<DateValue>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [createdBooking, setCreatedBooking] = useState<GuestBooking | null>(null);
  const eventTypesQuery = usePublicEventTypes();
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

  const selectedEventType = (eventTypesQuery.data ?? []).find(
    (item) => item.id === eventTypeId,
  );

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

  const slots = slotsQuery.data?.items ?? [];

  return (
    <Stack gap="xl">
      <Paper className="surface-card page-hero" p="xl">
        <Stack gap="md">
          <Group justify="space-between" align="start">
            <div>
              <Text className="section-kicker">Guest booking</Text>
              <Title order={1}>{selectedEventType.name}</Title>
            </div>
            <Badge color="indigo" size="lg">
              {formatDuration(selectedEventType.durationMinutes)}
            </Badge>
          </Group>
          <Text c="dimmed">
            {selectedEventType.description || "No description provided yet."}
          </Text>
          <Text c="dimmed" fz="sm">
            Pick a date, choose an available slot, and confirm the booking without extra UI noise.
          </Text>
        </Stack>
      </Paper>

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
                styles={{
                  separator: {
                    marginInline: 12,
                  },
                }}
              >
                <Stepper.Step
                  label="Date"
                  description="Pick a day"
                  loading={activeStep === 0 && slotsQuery.isFetching}
                >
                  <Stack gap="lg" pt="xl">
                    <div>
                      <Title order={3}>Choose the day for your booking</Title>
                      <Text c="dimmed">
                        Available time slots will refresh for the selected date.
                      </Text>
                    </div>

                    <DatePicker
                      value={selectedDate}
                      onChange={handleDateChange}
                      minDate={new Date()}
                      size="md"
                    />

                    <Alert color="indigo" title="Selected day">
                      {selectedDateLabel}
                    </Alert>
                  </Stack>
                </Stepper.Step>

                <Stepper.Step label="Slot" description="Choose time">
                  <Stack gap="lg" pt="xl">
                    <div>
                      <Title order={3}>Choose an available slot</Title>
                      <Text c="dimmed">
                        Only available times can be selected for {selectedDateLabel}.
                      </Text>
                    </div>

                    {slotsQuery.isLoading ? <LoadingState label="Loading slots..." /> : null}
                    {slotsQuery.isError ? (
                      <ErrorState message="Slots are unavailable for the selected date." />
                    ) : null}
                    {!slotsQuery.isLoading && !slotsQuery.isError && slots.length === 0 ? (
                      <Alert color="yellow" title="No slots available">
                        There are no free slots for this day. Pick another date.
                      </Alert>
                    ) : null}
                    {!slotsQuery.isLoading &&
                    !slotsQuery.isError &&
                    slots.length > 0 ? (
                      <Grid gap="sm">
                        {slots.map((slot) => (
                          <Grid.Col key={`${slot.startAt}-${slot.endAt}`} span={{ base: 12, xs: 6, md: 4 }}>
                            <Button
                              fullWidth
                              className="slot-button"
                              variant={
                                selectedSlot?.startAt === slot.startAt ? "filled" : "light"
                              }
                              color={slot.isAvailable ? "indigo" : "gray"}
                              disabled={!slot.isAvailable}
                              onClick={() => handleSlotSelect(slot)}
                            >
                              {formatTime(slot.startAt)}
                            </Button>
                          </Grid.Col>
                        ))}
                      </Grid>
                    ) : null}

                    {selectedSlot ? (
                      <Alert color="teal" title="Selected slot">
                        {formatDateTime(selectedSlot.startAt)} -{" "}
                        {formatTime(selectedSlot.endAt)}
                      </Alert>
                    ) : null}
                  </Stack>
                </Stepper.Step>

                <Stepper.Step label="Details" description="Guest info">
                  <Stack gap="lg" pt="xl">
                    <div>
                      <Title order={3}>Enter guest details</Title>
                      <Text c="dimmed">
                        This booking will be created without signing in.
                      </Text>
                    </div>

                    <TextInput
                      label="Guest name"
                      placeholder="Ada Lovelace"
                      {...form.getInputProps("guestName")}
                    />
                    <TextInput
                      label="Guest email"
                      type="email"
                      placeholder="ada@example.com"
                      {...form.getInputProps("guestEmail")}
                    />

                    {selectedSlot ? (
                      <Alert color="indigo" title="Booking summary">
                        {formatDateTime(selectedSlot.startAt)} -{" "}
                        {formatTime(selectedSlot.endAt)}
                      </Alert>
                    ) : (
                      <Alert color="gray" title="No slot selected">
                        Go back to the previous step and choose a slot first.
                      </Alert>
                    )}
                  </Stack>
                </Stepper.Step>

                <Stepper.Completed>
                  <Stack gap="lg" pt="xl">
                    <Alert color="teal" title="Booking confirmed">
                      {createdBooking ? (
                        <>
                          {createdBooking.guestName}, your booking is set for{" "}
                          {formatDateTime(createdBooking.startAt)}. Guest token:{" "}
                          {createdBooking.guestCancelToken}
                        </>
                      ) : (
                        "The booking was created successfully."
                      )}
                    </Alert>

                    <Group>
                      <Button
                        onClick={() => {
                          setCreatedBooking(null);
                          setSelectedSlot(null);
                          setActiveStep(1);
                        }}
                      >
                        Book another slot
                      </Button>
                      <Button
                        component={Link}
                        to="/"
                        variant="light"
                      >
                        Back to event types
                      </Button>
                    </Group>
                  </Stack>
                </Stepper.Completed>
              </Stepper>

              {activeStep < 3 ? (
                <Group justify="space-between">
                  <Button
                    variant="default"
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep((current) => Math.max(current - 1, 0))}
                  >
                    Back
                  </Button>

                  {activeStep === 0 ? (
                    <Button onClick={handleNextFromDate}>
                      Continue to slots
                    </Button>
                  ) : null}
                  {activeStep === 1 ? (
                    <Button
                      disabled={!canContinueFromSlot}
                      onClick={handleNextFromSlot}
                    >
                      Continue to details
                    </Button>
                  ) : null}
                  {activeStep === 2 ? (
                    <Button
                      loading={createBookingMutation.isPending}
                      disabled={!canSubmit}
                      onClick={handleCreateBooking}
                    >
                      Create booking
                    </Button>
                  ) : null}
                </Group>
              ) : null}
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, xl: 4 }}>
          <Card className="surface-card booking-summary-card">
            <Stack gap="lg">
              <div>
                <Text className="section-kicker">Booking progress</Text>
                <Title order={3}>Your selection</Title>
              </div>

              <Stack gap="xs">
                <Text fw={700}>Event type</Text>
                <Text c="dimmed">{selectedEventType.name}</Text>
              </Stack>

              <Group justify="space-between">
                <Text fw={700}>Duration</Text>
                <Badge color="indigo">
                  {formatDuration(selectedEventType.durationMinutes)}
                </Badge>
              </Group>

              <Stack gap="xs">
                <Text fw={700}>Date</Text>
                <Text c="dimmed">{selectedDateLabel}</Text>
              </Stack>

              <Stack gap="xs">
                <Text fw={700}>Time</Text>
                <Text c="dimmed">
                  {selectedSlot
                    ? `${formatTime(selectedSlot.startAt)} - ${formatTime(selectedSlot.endAt)}`
                    : "Not selected yet"}
                </Text>
              </Stack>

              <Alert
                color={createdBooking ? "teal" : selectedSlot ? "indigo" : "gray"}
                title={createdBooking ? "Ready" : selectedSlot ? "Almost there" : "Next step"}
              >
                {createdBooking
                  ? "Booking created successfully."
                  : selectedSlot
                    ? "Enter guest details and confirm the booking."
                    : "Choose a date and then select one of the available slots."}
              </Alert>

              <Button component={Link} to="/" variant="subtle">
                Back to event types
              </Button>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
