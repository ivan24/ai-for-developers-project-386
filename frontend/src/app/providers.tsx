import {
  Alert,
  Badge,
  Button,
  Card,
  MantineProvider,
  Modal,
  NumberInput,
  Paper,
  TextInput,
  Textarea,
  createTheme,
  v8CssVariablesResolver,
} from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const theme = createTheme({
  primaryColor: "indigo",
  defaultRadius: "lg",
  fontFamily: "Manrope, Avenir Next, Segoe UI, sans-serif",
  headings: {
    fontFamily: "Manrope, Avenir Next, Segoe UI, sans-serif",
  },
  components: {
    Alert: Alert.extend({
      defaultProps: {
        radius: "lg",
        variant: "light",
      },
    }),
    Badge: Badge.extend({
      defaultProps: {
        radius: "sm",
        variant: "light",
      },
    }),
    Button: Button.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    Card: Card.extend({
      defaultProps: {
        radius: "xl",
        padding: "xl",
      },
    }),
    Modal: Modal.extend({
      defaultProps: {
        centered: true,
        radius: "xl",
      },
    }),
    NumberInput: NumberInput.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        radius: "xl",
      },
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    Textarea: Textarea.extend({
      defaultProps: {
        radius: "md",
      },
    }),
  },
});

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        theme={theme}
        defaultColorScheme="light"
        cssVariablesResolver={v8CssVariablesResolver}
      >
        <DatesProvider settings={{ firstDayOfWeek: 1 }}>
          <Notifications position="top-right" pauseResetOnHover="notification" />
          {children}
        </DatesProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
};
