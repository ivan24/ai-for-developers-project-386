import {
  Badge,
  Button,
  Card,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { usePublicEventTypes } from "@/entities/event-type/api/hooks";
import { formatDuration } from "@/shared/lib/format";
import {
  ErrorState,
  LoadingState,
} from "@/shared/ui/page-state/PageState";

export const HomePage = () => {
  const eventTypesQuery = usePublicEventTypes();

  if (eventTypesQuery.isLoading) {
    return <LoadingState label="Loading public event types..." />;
  }

  if (eventTypesQuery.isError) {
    return <ErrorState message="Public event types are unavailable right now." />;
  }

  const eventTypes = eventTypesQuery.data ?? [];

  return (
    <Stack gap="xl">
      {eventTypes.length === 0 ? (
        <Paper className="surface-card empty-state" p="xl">
          <Stack gap="sm" align="center">
            <Title order={3}>No public event types yet</Title>
            <Text c="dimmed" maw={420}>
              Add an event type in the owner section and it will immediately
              appear here for guests.
            </Text>
            <Button component={Link} to="/dashboard/event-types" variant="light">
              Go to owner event types
            </Button>
          </Stack>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }}>
          {eventTypes.map((eventType) => (
            <Card key={eventType.id} className="surface-card">
              <Stack gap="lg" h="100%">
                <Group justify="space-between" align="start">
                  <Badge color="indigo">Public event</Badge>
                  <Badge color="gray">
                    {formatDuration(eventType.durationMinutes)}
                  </Badge>
                </Group>

                <Stack gap="xs">
                  <Text fw={700} size="xl">
                    {eventType.name}
                  </Text>
                  <Text c="dimmed">
                    {eventType.description || "No description provided yet."}
                  </Text>
                </Stack>

                <Group justify="space-between" mt="auto">
                  <Text c="dimmed" fz="sm">
                    Booking opens instantly
                  </Text>
                  <Button component={Link} to={`/book/${eventType.id}`}>
                    Book slot
                  </Button>
                </Group>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
};
