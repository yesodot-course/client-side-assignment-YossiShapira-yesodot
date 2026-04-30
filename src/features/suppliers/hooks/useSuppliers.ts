import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../shared/api/queryKeys";
import { fetchSuppliers } from "../api/suppliers.api";

export function useSuppliers() {
  return useQuery({
    queryKey: queryKeys.suppliers,
    queryFn: fetchSuppliers,
  });
}