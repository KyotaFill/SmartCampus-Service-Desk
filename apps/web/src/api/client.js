const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, { code = 'UNKNOWN_ERROR', status = 0, details = [] } = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

async function request(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers);
  if (options.body) headers.set('content-type', 'application/json');
  if (token) headers.set('authorization', `Bearer ${token}`);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError('Không thể kết nối đến máy chủ. Vui lòng thử lại.', {
      code: 'NETWORK_ERROR'
    });
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(body?.error?.message ?? 'Yêu cầu không thành công. Vui lòng thử lại.', {
      code: body?.error?.code,
      status: response.status,
      details: body?.error?.details
    });
  }

  return body;
}

export const authApi = {
  login(credentials) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  me(token) {
    return request('/auth/me', { token });
  }
};
