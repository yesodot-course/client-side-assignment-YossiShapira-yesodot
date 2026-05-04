import { useMutation } from "@tanstack/react-query";

import { queryClient } from "../../../shared/api/queryClient";
import { queryKeys } from "../../../shared/api/queryKeys";
import { deleteOrder } from "../api/orders.api";

export function useDeleteOrder() {
  return useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      void queryClient.invalidateQueries({ queryKey: queryKeys.items });
      void queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
    },
  });
}