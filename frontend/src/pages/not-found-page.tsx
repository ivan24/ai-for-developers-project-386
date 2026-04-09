import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ErrorState } from "../components/shared/states";

export function NotFoundPage() {
  return (
    <ErrorState
      action={
        <Button asChild>
          <Link to="/">Back to home</Link>
        </Button>
      }
      description="The requested route does not exist in the current booking app shell."
      title="Page not found"
    />
  );
}
