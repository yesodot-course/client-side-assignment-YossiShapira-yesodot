import { useMutation } from "@tanstack/react-query";

import { queryClient } from "../../../shared/api/queryClient";
import { queryKeys } from "../../../shared/api/queryKeys";
import { createOrder } from "../api/orders.api";
import type { CreateOrderInput } from "../types";
export function useCreateOrder() {
  return useMutation({
    mutationFn: (payload: CreateOrderInput) => createOrder(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      void queryClient.invalidateQueries({ queryKey: queryKeys.items });
    },
  });
}