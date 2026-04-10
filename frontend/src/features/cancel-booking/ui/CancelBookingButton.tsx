import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingQueryKeys } from "@/entities/booking/api/hooks";
import { api } from "@/shared/api/client";
import type { BookingStatus } from "@/shared/api/types";
import { getApiErrorMessage } from "@/shared/lib/format";

interface CancelBookingButtonProps {
  bookingId: string;
  status: BookingStatus;
}

export const CancelBookingButton = ({
  bookingId,
  status,
}: CancelBookingButtonProps) => {
  const queryClient = useQueryClient();
  const cancelBookingMutation = useMutation({
    mutationFn: api.cancelBooking,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bookingQueryKeys.upcoming });
    },
  });

  const handleCancel = async () => {
    try {
      await cancelBookingMutation.mutateAsync(bookingId);
      notifications.show({
        color: "teal",
        title: "Booking cancelled",
        message: "The booking has been marked as cancelled.",
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Unable to cancel booking",
        message: getApiErrorMessage(error),
      });
    }
  };

  return (
    <Button
      color="red"
      variant="light"
      disabled={status !== "active"}
      loading={
        cancelBookingMutation.isPending &&
        cancelBookingMutation.variables === bookingId
      }
      onClick={handleCancel}
    >
      Cancel booking
    </Button>
  );
};
