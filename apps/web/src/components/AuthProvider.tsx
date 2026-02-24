'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'pathwise-auth-token';
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function isAuthUser(value: unknown): value is AuthUser {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.name === 'string' &&
    typeof record.email === 'string'
  );
}

function isAuthResponse(
  value: unknown,
): value is { token: string; user: AuthUser } {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.token === 'string' && isAuthUser(record.user);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const saveToken = useCallback((t: string) => {
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setLoading(false);
      return;
    }
    const loadUser = async () => {
      setToken(stored);
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${stored}` },
        });
        if (!res.ok) throw new Error('Invalid token');
        const data = (await res.json()) as unknown;
        if (!isAuthUser(data)) throw new Error('Invalid user payload');
        setUser(data);
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };
    void loadUser();
  }, [clearAuth]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as unknown;
        const message =
          data && typeof data === 'object' && 'message' in data
            ? typeof (data as { message?: unknown }).message === 'string'
              ? (data as { message?: string }).message
              : ''
            : '';
        throw new Error(message || 'Login failed');
      }
      const data = (await res.json()) as unknown;
      if (!isAuthResponse(data)) throw new Error('Invalid login response');
      saveToken(data.token);
      setUser(data.user);
    },
    [saveToken],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as unknown;
        const message =
          data && typeof data === 'object' && 'message' in data
            ? typeof (data as { message?: unknown }).message === 'string'
              ? (data as { message?: string }).message
              : ''
            : '';
        throw new Error(message || 'Registration failed');
      }
      const data = (await res.json()) as unknown;
      if (!isAuthResponse(data)) throw new Error('Invalid register response');
      saveToken(data.token);
      setUser(data.user);
    },
    [saveToken],
  );

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
