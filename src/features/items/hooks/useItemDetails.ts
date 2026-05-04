import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../shared/api/queryKeys";
import { fetchItemById } from "../api/items.api";

export function useItemDetails(id: string) {
  return useQuery({
    queryKey: queryKeys.itemById(id),
    queryFn: () => fetchItemById(id),
    enabled: id.length > 0,
  });
}