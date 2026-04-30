export type OrderStatus = "Pending" | "Completed" | "Cancelled";

export interface CreateOrderItemInput {
  item: string;
  quantity: number;
}

export interface CreateOrderInput {
  customerId: string;
  address: string;
  items: CreateOrderItemInput[];
}

export interface UpdateOrderInput {
  customerId?: string;
  address?: string;
  items?: CreateOrderItemInput[];
  status?: OrderStatus;
}

export interface OrderItemRef {
  _id: string;
  name?: string;
  imageUrl?: string;
}

export interface OrderItemSnapshot {
  item: string | OrderItemRef;
  quantity: number;
  itemName?: string;
  category?: string;
  supplierId?: string;
  supplierName?: string;
  priceAtOrder?: number;
  supplierPriceAtOrder?: number;
}

export interface Order {
  _id: string;
  customerId: string;
  address: string;
  status?: OrderStatus;
  openedAt?: string;
  closedAt?: string;
  totalPrice: number;
  shopProfit?: number;
  totalItemsQuantity: number;
  items?: OrderItemSnapshot[];
}