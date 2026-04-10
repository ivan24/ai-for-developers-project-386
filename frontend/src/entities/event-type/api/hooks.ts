import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/client";

export const eventTypeQueryKeys = {
  publicList: ["public-event-types"] as const,
  ownerList: ["owner-event-types"] as const,
};

export const usePublicEventTypes = () =>
  useQuery({
    queryKey: eventTypeQueryKeys.publicList,
    queryFn: api.getPublicEventTypes,
  });

export const useOwnerEventTypes = () =>
  useQuery({
    queryKey: eventTypeQueryKeys.ownerList,
    queryFn: api.getOwnerEventTypes,
  });
