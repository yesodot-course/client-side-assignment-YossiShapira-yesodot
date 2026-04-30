import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../shared/api/queryKeys";
import { fetchTopSupplier } from "../api/analytics.api";

export function useTopSupplier() {
  return useQuery({
    queryKey: [...queryKeys.analytics, "top-supplier"],
    queryFn: fetchTopSupplier,
  });
}