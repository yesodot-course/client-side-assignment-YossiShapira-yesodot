import { useMutation } from "@tanstack/react-query";

import { queryClient } from "../../../shared/api/queryClient";
import { queryKeys } from "../../../shared/api/queryKeys";
import { deleteItem } from "../api/items.api";

export function useDeleteItem() {
  return useMutation({
    mutationFn: (id: string) => deleteItem(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.items });
      void queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
    },
  });
}