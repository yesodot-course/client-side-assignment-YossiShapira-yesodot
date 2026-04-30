import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../shared/api/queryKeys";
import { fetchItems } from "../api/items.api";

export function useItems() {
  return useQuery({
    queryKey: queryKeys.items,
    queryFn: fetchItems,
  });
}