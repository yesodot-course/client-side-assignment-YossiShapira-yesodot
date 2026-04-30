import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../shared/api/queryKeys";
import { fetchMonthlyRevenue } from "../api/analytics.api";

export function useMonthlyRevenue() {
  return useQuery({
    queryKey: [...queryKeys.analytics, "monthlyRevenue"],
    queryFn: fetchMonthlyRevenue,
  });
}