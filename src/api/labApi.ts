/**
 * API client for the cybersecurity training lab backend.
 * Uses a configurable production API URL via environment variables or runtime configuration.
 */

let customApiBase: string | null = null;

/**
 * Dynamically resolves the API base URL.
 * Priority: Runtime override -> Environment variables -> Production fallback URL
 */
export function getApiBaseUrl(): string {
  if (customApiBase) {
    return customApiBase;
  }

  // Next.js / Node / Create-React-App environment variable support
  if (typeof process !== "undefined" && process.env) {
    const envUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.REACT_APP_API_URL ||
      process.env.API_BASE_URL;
    if (envUrl) return envUrl;
  }

  // Vite environment variable support
  try {
    if (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) {
      return (import.meta as any).env.VITE_API_URL;
    }
  } catch {
    // Ignore environments where import.meta is unsupported
  }

  // Production fallback URL (adjust domain to match your deployment)
  return "https://api.training.yourdomain.com/api";
}

/**
 * Allows setting or overriding the API URL programmatically at runtime.
 */
export function setApiBaseUrl(url: string): void {
  customApiBase = url.replace(/\/+$/, ""); // Remove trailing slashes
}

// --------------------
// Response interfaces
// --------------------

export interface HealthResponse {
  status: string;
  backend?: string;
  database_connected: boolean;
  database_error?: string | null;
  message?: string;
}

export interface StartSessionResponse {
  success: boolean;
  session_id: number;
  synthetic_participant_id: string;
  status: string;
}

export interface SubmitResponse {
  success: boolean;
  result: string;
  message: string;
  event_id?: number;
  session_id?: number;
  synthetic_participant_id?: string;
}

// --------------------
// Common API request
// --------------------

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${getApiBaseUrl()}${path}`;

  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error(
      `Cannot reach the training backend at ${url}. ` +
      "Verify the backend is running and the API URL is reachable."
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg =
      (data && (data.error || data.message)) ||
      `Request failed (${response.status})`;

    const error = new Error(msg) as Error & {
      status?: number;
      data?: unknown;
    };

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data as T;
}

// --------------------
// Backend health
// --------------------

export async function checkHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/health");
}

// --------------------
// Training sessions
// --------------------

export async function startLabSession(
  syntheticParticipantId: string
): Promise<StartSessionResponse> {
  return request<StartSessionResponse>("/lab/start", {
    method: "POST",
    body: JSON.stringify({
      synthetic_participant_id: syntheticParticipantId,
    }),
  });
}

/**
 * Records training completion and stores the entered credentials locally.
 */
export async function completeTrainingSession(
  sessionId: number,
  username: string,
  password: string
): Promise<SubmitResponse> {
  return request<SubmitResponse>("/lab/submit", {
    method: "POST",
    body: JSON.stringify({
      session_id: sessionId,
      username,
      password,
    }),
  });
}