import { NavLink, Outlet } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

const navItems = [
  { to: "/", label: "Guest flow" },
  { to: "/owner", label: "Owner flow" },
];

export function RootLayout() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden bg-primary text-primary-foreground">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_38%)]" />
          <div className="relative space-y-5">
            <Badge className="bg-white/16 text-primary-foreground">Calendar booking</Badge>
            <div className="space-y-3">
              <h1 className="max-w-xl font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
                Contract-first booking UI for guest and owner flows.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-primary-foreground/80 sm:text-base">
                One SPA, no auth, clear route groups, and a mock API wired through Prism.
              </p>
            </div>
          </div>
        </Card>
        <Card className="flex flex-col justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Route groups
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-full px-4 py-2.5 text-sm font-semibold transition",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/15"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                    )
                  }
                  end={item.to === "/"}
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="rounded-[24px] border border-border bg-white/65 p-4 text-sm text-muted-foreground">
            Public routes handle discovery, slots, checkout, and guest self-service. Owner routes expose event type management and upcoming bookings.
          </div>
        </Card>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
