import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../shared/api/queryKeys";
import { searchItems } from "../api/items.api";

export function useSearchItems(searchTerm: string) {
  return useQuery({
    queryKey: [...queryKeys.items, "search", searchTerm],
    queryFn: () => searchItems(searchTerm),
    enabled: searchTerm.trim().length > 0,
  });
}