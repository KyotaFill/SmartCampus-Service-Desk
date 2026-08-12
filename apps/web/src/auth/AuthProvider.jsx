import { useCallback, useEffect, useState } from 'react';
import { authApi } from '../api/client.js';
import { clearSession, readSession, saveSession } from './session.js';
import { AuthContext } from './context.js';

export default function AuthProvider({ children }) {
  const [initialSession] = useState(readSession);
  const [verificationAttempt, setVerificationAttempt] = useState(0);
  const [auth, setAuth] = useState(() => initialSession
    ? { status: 'checking', user: initialSession.user, error: null }
    : { status: 'anonymous', user: null, error: null });

  useEffect(() => {
    if (!initialSession) return undefined;

    let active = true;
    authApi.me(initialSession.token)
      .then(({ user }) => {
        if (!active) return;
        saveSession({ token: initialSession.token, user }, initialSession.persistent);
        setAuth({ status: 'authenticated', user, error: null });
      })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401 || error.status === 403) {
          clearSession();
          setAuth({ status: 'anonymous', user: null, error: null });
          return;
        }

        setAuth({
          status: 'unavailable',
          user: initialSession.user,
          error: 'Không thể xác minh phiên lúc này. Vui lòng kiểm tra kết nối và thử lại.'
        });
      });

    return () => {
      active = false;
    };
  }, [initialSession, verificationAttempt]);

  const login = useCallback(async (credentials, remember) => {
    const response = await authApi.login(credentials);
    const session = { token: response.token, user: response.user };
    saveSession(session, remember);
    setAuth({ status: 'authenticated', user: response.user, error: null });
    return response.user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setAuth({ status: 'anonymous', user: null, error: null });
  }, []);

  const retrySession = useCallback(() => {
    if (!initialSession) return;
    setAuth({ status: 'checking', user: initialSession.user, error: null });
    setVerificationAttempt((attempt) => attempt + 1);
  }, [initialSession]);

  return (
    <AuthContext.Provider value={{
      status: auth.status,
      user: auth.user,
      sessionError: auth.error,
      login,
      logout,
      retrySession
    }}>
      {children}
    </AuthContext.Provider>
  );
}
