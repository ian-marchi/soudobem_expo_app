import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';
const RUNTIME_MODE = process.env.EXPO_PUBLIC_RUNTIME_MODE ?? 'local';

export const isLocalMode = () => RUNTIME_MODE === 'local';

async function getAuthHeader(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem('session_token');
  if (token) return { Authorization: `Bearer ${token}` };
  return {};
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const authHeader = await getAuthHeader();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...(options.headers as Record<string, string>),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Erro desconhecido' }));
    throw new Error(error.detail ?? `Erro ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),

  postForm: async <T>(path: string, formData: FormData): Promise<T> => {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: authHeader,
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(error.detail ?? `Erro ${response.status}`);
    }
    return response.json() as Promise<T>;
  },

  putForm: async <T>(path: string, formData: FormData): Promise<T> => {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers: authHeader,
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(error.detail ?? `Erro ${response.status}`);
    }
    return response.json() as Promise<T>;
  },

  mediaUrl: (path: string) => `${API_BASE_URL}/media/${path}`,
};
