import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../shared/api/queryKeys";
import { fetchDailyItem } from "../api/analytics.api";

export function useDailyItem() {
  return useQuery({
    queryKey: [...queryKeys.analytics, "daily-item"],
    queryFn: fetchDailyItem,
  });
}