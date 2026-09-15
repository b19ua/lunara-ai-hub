/**
 * Lunara Box API client.
 *
 * Every screen talks to the backend through this module only. Today the calls
 * are served by the in-memory mock layer (`USE_MOCK`), which keeps the app
 * fully functional before the Docker backend exists. Flip `USE_MOCK` to false
 * (or set VITE_LUNARA_API_URL) and the same call signatures hit the real
 * `/api/*` endpoints of the Lunara backend — no UI changes required.
 */

export const API_BASE_URL =
  (import.meta.env["VITE_LUNARA_API_URL"] as string | undefined) ?? "/api";

export const USE_MOCK = (import.meta.env["VITE_LUNARA_USE_MOCK"] as string | undefined) !== "false";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly friendly: string,
    readonly action?: { label: string; to?: string },
  ) {
    super(message);
  }
}

/** Simulated network latency so loading states are real. */
export function delay<T>(value: T, ms = 320): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    throw new ApiError(`${res.status} ${path}`, "Lunara Box could not reach part of the system.", {
      label: "Run diagnostics",
      to: "/system/diagnostics",
    });
  }
  return (await res.json()) as T;
}
