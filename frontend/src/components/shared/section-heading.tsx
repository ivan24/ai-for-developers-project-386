import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">{eyebrow}</p>
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
