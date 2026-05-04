import { httpClient } from "../../../shared/api/httpClient";
import type { CreateOrderInput, Order, UpdateOrderInput } from "../types";

export async function fetchOrders(): Promise<Order[]> {
  const response = await httpClient.get<Order[]>("/orders");
  return response.data;
}

export async function fetchOrderById(id: string): Promise<Order> {
  const response = await httpClient.get<Order>(`/orders/${id}`);
  return response.data;
}

export async function searchOrders(query: string): Promise<Order[]> {
  const response = await httpClient.get<Order[]>("/orders/search/query", {
    params: { q: query },
  });
  return response.data;
}

export async function createOrder(payload: CreateOrderInput): Promise<Order> {
  const response = await httpClient.post<Order>("/orders", payload);
  return response.data;
}

export async function updateOrder(id: string, payload: UpdateOrderInput): Promise<Order> {
  const response = await httpClient.put<Order>(`/orders/${id}`, payload);
  return response.data;
}

export async function deleteOrder(id: string): Promise<{ message: string }> {
  const response = await httpClient.delete<{ message: string }>(`/orders/${id}`);
  return response.data;
}