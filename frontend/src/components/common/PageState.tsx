import { Alert, Center, Loader, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";

export const LoadingState = ({ label }: { label: string }) => (
  <Center py={80}>
    <Stack align="center" gap="md">
      <Loader color="amber" />
      <Text c="dimmed">{label}</Text>
    </Stack>
  </Center>
);

export const ErrorState = ({
  message,
  action,
}: {
  message: string;
  action?: ReactNode;
}) => (
  <Alert color="red" radius="xl" title="Something went wrong">
    <Stack gap="sm">
      <Text>{message}</Text>
      {action}
    </Stack>
  </Alert>
);
