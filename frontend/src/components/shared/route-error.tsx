import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Button } from "../ui/button";
import { ErrorState } from "./states";

export function RouteErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorState
        action={
          <Button asChild>
            <Link to="/">Back to home</Link>
          </Button>
        }
        description={error.statusText}
        title={`Route error ${error.status}`}
      />
    );
  }

  return (
    <ErrorState
      action={
        <Button asChild>
          <Link to="/">Back to home</Link>
        </Button>
      }
      description={error instanceof Error ? error.message : "Unexpected navigation error."}
      title="Something broke while rendering this route"
    />
  );
}
