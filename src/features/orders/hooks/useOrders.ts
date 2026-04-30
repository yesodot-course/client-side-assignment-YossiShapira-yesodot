import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../shared/api/queryKeys";
import { fetchOrders } from "../api/orders.api";

export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders,
    queryFn: fetchOrders,
  });
}