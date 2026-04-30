import { httpClient } from "../../../shared/api/httpClient";
import type {
  DailyItemResponse,
  MarginItemsResponse,
  MonthlyRevenueResponse,
  SupplierSpendingEntry,
  TopSupplierResponse,
  WeeklyCategoryResponse,
} from "../types";

export async function fetchMonthlyRevenue(): Promise<MonthlyRevenueResponse> {
  const response = await httpClient.get<MonthlyRevenueResponse>("/analytics/revenue/monthly");
  return response.data;
}

export async function fetchWeeklyCategory(): Promise<WeeklyCategoryResponse | null> {
  const response = await httpClient.get<WeeklyCategoryResponse | null>("/analytics/profitable/category/weekly");
  return response.data;
}

export async function fetchDailyItem(): Promise<DailyItemResponse | null> {
  const response = await httpClient.get<DailyItemResponse | null>("/analytics/profitable/item/daily");
  return response.data;
}

export async function fetchMarginItems(): Promise<MarginItemsResponse> {
  const response = await httpClient.get<MarginItemsResponse>("/analytics/margin/items");
  return response.data;
}

export async function fetchTopSupplier(): Promise<TopSupplierResponse | null> {
  const response = await httpClient.get<TopSupplierResponse | null>("/analytics/profitable/supplier");
  return response.data;
}

export async function fetchSupplierSpending(): Promise<SupplierSpendingEntry[]> {
  const response = await httpClient.get<SupplierSpendingEntry[]>("/analytics/suppliers/spending");
  return response.data;
}