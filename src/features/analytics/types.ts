export interface MonthlyRevenueResponse {
  revenue: number;
}

export interface WeeklyCategoryResponse {
  _id: string;
  totalProfit: number;
}

export interface DailyItemResponse {
  _id: string;
  itemName: string;
  totalProfit: number;
}

export interface MarginItem {
  name: string;
  price: number;
  supplierPrice: number;
  margin: number;
}

export interface MarginItemsResponse {
  highest: MarginItem | null;
  lowest: MarginItem | null;
}

export interface TopSupplierResponse {
  supplierName: string;
  totalProfit: number;
}

export interface SupplierSpendingEntry {
  supplierName: string;
  totalSpent: number;
}