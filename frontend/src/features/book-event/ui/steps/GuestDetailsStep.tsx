import { Alert, Stack, Text, TextInput, Title } from "@mantine/core";
import { type UseFormReturnType } from "@mantine/form";
import type { Slot } from "@/shared/api/types";
import { formatDateTime, formatTime } from "@/shared/lib/format";

interface GuestDetailsStepProps {
  form: UseFormReturnType<{
    guestName: string;
    guestEmail: string;
  }>;
  selectedSlot: Slot | null;
}

export const GuestDetailsStep = ({ form, selectedSlot }: GuestDetailsStepProps) => (
  <Stack gap="lg" pt="xl">
    <div>
      <Title order={3}>Enter guest details</Title>
      <Text c="dimmed">This booking will be created without signing in.</Text>
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
        {formatDateTime(selectedSlot.startAt)} - {formatTime(selectedSlot.endAt)}
      </Alert>
    ) : (
      <Alert color="gray" title="No slot selected">
        Go back to the previous step and choose a slot first.
      </Alert>
    )}
  </Stack>
);
