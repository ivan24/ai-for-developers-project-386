import { Alert, Stack, TextInput, Title } from "@mantine/core";
import { type UseFormReturnType } from "@mantine/form";
import type { Slot } from "@/shared/api/types";

interface GuestDetailsStepProps {
  form: UseFormReturnType<{
    guestName: string;
    guestEmail: string;
  }>;
  selectedSlot: Slot | null;
  withTopSpacing?: boolean;
}

export const GuestDetailsStep = ({
  form,
  selectedSlot,
  withTopSpacing = true,
}: GuestDetailsStepProps) => (
  <Stack gap="lg" pt={withTopSpacing ? "md" : 0}>
    <div>
      <Title order={3}>Guest details</Title>
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

    {!selectedSlot ? (
      <Alert color="gray" title="No slot selected">
        Go back to the previous step and choose a slot first.
      </Alert>
    ) : null}
  </Stack>
);
