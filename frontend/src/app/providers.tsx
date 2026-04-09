import {
  MantineProvider,
  createTheme,
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
  primaryColor: "amber",
  defaultRadius: "xl",
  fontFamily: "Avenir Next, Segoe UI, sans-serif",
  headings: {
    fontFamily: "Georgia, Times New Roman, serif",
  },
  colors: {
    amber: [
      "#fff6df",
      "#fce9b0",
      "#f9da7d",
      "#f7cc49",
      "#f5bf1d",
      "#dca508",
      "#ad8103",
      "#7e5d00",
      "#4f3900",
      "#241700",
    ],
  },
});

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <DatesProvider settings={{ firstDayOfWeek: 1 }}>
          <Notifications position="top-right" />
          {children}
        </DatesProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
};
