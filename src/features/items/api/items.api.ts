import { httpClient } from "../../../shared/api/httpClient";
import type { Item } from "../types";

export interface ItemInput {
  name: string;
  price: number;
  supplierPrice: number;
  stock: number;
  category: string;
  imageUrl?: string;
  supplier: string;
}

export async function fetchItems(): Promise<Item[]> {
  const response = await httpClient.get<Item[]>("/items");
  return response.data;
}

export async function fetchItemById(id: string): Promise<Item> {
  const response = await httpClient.get<Item>(`/items/${id}`);
  return response.data;
}

export async function searchItems(query: string): Promise<Item[]> {
  const response = await httpClient.get<Item[]>("/items/search", {
    params: { q: query },
  });
  return response.data;
}

export async function createItem(payload: ItemInput): Promise<Item> {
  const response = await httpClient.post<Item>("/items", payload);
  return response.data;
}

export async function updateItem(id: string, payload: Partial<ItemInput>): Promise<Item> {
  const response = await httpClient.put<Item>(`/items/${id}`, payload);
  return response.data;
}

export async function deleteItem(id: string): Promise<{ message: string }> {
  const response = await httpClient.delete<{ message: string }>(`/items/${id}`);
  return response.data;
}