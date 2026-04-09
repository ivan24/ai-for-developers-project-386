import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";
import { buttonVariants } from "./shared";

const defaults = getDefaultClassNames();

export type CalendarProps = ComponentProps<typeof DayPicker>;

export function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("rounded-[26px] bg-white/70 p-4", className)}
      classNames={{
        root: cn(defaults.root, "w-full"),
        month_grid: cn(defaults.month_grid, "w-full border-separate border-spacing-y-1.5"),
        nav: cn(defaults.nav, "flex items-center gap-2"),
        button_previous: cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 w-8 rounded-full p-0"),
        button_next: cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 w-8 rounded-full p-0"),
        month_caption: cn(defaults.month_caption, "mb-4 justify-between"),
        caption_label: cn(defaults.caption_label, "font-semibold text-foreground"),
        weekdays: cn(defaults.weekdays, "text-xs uppercase tracking-[0.22em] text-muted-foreground"),
        weekday: cn(defaults.weekday, "font-medium"),
        day: cn(defaults.day, "h-10 w-10 rounded-full text-sm font-medium text-foreground aria-selected:opacity-100"),
        today: cn(defaults.today, "bg-secondary text-secondary-foreground"),
        selected: cn(defaults.selected, "bg-primary text-primary-foreground hover:bg-primary"),
        outside: cn(defaults.outside, "text-muted-foreground/50"),
        disabled: cn(defaults.disabled, "text-muted-foreground/40"),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: iconClassName }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("h-4 w-4", iconClassName)} />
          ) : (
            <ChevronRight className={cn("h-4 w-4", iconClassName)} />
          ),
      }}
      {...props}
    />
  );
}
