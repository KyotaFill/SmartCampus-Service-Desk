import { useCallback, useEffect, useState } from 'react';
import { authApi } from '../api/client.js';
import { clearSession, readSession, saveSession } from './session.js';
import { AuthContext } from './context.js';

export default function AuthProvider({ children }) {
  const [initialSession] = useState(readSession);
  const [auth, setAuth] = useState(() => initialSession
    ? { status: 'checking', user: initialSession.user }
    : { status: 'anonymous', user: null });

  useEffect(() => {
    if (!initialSession) return undefined;

    let active = true;
    authApi.me(initialSession.token)
      .then(({ user }) => {
        if (!active) return;
        saveSession({ token: initialSession.token, user }, initialSession.persistent);
        setAuth({ status: 'authenticated', user });
      })
      .catch(() => {
        if (!active) return;
        clearSession();
        setAuth({ status: 'anonymous', user: null });
      });

    return () => {
      active = false;
    };
  }, [initialSession]);

  const login = useCallback(async (credentials, remember) => {
    const response = await authApi.login(credentials);
    const session = { token: response.token, user: response.user };
    saveSession(session, remember);
    setAuth({ status: 'authenticated', user: response.user });
    return response.user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setAuth({ status: 'anonymous', user: null });
  }, []);

  return (
    <AuthContext.Provider value={{ status: auth.status, user: auth.user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
