import {
  Button,
  Modal,
  NumberInput,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { eventTypeQueryKeys } from "@/entities/event-type/api/hooks";
import { api } from "@/shared/api/client";
import { getApiErrorMessage } from "@/shared/lib/format";

interface CreateEventTypeModalProps {
  opened: boolean;
  onClose: () => void;
}

export const CreateEventTypeModal = ({
  opened,
  onClose,
}: CreateEventTypeModalProps) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number | string>(30);

  const createEventTypeMutation = useMutation({
    mutationFn: api.createEventType,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: eventTypeQueryKeys.ownerList }),
        queryClient.invalidateQueries({ queryKey: eventTypeQueryKeys.publicList }),
      ]);
    },
  });

  const handleClose = () => {
    onClose();
  };

  const handleCreate = async () => {
    if (!name.trim() || typeof durationMinutes !== "number") {
      notifications.show({
        color: "red",
        title: "Validation error",
        message: "Name and duration are required.",
      });

      return;
    }

    try {
      await createEventTypeMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        durationMinutes,
      });

      notifications.show({
        color: "teal",
        title: "Event type created",
        message: "The new event type is available in owner and guest views.",
      });

      setName("");
      setDescription("");
      setDurationMinutes(30);
      handleClose();
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Unable to create event type",
        message: getApiErrorMessage(error),
      });
    }
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Create event type">
      <Stack>
        <TextInput
          label="Name"
          placeholder="Intro call"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
        />
        <Textarea
          label="Description"
          placeholder="What this call is for"
          minRows={3}
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
        />
        <NumberInput
          label="Duration in minutes"
          min={1}
          value={durationMinutes}
          onChange={setDurationMinutes}
        />
        <Button
          loading={createEventTypeMutation.isPending}
          onClick={handleCreate}
        >
          Save event type
        </Button>
      </Stack>
    </Modal>
  );
};
