const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let accessToken = null;
let refreshPromise = null;

export const setToken = (token) => {
  accessToken = token;
};

export const getToken = () => accessToken;

export class ApiError extends Error {
  status;
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export const fetchApi = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;

  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const config = {
    ...options,
    headers
  };

  // If hitting an auth route (except refresh) we should probably send credentials (cookies)
  // Actually, wait, the backend sets the refresh token cookie. So we MUST include credentials for refresh, login, register, logout.
  config.credentials = 'include';

  let res = await fetch(url, config);

  if (res.status === 401 && endpoint !== '/auth/refresh' && endpoint !== '/auth/login' && endpoint !== '/auth/register') {
    // Try to refresh
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken();
    }

    const newToken = await refreshPromise;
    if (newToken) {
      // Retry with new token
      headers.set('Authorization', `Bearer ${newToken}`);
      res = await fetch(url, { ...config, headers });
    } else {
      // Refresh failed (401 from refresh or network error).
      setToken(null);
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
  }

  if (!res.ok) {
    let message = 'An error occurred';
    try {
      const data = await res.clone().json();
      message = data.error || message;
    } catch {

      // Ignore
    }throw new ApiError(res.status, message);
  }

  return res;
};

export const fetchJson = async (endpoint, options) => {
  const res = await fetchApi(endpoint, options);
  // 204 No Content won't parse as JSON
  if (res.status === 204) {
    return {};
  }
  return res.json();
};

const refreshAccessToken = async () => {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    });
    if (!res.ok) {
      setToken(null);
      return null;
    }
    const data = await res.json();
    setToken(data.accessToken);
    return data.accessToken;
  } catch (err) {
    setToken(null);
    return null;
  } finally {
    refreshPromise = null; // Clear promise for next time
  }
};

export const silentRefresh = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken();
  }
  const token = await refreshPromise;
  if (!token) {
    window.dispatchEvent(new Event('auth:unauthorized'));
  }
  return token;
};