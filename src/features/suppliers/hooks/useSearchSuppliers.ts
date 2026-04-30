import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../shared/api/queryKeys";
import { searchSuppliers } from "../api/suppliers.api";

export function useSearchSuppliers(searchTerm: string) {
  return useQuery({
    queryKey: [...queryKeys.suppliers, "search", searchTerm],
    queryFn: () => searchSuppliers(searchTerm),
    enabled: searchTerm.trim().length > 0,
  });
}