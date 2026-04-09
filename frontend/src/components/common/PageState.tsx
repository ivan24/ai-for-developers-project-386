import { Alert, Center, Loader, Paper, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";

export const LoadingState = ({ label }: { label: string }) => (
  <Center py={80}>
    <Paper className="surface-card" p="xl" maw={420} w="100%">
      <Stack align="center" gap="md">
        <Loader color="indigo" />
        <Text c="dimmed" ta="center">
          {label}
        </Text>
      </Stack>
    </Paper>
  </Center>
);

export const ErrorState = ({
  message,
  action,
}: {
  message: string;
  action?: ReactNode;
}) => (
  <Alert color="red" title="Something went wrong">
    <Stack gap="sm">
      <Text>{message}</Text>
      {action}
    </Stack>
  </Alert>
);
