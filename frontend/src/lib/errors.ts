import { ApiError } from "@calendar-booking/api-client";

export function getErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (error instanceof ApiError) {
    const apiMessage =
      typeof error.data === "object" &&
      error.data !== null &&
      "message" in error.data &&
      typeof error.data.message === "string"
        ? error.data.message
        : undefined;

    return apiMessage ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function isApiStatus(error: unknown, status: number) {
  return error instanceof ApiError && error.status === status;
}
