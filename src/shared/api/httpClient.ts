import axios from "axios";

import { env } from "../config/env";
import { ApiError } from "./apiError";

function extractApiErrorMessage(data: unknown): string | undefined {
  if (!data || typeof data !== "object" || !("message" in data)) {
    return undefined;
  }

  const message = (data as { message?: unknown }).message;
  return typeof message === "string" ? message : undefined;
}

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message =
        extractApiErrorMessage(error.response?.data) ??
        error.message ??
        "שגיאת שרת";
      return Promise.reject(new ApiError(message, status));
    }
    return Promise.reject(new ApiError("שגיאה לא צפויה", 500));
  }
);