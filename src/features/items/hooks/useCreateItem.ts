import { useMutation } from "@tanstack/react-query";

import { queryClient } from "../../../shared/api/queryClient";
import { queryKeys } from "../../../shared/api/queryKeys";
import { createItem, type ItemInput } from "../api/items.api";

export function useCreateItem() {
  return useMutation({
    mutationFn: (payload: ItemInput) => createItem(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.items });
      void queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
    },
  });
}