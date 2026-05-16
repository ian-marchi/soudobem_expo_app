import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, isLocalMode } from './api';

export interface User {
  id: string;
  nome: string;
  email: string;
  is_admin: boolean;
  foto_url?: string;
  auth_provider?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

// Local in-memory store para modo local
const LOCAL_USERS_KEY = 'local_users';
const LOCAL_SESSION_KEY = 'local_session';

async function getLocalUsers(): Promise<Array<User & { senha_hash: string }>> {
  const raw = await AsyncStorage.getItem(LOCAL_USERS_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
}

async function saveLocalUsers(users: Array<User & { senha_hash: string }>) {
  await AsyncStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return String(Math.abs(hash));
}

export const authService = {
  async login(email: string, senha: string): Promise<User> {
    if (isLocalMode()) {
      // Admin local fixo
      if (email === 'admin@admn.com' && senha === 'admin#22018@') {
        const adminUser: User = {
          id: 'admin_local',
          nome: 'Administrador',
          email: 'admin@admn.com',
          is_admin: true,
        };
        await AsyncStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(adminUser));
        return adminUser;
      }

      const users = await getLocalUsers();
      const user = users.find(
        (u) => u.email === email && u.senha_hash === simpleHash(senha)
      );
      if (!user) throw new Error('Email ou senha incorretos.');

      const sessionUser: User = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        is_admin: user.is_admin,
      };
      await AsyncStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionUser));
      return sessionUser;
    }

    const res = await api.post<AuthResponse>('/auth/login', { email, senha });
    await AsyncStorage.setItem('session_token', res.token);
    return res.user;
  },

  async register(nome: string, email: string, senha: string): Promise<{ verification_id?: string; user?: User }> {
    if (isLocalMode()) {
      const users = await getLocalUsers();
      if (users.find((u) => u.email === email)) {
        throw new Error('Esse email já está registrado.');
      }
      const newUser: User & { senha_hash: string } = {
        id: `local_${Date.now()}`,
        nome,
        email,
        is_admin: false,
        senha_hash: simpleHash(senha),
      };
      await saveLocalUsers([...users, newUser]);

      const sessionUser: User = { id: newUser.id, nome, email, is_admin: false };
      await AsyncStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionUser));
      return { user: sessionUser };
    }

    const res = await api.post<{ verification_id: string }>('/auth/email/start-verification', {
      nome,
      email,
      senha,
    });
    return { verification_id: res.verification_id };
  },

  async verifyCode(verification_id: string, codigo: string): Promise<string> {
    const res = await api.post<{ verification_token: string }>('/auth/email/verify-code', {
      verification_id,
      codigo,
    });
    return res.verification_token;
  },

  async completeRegistration(nome: string, email: string, senha: string, verification_token: string): Promise<User> {
    const res = await api.post<AuthResponse>('/auth/register', {
      nome,
      email,
      senha,
      verification_token,
    });
    await AsyncStorage.setItem('session_token', res.token);
    return res.user;
  },

  async resendCode(verification_id: string): Promise<void> {
    await api.post('/auth/email/resend-code', { verification_id });
  },

  async getMe(): Promise<User | null> {
    if (isLocalMode()) {
      const raw = await AsyncStorage.getItem(LOCAL_SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    }

    try {
      return await api.get<User>('/auth/me');
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    if (isLocalMode()) {
      await AsyncStorage.removeItem(LOCAL_SESSION_KEY);
      return;
    }
    try {
      await api.post('/auth/logout', {});
    } catch {}
    await AsyncStorage.removeItem('session_token');
  },
};
