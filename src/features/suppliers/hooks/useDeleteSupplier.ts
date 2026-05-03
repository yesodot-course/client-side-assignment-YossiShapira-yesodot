import { useMutation } from "@tanstack/react-query";

import { queryClient } from "../../../shared/api/queryClient";
import { queryKeys } from "../../../shared/api/queryKeys";
import { deleteSupplier } from "../api/suppliers.api";

export function useDeleteSupplier() {
  return useMutation({
    mutationFn: (id: string) => deleteSupplier(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.suppliers });
      void queryClient.invalidateQueries({ queryKey: queryKeys.supplierById(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.items });
    },
  });
}