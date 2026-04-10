import dayjs from "dayjs";
import type { AxiosError } from "axios";
import type { ApiErrorPayload } from "@/shared/api/types";

export const getTodayDateValue = () => dayjs().format("YYYY-MM-DD");

export const formatSelectedDate = (value: string | null) =>
  value ? dayjs(value).format("dddd, MMMM D") : "Choose a day to load slots";

export const formatDateTime = (value: string) =>
  dayjs(value).format("DD MMM YYYY, HH:mm");

export const formatTime = (value: string) => dayjs(value).format("HH:mm");

export const formatDuration = (minutes: number) => `${minutes} min`;

export const getApiErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<ApiErrorPayload> | undefined;

  return (
    axiosError?.response?.data?.message ??
    axiosError?.message ??
    "Request failed. Try again."
  );
};
