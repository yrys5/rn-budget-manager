export type ApiState<T> =
  | { status: 'idle'; data?: T; error?: undefined }
  | { status: 'loading'; data?: T; error?: undefined }
  | { status: 'success'; data: T; error?: undefined }
  | { status: 'empty'; data?: T; error?: undefined }
  | { status: 'error'; data?: T; error: ApiError };

export type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string;
  timeoutMs?: number;
};

export class ApiError extends Error {
  code: string;
  status?: number;

  constructor(message: string, code = 'API_ERROR', status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

export const mapApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 'UNKNOWN_ERROR');
  }

  return new ApiError('Nie udało się połączyć z serwerem.', 'UNKNOWN_ERROR');
};

export const apiRequest = async <T>(path: string, options: ApiRequestOptions = {}): Promise<T> => {
  if (!API_BASE_URL) {
    throw new ApiError(
      'Brak konfiguracji EXPO_PUBLIC_API_URL. Używany jest adapter mock do czasu integracji backendu.',
      'MISSING_API_URL',
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs ?? 10000);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      body: options.body ? JSON.stringify(options.body) : undefined,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      method: options.method ?? 'GET',
      signal: controller.signal,
    });

    const text = await response.text();
    const payload = text ? JSON.parse(text) : undefined;

    if (!response.ok) {
      throw new ApiError(
        payload?.message ?? 'Serwer zwrócił błąd.',
        payload?.code ?? 'HTTP_ERROR',
        response.status,
      );
    }

    return payload as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Przekroczono czas oczekiwania na odpowiedź serwera.', 'TIMEOUT');
    }

    throw mapApiError(error);
  } finally {
    clearTimeout(timeoutId);
  }
};

export const toApiState = <T>(data: T): ApiState<T> => {
  const isEmpty = Array.isArray(data) ? data.length === 0 : !data;

  return isEmpty ? { status: 'empty', data } : { status: 'success', data };
};
