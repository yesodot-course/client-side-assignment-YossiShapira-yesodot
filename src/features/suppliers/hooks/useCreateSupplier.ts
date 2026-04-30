import { useMutation } from "@tanstack/react-query";

import { queryClient } from "../../../shared/api/queryClient";
import { queryKeys } from "../../../shared/api/queryKeys";
import { createSupplier } from "../api/suppliers.api";
import type { SupplierInput } from "../types";

export function useCreateSupplier() {
  return useMutation({
    mutationFn: (payload: SupplierInput) => createSupplier(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.suppliers });
      void queryClient.invalidateQueries({ queryKey: queryKeys.items });
    },
  });
}