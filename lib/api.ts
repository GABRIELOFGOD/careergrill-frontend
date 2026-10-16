export const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

export function apiUrl(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("API paths must be absolute paths relative to the API.");
  }
  return `${apiBase}/api${path}`;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type UserRole = "admin" | "user";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  email_verified?: boolean;
}

function errorDetails(payload: unknown): { message?: string; code?: string } {
  if (typeof payload === "string") return { message: payload };
  if (!payload || typeof payload !== "object") return {};
  const record = payload as Record<string, unknown>;
  return {
    message: typeof record.error === "string" ? record.error : undefined,
    code: typeof record.code === "string" ? record.code : undefined,
  };
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (typeof init.body === "string" && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  const response = await fetch(apiUrl(path), {
    ...init,
    credentials: "include",
    headers,
  });
  if (response.status === 204) return undefined as T;
  const responseText = await response.text();
  let payload: unknown;
  if (responseText) {
    try {
      payload = JSON.parse(responseText) as unknown;
    } catch {
      if (response.ok) {
        throw new ApiError("The API returned an invalid response.", response.status);
      }
      payload = responseText;
    }
  }
  if (!response.ok) {
    const details = errorDetails(payload);
    throw new ApiError(
      details.message || `The request failed (${response.status}).`,
      response.status,
      details.code,
    );
  }
  if (payload === undefined) {
    throw new ApiError("The API returned an empty response.", response.status);
  }
  return payload as T;
}

export function apiUpload<T>(
  path: string,
  body: FormData,
  onProgress?: (percent: number) => void,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", apiUrl(path));
    request.withCredentials = true;
    request.timeout = 5 * 60 * 1000;
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    });
    request.addEventListener("load", () => {
      if (request.status === 204) {
        resolve(undefined as T);
        return;
      }
      let payload: unknown;
      if (request.responseText) {
        try {
          payload = JSON.parse(request.responseText) as unknown;
        } catch {
          if (request.status >= 200 && request.status < 300) {
            reject(new ApiError("The API returned an invalid response.", request.status));
            return;
          }
          payload = request.responseText;
        }
      }
      if (request.status < 200 || request.status >= 300) {
        const details = errorDetails(payload);
        reject(new ApiError(
          details.message || `The request failed (${request.status}).`,
          request.status,
          details.code,
        ));
        return;
      }
      if (payload === undefined) {
        reject(new ApiError("The API returned an empty response.", request.status));
        return;
      }
      resolve(payload as T);
    });
    request.addEventListener("error", () => reject(new ApiError("The upload could not reach the API.", 0)));
    request.addEventListener("timeout", () => reject(new ApiError("The upload timed out. Please try again.", 0)));
    request.addEventListener("abort", () => reject(new ApiError("The upload was cancelled.", 0)));
    request.send(body);
  });
}
