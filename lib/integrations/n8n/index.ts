/**
 * n8n adapter — trigger a self-hosted workflow webhook + a small REST API
 * client (list/activate workflows) using an n8n API key.
 *
 * Env: N8N_WEBHOOK_URL, N8N_API_KEY, N8N_BASE_URL
 */
import { env, hasEnv, requireEnv } from "../types";

export const N8N_ENV = ["N8N_WEBHOOK_URL", "N8N_API_KEY", "N8N_BASE_URL"] as const;

export function isConfigured(): boolean {
  return hasEnv("N8N_WEBHOOK_URL") || hasEnv("N8N_API_KEY", "N8N_BASE_URL");
}

export type Fetcher = typeof fetch;
let _fetch: Fetcher = (...a) => fetch(...a);
export function __setFetch(f: Fetcher | null): void {
  _fetch = f ?? ((...a) => fetch(...a));
}

/** Trigger an n8n workflow by POSTing to its webhook URL. */
export async function trigger(
  payload: Record<string, unknown>,
  url?: string,
): Promise<{ ok: boolean; status: number; body: unknown }> {
  const target = url ?? requireEnv("n8n", "N8N_WEBHOOK_URL");
  const res = await _fetch(target, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return { ok: res.ok, status: res.status, body };
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const base = requireEnv("n8n", "N8N_BASE_URL").replace(/\/$/, "");
  const key = requireEnv("n8n", "N8N_API_KEY");
  const res = await _fetch(`${base}/api/v1${path}`, {
    ...init,
    headers: {
      "X-N8N-API-KEY": key,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`[n8n] ${res.status} ${path}: ${await res.text()}`);
  return (await res.json()) as T;
}

export interface Workflow {
  id: string;
  name: string;
  active: boolean;
}

/** List workflows via the n8n REST API. */
export async function listWorkflows(): Promise<Workflow[]> {
  const res = await api<{ data: Workflow[] }>("/workflows");
  return res.data;
}

/** Activate or deactivate a workflow. */
export async function setWorkflowActive(id: string, active: boolean): Promise<Workflow> {
  return api<Workflow>(`/workflows/${id}/${active ? "activate" : "deactivate"}`, {
    method: "POST",
  });
}

/** Base URL helper (for building webhook URLs when only base is set). */
export function baseUrl(): string | undefined {
  return env("N8N_BASE_URL");
}
