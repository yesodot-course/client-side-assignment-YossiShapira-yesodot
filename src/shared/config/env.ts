const DEFAULT_API_BASE_URL = "http://localhost:3000/api";
const DEFAULT_API_TIMEOUT_MS = 10000;

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  apiTimeoutMs: parsePositiveInt(
    import.meta.env.VITE_API_TIMEOUT_MS,
    DEFAULT_API_TIMEOUT_MS
  ),
};