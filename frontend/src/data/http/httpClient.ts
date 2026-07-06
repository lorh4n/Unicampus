// Cliente HTTP único da aplicação. Toda chamada de rede passa por aqui.

const TIMEOUT_MS = 12000;
const TOKEN_KEY = 'unicampus.token';

export const API_URL: string = import.meta.env.VITE_API_URL ?? '';

/**
 * Modo dev: sem VITE_API_URL (ou com VITE_USE_MOCKS=true) a aplicação usa os
 * repositórios mock persistidos em localStorage. Com a URL definida, usa HTTP.
 */
export const isDevMode: boolean =
  API_URL.length === 0 || import.meta.env.VITE_USE_MOCKS === 'true';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token === null) localStorage.removeItem(TOKEN_KEY);
  else localStorage.setItem(TOKEN_KEY, token);
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const token = getToken();
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    if (res.status === 401) {
      setToken(null);
      window.dispatchEvent(new Event('unicampus:unauthorized'));
      throw new HttpError(401, 'Sessão expirada — entre novamente.');
    }
    if (!res.ok) {
      throw new HttpError(res.status, `Erro ${res.status} ao chamar ${path}`);
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export const http = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
