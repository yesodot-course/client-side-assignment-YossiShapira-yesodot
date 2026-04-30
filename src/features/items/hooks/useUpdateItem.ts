import { useMutation } from "@tanstack/react-query";

import { queryClient } from "../../../shared/api/queryClient";
import { queryKeys } from "../../../shared/api/queryKeys";
import { updateItem, type ItemInput } from "../api/items.api";

interface UpdateItemPayload {
  id: string;
  payload: Partial<ItemInput>;
}

export function useUpdateItem() {
  return useMutation({
    mutationFn: ({ id, payload }: UpdateItemPayload) => updateItem(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.items });
      void queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
    },
  });
}