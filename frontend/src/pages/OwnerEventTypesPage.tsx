import {
  Badge,
  Button,
  Card,
  Group,
  Modal,
  NumberInput,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import {
  useCreateEventType,
  useOwnerEventTypes,
} from "../api/hooks";
import { ErrorState, LoadingState } from "../components/common/PageState";
import { formatDuration, getApiErrorMessage } from "../utils/format";

export const OwnerEventTypesPage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number | string>(30);
  const eventTypesQuery = useOwnerEventTypes();
  const createEventTypeMutation = useCreateEventType();

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
      close();
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Unable to create event type",
        message: getApiErrorMessage(error),
      });
    }
  };

  if (eventTypesQuery.isLoading) {
    return <LoadingState label="Loading owner event types..." />;
  }

  if (eventTypesQuery.isError) {
    return <ErrorState message="Owner event types are unavailable right now." />;
  }

  const eventTypes = eventTypesQuery.data ?? [];

  return (
    <Stack gap="xl">
      <Paper className="surface-card page-hero" p="xl">
        <Group justify="space-between" align="end">
          <div>
            <Text className="section-kicker">Owner dashboard</Text>
            <Title order={1}>Manage event types</Title>
            <Text c="dimmed" mt={6} maw={620}>
              Create bookable offerings with a name, duration, and optional
              description. The refreshed UI keeps this section closer to a product dashboard.
            </Text>
          </div>
          <Button onClick={open}>Add event type</Button>
        </Group>
      </Paper>

      <SimpleGrid cols={{ base: 1, md: 3 }}>
        <Card className="metric-card">
          <Text className="muted-label">Total</Text>
          <Text className="metric-value">{eventTypes.length}</Text>
          <Text c="dimmed" fz="sm">
            configured event types
          </Text>
        </Card>
        <Card className="metric-card">
          <Text className="muted-label">Default length</Text>
          <Text className="metric-value">30</Text>
          <Text c="dimmed" fz="sm">
            minutes for new entries
          </Text>
        </Card>
        <Card className="metric-card">
          <Text className="muted-label">Audience</Text>
          <Text className="metric-value">Guest</Text>
          <Text c="dimmed" fz="sm">
            visible on the public page
          </Text>
        </Card>
      </SimpleGrid>

      {eventTypes.length === 0 ? (
        <Paper className="surface-card empty-state" p="xl">
          <Stack gap="sm" align="center">
            <Title order={3}>No event types created</Title>
            <Text c="dimmed" maw={420}>
              Start with one simple meeting template so the guest side has something to book.
            </Text>
            <Button onClick={open}>Create first event type</Button>
          </Stack>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          {eventTypes.map((eventType) => (
            <Card key={eventType.id} className="surface-card">
              <Stack gap="md">
                <Group justify="space-between" align="start">
                  <Stack gap={4}>
                    <Text fw={700} size="xl">
                      {eventType.name}
                    </Text>
                    <Text c="dimmed">
                      {eventType.description || "No description provided yet."}
                    </Text>
                  </Stack>
                  <Badge color="indigo">
                    {formatDuration(eventType.durationMinutes)}
                  </Badge>
                </Group>
                <Text fz="sm" c="dimmed">
                  Event type ID: {eventType.id}
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <Modal
        opened={opened}
        onClose={close}
        title="Create event type"
      >
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
    </Stack>
  );
};
