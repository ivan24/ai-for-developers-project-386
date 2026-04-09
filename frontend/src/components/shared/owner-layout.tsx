import { Outlet } from "react-router-dom";
import { useOwner } from "../../lib/api-hooks";
import { getErrorMessage } from "../../lib/errors";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ErrorState, LoadingState } from "./states";

export function OwnerLayout() {
  const ownerQuery = useOwner();

  return (
    <div className="space-y-6">
      {ownerQuery.isLoading ? (
        <LoadingState title="Loading owner profile..." />
      ) : ownerQuery.error ? (
        <ErrorState
          description={getErrorMessage(ownerQuery.error, "Owner profile could not be loaded.")}
          title="Owner profile unavailable"
        />
      ) : ownerQuery.data ? (
        <Card>
          <CardHeader>
            <Badge>Owner profile</Badge>
            <CardTitle>{ownerQuery.data.name}</CardTitle>
            <CardDescription>
              Public owner area is intentionally open in this exercise. Timezone: {ownerQuery.data.timezone}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-[24px] bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Owner id</p>
              <p className="mt-2 font-medium text-foreground">{ownerQuery.data.id}</p>
            </div>
            <div className="rounded-[24px] bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Timezone</p>
              <p className="mt-2 font-medium text-foreground">{ownerQuery.data.timezone}</p>
            </div>
            <div className="rounded-[24px] bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Access mode</p>
              <p className="mt-2 font-medium text-foreground">No auth in current spec</p>
            </div>
          </CardContent>
        </Card>
      ) : null}
      <Outlet />
    </div>
  );
}
