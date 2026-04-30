import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../shared/api/queryKeys";
import { fetchMarginItems } from "../api/analytics.api";

export function useMarginItems() {
  return useQuery({
    queryKey: [...queryKeys.analytics, "margin-items"],
    queryFn: fetchMarginItems,
  });
}