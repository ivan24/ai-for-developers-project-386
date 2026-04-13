import {
  AppShell,
  Burger,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const navItems = [
  {
    to: "/",
    label: "Book",
    match: (pathname: string) => pathname === "/" || pathname.startsWith("/book/"),
  },
  {
    to: "/dashboard/event-types",
    label: "Event types",
    match: (pathname: string) => pathname === "/dashboard/event-types",
  },
  {
    to: "/dashboard/bookings",
    label: "Bookings",
    match: (pathname: string) => pathname === "/dashboard/bookings",
  },
];

export const RootLayout = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 80 }}
      navbar={{
        width: 260,
        breakpoint: "md",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="lg"
    >
      <AppShell.Header className="shell-header">
        <Container size="xl" h="100%">
          <Group justify="space-between" h="100%">
            <Stack gap={2}>
              <Text className="brand-kicker">Scheduling demo</Text>
              <Title order={2} className="brand-title">
                Book a Call
              </Title>
            </Stack>
            <Group visibleFrom="md">
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  variant={item.match(location.pathname) ? "filled" : "subtle"}
                >
                  {item.label}
                </Button>
              ))}
            </Group>
            <Burger
              hiddenFrom="md"
              opened={opened}
              onClick={toggle}
              aria-label="Toggle navigation"
            />
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar p="md" className="shell-navbar">
        <Stack gap="xl">
          <Stack gap={2}>
            <Text className="brand-kicker">Navigate</Text>
            <Text fw={700}>Choose a workflow</Text>
          </Stack>
          {navItems.map((item) => (
            <Button
              key={item.to}
              component={NavLink}
              to={item.to}
              variant={item.match(location.pathname) ? "filled" : "subtle"}
              justify="flex-start"
              onClick={toggle}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="xl" className="page-shell">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};
