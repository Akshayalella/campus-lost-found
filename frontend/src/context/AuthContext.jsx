import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api, { TOKEN_KEY } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  // Only "loading" if there is a token whose user we still need to fetch
  const [loading, setLoading] = useState(() => !!localStorage.getItem(TOKEN_KEY));

  // On first load: if a token exists, fetch the current user. No token => no API call.
  useEffect(() => {
    let cancelled = false;
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setLoading(false);
      return undefined;
    }
    api
      .get('/auth/me')
      .then((res) => {
        if (!cancelled) setUser(res.data.user);
      })
      .catch((err) => {
        // Invalid/expired token: clear it quietly. Network errors keep the token.
        if (!cancelled && err.response && err.response.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const saveSession = useCallback((newToken, newUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const login = useCallback(
    async (email, password, role) => {
      const res = await api.post('/auth/login', { email, password, role });
      saveSession(res.data.token, res.data.user);
      return res.data.user;
    },
    [saveSession]
  );

  const register = useCallback(
    async (form) => {
      const res = await api.post('/auth/register', form);
      saveSession(res.data.token, res.data.user);
      return res.data.user;
    },
    [saveSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
