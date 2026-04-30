import { useQuery } from "@tanstack/react-query";
import { fetchOrderById } from "../api/orders.api";

export function useOrderDetails(id: string) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => fetchOrderById(id),
    enabled: id.trim().length > 0,
  });
}
