import { httpClient } from "../../../shared/api/httpClient";
import type { Supplier, SupplierInput } from "../types";

export async function fetchSuppliers(): Promise<Supplier[]> {
  const response = await httpClient.get<Supplier[]>("/suppliers");
  return response.data;
}

export async function fetchSupplierById(id: string): Promise<Supplier> {
  const response = await httpClient.get<Supplier>(`/suppliers/${id}`);
  return response.data;
}

export async function searchSuppliers(query: string): Promise<Supplier[]> {
  const response = await httpClient.get<Supplier[]>("/suppliers/search/query", {
    params: { q: query },
  });
  return response.data;
}

export async function createSupplier(payload: SupplierInput): Promise<Supplier> {
  const response = await httpClient.post<Supplier>("/suppliers", payload);
  return response.data;
}

export async function updateSupplier(id: string, payload: Partial<SupplierInput>): Promise<Supplier> {
  const response = await httpClient.put<Supplier>(`/suppliers/${id}`, payload);
  return response.data;
}

export async function deleteSupplier(id: string): Promise<{ message: string }> {
  const response = await httpClient.delete<{ message: string }>(`/suppliers/${id}`);
  return response.data;
}