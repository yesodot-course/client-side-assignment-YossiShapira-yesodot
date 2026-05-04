import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../shared/api/queryClient";
import { queryKeys } from "../../../shared/api/queryKeys";
import { updateOrder } from "../api/orders.api";
import type { UpdateOrderInput } from "../types";

interface UpdateOrderPayload {
  id: string;
  payload: UpdateOrderInput;
}

export function useUpdateOrder() {
  return useMutation({
    mutationFn: ({ id, payload }: UpdateOrderPayload) => updateOrder(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      void queryClient.invalidateQueries({ queryKey: queryKeys.items });
      void queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
    },
  });
}
