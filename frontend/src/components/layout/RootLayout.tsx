import {
  AppShell,
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
  { to: "/", label: "Guest" },
  { to: "/owner/event-types", label: "Owner event types" },
  { to: "/owner/bookings", label: "Owner bookings" },
];

export const RootLayout = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 88 }}
      navbar={{
        width: 280,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="lg"
    >
      <AppShell.Header className="shell-header">
        <Container size="xl" h="100%">
          <Group justify="space-between" h="100%">
            <Stack gap={2}>
              <Text className="brand-kicker">Calendar booking sandbox</Text>
              <Title order={2} className="brand-title">
                Book a Call
              </Title>
            </Stack>
            <Group visibleFrom="sm">
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  variant={location.pathname === item.to ? "filled" : "light"}
                  radius="xl"
                >
                  {item.label}
                </Button>
              ))}
            </Group>
            <Button hiddenFrom="sm" variant="light" radius="xl" onClick={toggle}>
              Menu
            </Button>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar p="md" className="shell-navbar">
        <Stack>
          {navItems.map((item) => (
            <Button
              key={item.to}
              component={NavLink}
              to={item.to}
              variant={location.pathname === item.to ? "filled" : "subtle"}
              radius="xl"
              justify="flex-start"
              onClick={toggle}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="xl">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};
