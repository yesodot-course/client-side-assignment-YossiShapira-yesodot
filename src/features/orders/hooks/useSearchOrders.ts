import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../shared/api/queryKeys";
import { searchOrders } from "../api/orders.api";

export function useSearchOrders(searchTerm: string) {
  return useQuery({
    queryKey: [...queryKeys.orders, "search", searchTerm],
    queryFn: () => searchOrders(searchTerm),
    enabled: searchTerm.trim().length > 0,
  });
}