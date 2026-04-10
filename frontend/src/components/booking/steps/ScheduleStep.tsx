import {
  Alert,
  Badge,
  Button,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import type { Slot } from "../../../api/types";
import { formatDateTime, formatTime } from "../../../utils/format";
import { ErrorState, LoadingState } from "../../common/PageState";

interface ScheduleStepProps {
  selectedDate: string | null;
  onDateChange: (value: string | null) => void;
  selectedDateLabel: string;
  slots: Slot[];
  isLoading: boolean;
  isError: boolean;
  selectedSlot: Slot | null;
  onSlotSelect: (slot: Slot) => void;
}

export const ScheduleStep = ({
  selectedDate,
  onDateChange,
  selectedDateLabel,
  slots,
  isLoading,
  isError,
  selectedSlot,
  onSlotSelect,
}: ScheduleStepProps) => (
  <Stack gap="lg" pt="xl">
    <div>
      <Title order={3}>Pick a day and time</Title>
      <Text c="dimmed">
        Choose a day on the calendar and then select one available slot in the
        schedule.
      </Text>
    </div>

    <Grid gap="lg" align="stretch">
      <Grid.Col span={{ base: 12, lg: 5 }}>
        <Paper
          withBorder
          radius="xl"
          p="md"
          className="booking-date-layout booking-schedule-panel"
        >
          <Stack gap="md">
            <DatePicker
              value={selectedDate}
              onChange={onDateChange}
              minDate={new Date()}
              size="md"
            />

            <Paper
              radius="lg"
              p="lg"
              className="booking-date-summary"
              withBorder
            >
              <Stack gap="md">
                <Group justify="space-between" align="flex-start" gap="sm">
                  <div>
                    <Text className="section-kicker">Selected day</Text>
                    <Title order={4}>{selectedDateLabel}</Title>
                  </div>

                  <Badge color={selectedDate ? "indigo" : "gray"} size="lg">
                    {selectedDate ? "Confirmed" : "Choose a day"}
                  </Badge>
                </Group>

                <Text c="dimmed" size="sm">
                  Times are shown for{" "}
                  {Intl.DateTimeFormat().resolvedOptions().timeZone}.
                </Text>

                <Alert
                  color={selectedDate ? "indigo" : "yellow"}
                  title={selectedDate ? "Schedule is ready" : "Date required"}
                >
                  {selectedDate
                    ? "Pick one available time from the list to continue."
                    : "Select a day on the calendar to load available time slots."}
                </Alert>
              </Stack>
            </Paper>
          </Stack>
        </Paper>
      </Grid.Col>

      <Grid.Col span={{ base: 12, lg: 7 }}>
        <Paper withBorder radius="xl" p="lg" className="booking-slot-panel booking-schedule-panel">
          <Stack gap="md">
            <Group justify="space-between" align="center" gap="sm">
              <div>
                <Text className="section-kicker">Schedule</Text>
                <Title order={4}>Available times</Title>
              </div>

              <Badge color={selectedSlot ? "teal" : "indigo"} size="lg">
                {isLoading ? "Updating" : `${slots.length} slots`}
              </Badge>
            </Group>

            <Text c="dimmed">
              Only available times can be selected for {selectedDateLabel}.
            </Text>

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
              <Grid gap="sm">
                {slots.map((slot) => (
                  <Grid.Col
                    key={`${slot.startAt}-${slot.endAt}`}
                    span={{ base: 12, xs: 6, md: 4 }}
                  >
                    <Button
                      fullWidth
                      className="slot-button"
                      variant={
                        selectedSlot?.startAt === slot.startAt
                          ? "filled"
                          : "light"
                      }
                      color={slot.isAvailable ? "indigo" : "gray"}
                      disabled={!slot.isAvailable}
                      onClick={() => onSlotSelect(slot)}
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
            ) : (
              <Alert color="gray" title="Select a time">
                Pick one available slot to continue to guest details.
              </Alert>
            )}
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  </Stack>
);
