import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../shared/api/queryKeys";
import { fetchSupplierById } from "../api/suppliers.api";

export function useSupplier(id: string) {
  return useQuery({
    queryKey: queryKeys.supplierById(id),
    queryFn: () => fetchSupplierById(id),
    enabled: Boolean(id),
  });
}
