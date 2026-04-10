import { Alert, Button, Grid, Stack, Text, Title } from "@mantine/core";
import type { Slot } from "../../../api/types";
import { formatDateTime, formatTime } from "../../../utils/format";
import { ErrorState, LoadingState } from "../../common/PageState";

interface SlotSelectionStepProps {
  slots: Slot[];
  isLoading: boolean;
  isError: boolean;
  selectedSlot: Slot | null;
  selectedDateLabel: string;
  onSlotSelect: (slot: Slot) => void;
}

export const SlotSelectionStep = ({
  slots,
  isLoading,
  isError,
  selectedSlot,
  selectedDateLabel,
  onSlotSelect,
}: SlotSelectionStepProps) => (
  <Stack gap="lg" pt="xl">
    <div>
      <Title order={3}>Choose an available slot</Title>
      <Text c="dimmed">
        Only available times can be selected for {selectedDateLabel}.
      </Text>
    </div>

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
          <Grid.Col key={`${slot.startAt}-${slot.endAt}`} span={{ base: 12, xs: 6, md: 4 }}>
            <Button
              fullWidth
              className="slot-button"
              variant={
                selectedSlot?.startAt === slot.startAt ? "filled" : "light"
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
    ) : null}
  </Stack>
);
