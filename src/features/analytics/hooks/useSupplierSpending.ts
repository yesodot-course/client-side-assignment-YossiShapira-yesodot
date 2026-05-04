import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../shared/api/queryKeys";
import { fetchSupplierSpending } from "../api/analytics.api";

export function useSupplierSpending() {
  return useQuery({
    queryKey: [...queryKeys.analytics, "supplier-spending"],
    queryFn: fetchSupplierSpending,
  });
}