import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App.jsx';
import AuthProvider from './auth/AuthProvider.jsx';
import { saveSession, SESSION_KEY } from './auth/session.js';

const user = {
  id: 'user-1',
  email: 'an@example.edu.vn',
  fullName: 'Nguyễn Văn An',
  role: 'STUDENT',
  isActive: true,
  createdAt: '2026-08-12T10:00:00.000Z'
};

function response(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(body)
  };
}

function renderApp(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
}

async function submitLogin({ remember = false } = {}) {
  const browser = userEvent.setup();
  await browser.type(screen.getByLabelText('Email trường'), user.email);
  await browser.type(screen.getByLabelText('Mật khẩu'), 'valid-password');
  if (remember) await browser.click(screen.getByLabelText(/Ghi nhớ đăng nhập/));
  await browser.click(screen.getByRole('button', { name: 'Đăng nhập' }));
  return browser;
}

describe('authentication flow', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('redirects an anonymous visitor away from a protected route', async () => {
    renderApp('/dashboard');

    expect(await screen.findByRole('heading', { name: 'Đăng nhập vào hệ thống' })).toBeInTheDocument();
  });

  it('logs in, persists a remembered session and logs out', async () => {
    fetch.mockResolvedValueOnce(response({
      token: 'jwt-token',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user
    }));
    renderApp('/login');

    const browser = await submitLogin({ remember: true });
    expect(await screen.findByRole('heading', { name: 'Chào buổi sáng, An!' })).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/auth/login',
      expect.objectContaining({ method: 'POST' })
    );
    expect(JSON.parse(localStorage.getItem(SESSION_KEY))).toEqual({ token: 'jwt-token', user });

    await browser.click(screen.getByRole('button', { name: /Nguyễn Văn An/ }));
    await browser.click(screen.getByRole('button', { name: 'Đăng xuất' }));

    expect(await screen.findByRole('heading', { name: 'Đăng nhập vào hệ thống' })).toBeInTheDocument();
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it('verifies and restores a saved session through auth/me', async () => {
    saveSession({ token: 'saved-token', user }, false);
    fetch.mockResolvedValueOnce(response({ user }));

    renderApp('/dashboard');

    expect(screen.getByText('Đang kiểm tra phiên đăng nhập…')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Chào buổi sáng, An!' })).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/auth/me',
      expect.objectContaining({ headers: expect.any(Headers) })
    );
    const headers = fetch.mock.calls[0][1].headers;
    expect(headers.get('authorization')).toBe('Bearer saved-token');
  });

  it('clears an invalid saved session and returns to login', async () => {
    saveSession({ token: 'expired-token', user }, true);
    fetch.mockResolvedValueOnce(response({
      error: { code: 'UNAUTHORIZED', message: 'Phiên đăng nhập không còn hợp lệ' }
    }, 401));

    renderApp('/dashboard');

    expect(await screen.findByRole('heading', { name: 'Đăng nhập vào hệ thống' })).toBeInTheDocument();
    await waitFor(() => expect(localStorage.getItem(SESSION_KEY)).toBeNull());
  });

  it('shows the API error and keeps the visitor on login', async () => {
    fetch.mockResolvedValueOnce(response({
      error: { code: 'INVALID_CREDENTIALS', message: 'Email hoặc mật khẩu không đúng' }
    }, 401));
    renderApp('/login');

    await submitLogin();

    expect(await screen.findByRole('alert')).toHaveTextContent('Email hoặc mật khẩu không đúng');
    expect(screen.getByRole('heading', { name: 'Đăng nhập vào hệ thống' })).toBeInTheDocument();
  });
});
