import { Alert, Stack, Text, Title } from "@mantine/core";
import { DatePicker, type DateValue } from "@mantine/dates";

interface DateSelectionStepProps {
  selectedDate: DateValue;
  onDateChange: (value: DateValue) => void;
  selectedDateLabel: string;
}

export const DateSelectionStep = ({
  selectedDate,
  onDateChange,
  selectedDateLabel,
}: DateSelectionStepProps) => (
  <Stack gap="lg" pt="xl">
    <div>
      <Title order={3}>Choose the day for your booking</Title>
      <Text c="dimmed">
        Available time slots will refresh for the selected date.
      </Text>
    </div>

    <DatePicker
      value={selectedDate}
      onChange={onDateChange}
      minDate={new Date()}
      size="md"
    />

    <Alert color="indigo" title="Selected day">
      {selectedDateLabel}
    </Alert>
  </Stack>
);
