import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, User } from '../services/auth';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<{ verification_id?: string }>;
  verifyCode: (verification_id: string, codigo: string) => Promise<string>;
  completeRegistration: (nome: string, email: string, senha: string, token: string) => Promise<void>;
  resendCode: (verification_id: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getMe().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const login = async (email: string, senha: string) => {
    const u = await authService.login(email, senha);
    setUser(u);
  };

  const register = async (nome: string, email: string, senha: string) => {
    const res = await authService.register(nome, email, senha);
    if (res.user) setUser(res.user);
    return { verification_id: res.verification_id };
  };

  const verifyCode = async (verification_id: string, codigo: string) => {
    return authService.verifyCode(verification_id, codigo);
  };

  const completeRegistration = async (nome: string, email: string, senha: string, token: string) => {
    const u = await authService.completeRegistration(nome, email, senha, token);
    setUser(u);
  };

  const resendCode = async (verification_id: string) => {
    await authService.resendCode(verification_id);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyCode, completeRegistration, resendCode, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
