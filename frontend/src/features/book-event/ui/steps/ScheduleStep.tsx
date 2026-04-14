import { Alert, Button, Group, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import { BookingProgressCompact } from "@/features/book-event/ui/BookingProgressCompact";
import type { Slot } from "@/shared/api/types";
import { formatTime } from "@/shared/lib/format";
import {
  ErrorState,
  LoadingState,
} from "@/shared/ui/page-state/PageState";

interface ScheduleStepProps {
  activeStep?: number;
  selectedDate: string | null;
  onDateChange: (value: string | null) => void;
  slots: Slot[];
  isLoading: boolean;
  isError: boolean;
  selectedSlot: Slot | null;
  onSlotSelect: (slot: Slot) => void;
}

export const ScheduleStep = ({
  activeStep = 0,
  selectedDate,
  onDateChange,
  slots,
  isLoading,
  isError,
  selectedSlot,
  onSlotSelect,
}: ScheduleStepProps) => {
  const isTablet = useMediaQuery("(max-width: 48em)");
  const isPhone = useMediaQuery("(max-width: 30em)");

  return (
    <Stack gap="lg" pt={isTablet ? 0 : "md"}>
      {!isTablet ? (
        <div>
          <Title order={3}>Choose a slot</Title>
          <Text c="dimmed">
            Start with a day. Matching time slots will appear right below the
            calendar.
          </Text>
        </div>
      ) : null}

      <Paper
        radius="xl"
        className="booking-date-layout booking-schedule-panel"
      >
        <Stack gap="lg">
          {isTablet ? (
            <BookingProgressCompact
              activeStep={activeStep}
              totalSteps={2}
              title="Choose the date"
              embedded
            />
          ) : null}

          {!isTablet ? (
            <>
              <Group
                justify="space-between"
                align="flex-start"
                gap="sm"
                className="booking-schedule-header"
              >
                <div>
                  <Text className="section-kicker">Schedule</Text>
                  <Title order={isTablet ? 5 : 4}>Choose the date</Title>
                </div>
              </Group>

              <Text c="dimmed">Pick the day you want to book.</Text>
            </>
          ) : null}

          <div className="booking-calendar-shell">
            <DatePicker
              value={selectedDate}
              onChange={onDateChange}
              minDate={new Date()}
              size={isPhone ? "sm" : isTablet ? "md" : "xl"}
            />
          </div>
        </Stack>
      </Paper>

      <Paper
        radius="xl"
        className="booking-slot-panel booking-schedule-panel"
      >
        <Stack gap="md">
          <Group
            justify="space-between"
            align="flex-start"
            gap="sm"
            className="booking-schedule-header"
          >
            <div>
              {!isTablet ? <Text className="section-kicker">Available times</Text> : null}
              <Title order={isTablet ? 5 : 4}>Choose the time</Title>
            </div>
          </Group>

          {!isTablet ? (
            <Text c="dimmed">
              Select one available time to continue to guest details.
            </Text>
          ) : null}

          {isLoading ? <LoadingState label="Loading slots..." /> : null}
          {isError ? (
            <ErrorState message="Slots are unavailable for the selected date." />
          ) : null}
          {!isLoading && !isError && slots.length === 0 ? (
            <Alert color="yellow" title="No slots available">
              There are no free slots for this day. Pick another date.
            </Alert>
          ) : null}
          {!isLoading && !isError && slots.length > 0 ? (
            <SimpleGrid
              cols={{ base: 2, sm: 3, lg: 4 }}
              spacing={isTablet ? "xs" : "sm"}
            >
              {slots.map((slot) => (
                <Button
                  key={`${slot.startAt}-${slot.endAt}`}
                  data-testid={`slot-button-${slot.startAt}`}
                  fullWidth
                  className="slot-button"
                  variant={selectedSlot?.startAt === slot.startAt ? "filled" : "light"}
                  color={slot.isAvailable ? "indigo" : "gray"}
                  disabled={!slot.isAvailable}
                  onClick={() => onSlotSelect(slot)}
                >
                  {formatTime(slot.startAt)}
                </Button>
              ))}
            </SimpleGrid>
          ) : null}

        </Stack>
      </Paper>
    </Stack>
  );
};
