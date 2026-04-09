import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function LoadingState({ title = "Loading data..." }: { title?: string }) {
  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          <CardTitle>{title}</CardTitle>
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <Card className="border-dashed bg-white/55">
      <CardContent className="space-y-4 text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription className="mx-auto max-w-xl">{description}</CardDescription>
        {action}
      </CardContent>
    </Card>
  );
}

export function ErrorState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="space-y-4 text-center">
        <CardTitle className="text-destructive">{title}</CardTitle>
        <CardDescription className="mx-auto max-w-xl text-foreground/80">{description}</CardDescription>
        {action}
      </CardContent>
    </Card>
  );
}
