export interface ApiResponse<TData> {
  data: TData;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}