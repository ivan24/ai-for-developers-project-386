import {
  Badge,
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { usePublicEventTypes } from "../api/hooks";
import { ErrorState, LoadingState } from "../components/common/PageState";
import { formatDuration } from "../utils/format";

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
    <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }}>
      {eventTypes.map((eventType) => (
        <Card key={eventType.id} className="surface-card" padding="xl" radius="xl">
          <Stack gap="lg" h="100%">
            <Stack gap="xs">
              <Text fw={700} size="xl">
                {eventType.name}
              </Text>
              <Text c="dimmed">
                {eventType.description || "No description provided yet."}
              </Text>
            </Stack>
            <Group justify="space-between" mt="auto">
              <Badge variant="outline" color="dark" radius="xl">
                {formatDuration(eventType.durationMinutes)}
              </Badge>
              <Button
                component={Link}
                to={`/book/${eventType.id}`}
                radius="xl"
                color="dark"
              >
                Book slot
              </Button>
            </Group>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
};
