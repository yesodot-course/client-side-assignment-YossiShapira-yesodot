import { useMutation } from "@tanstack/react-query";

import { queryClient } from "../../../shared/api/queryClient";
import { queryKeys } from "../../../shared/api/queryKeys";
import { updateSupplier } from "../api/suppliers.api";
import type { SupplierInput } from "../types";

interface UpdateSupplierPayload {
  id: string;
  payload: Partial<SupplierInput>;
}

export function useUpdateSupplier() {
  return useMutation({
    mutationFn: ({ id, payload }: UpdateSupplierPayload) => updateSupplier(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.suppliers });
      void queryClient.invalidateQueries({ queryKey: queryKeys.items });
    },
  });
}