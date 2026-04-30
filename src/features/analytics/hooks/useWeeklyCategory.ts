import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../shared/api/queryKeys";
import { fetchWeeklyCategory } from "../api/analytics.api";

export function useWeeklyCategory() {
  return useQuery({
    queryKey: [...queryKeys.analytics, "weekly-category"],
    queryFn: fetchWeeklyCategory,
  });
}