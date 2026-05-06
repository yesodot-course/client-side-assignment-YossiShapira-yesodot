import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../shared/api/queryKeys";
import { fetchOrderById } from "../api/orders.api";

export function useOrderDetails(id: string) {
  return useQuery({
    queryKey: queryKeys.orderById(id),
    queryFn: () => fetchOrderById(id),
    enabled: id.trim().length > 0,
  });
}
