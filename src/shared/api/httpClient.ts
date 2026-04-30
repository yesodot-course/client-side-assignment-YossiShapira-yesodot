import axios from "axios";

import { env } from "../config/env";
import { ApiError } from "./apiError";

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const data = error.response?.data as { message?: string } | undefined;
      const message = data?.message ?? error.message ?? "שגיאת שרת";
      return Promise.reject(new ApiError(message, status));
    }
    return Promise.reject(new ApiError("שגיאה לא צפויה", 500));
  }
);