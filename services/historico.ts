import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, isLocalMode } from './api';

export type TipoRegistro = 'pix' | 'voluntariado';
export type StatusRegistro = 'confirmado' | 'pendente' | 'enviado';

export interface RegistroHistorico {
  id: string;
  tipo: TipoRegistro;
  usuario_email: string;
  usuario_nome: string;
  instituicao_nome: string;
  instituicao_slug: string;
  valor?: number;
  comprovante_path?: string;
  fotos?: string[];
  data: string;
  hora: string;
  status: StatusRegistro;
  created_at: string;
}

export interface NovaDoacaoPix {
  instituicao_slug: string;
  instituicao_nome: string;
  valor: number;
  data: string;
  hora: string;
  comprovante?: { uri: string; name: string; type: string };
}

export interface NovoVoluntariado {
  instituicao_slug: string;
  instituicao_nome: string;
  data: string;
  hora: string;
  fotos?: Array<{ uri: string; name: string; type: string }>;
}

const LOCAL_HISTORICO_KEY = 'local_historico';

async function getLocalHistorico(): Promise<RegistroHistorico[]> {
  const raw = await AsyncStorage.getItem(LOCAL_HISTORICO_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
}

async function saveLocalHistorico(historico: RegistroHistorico[]) {
  await AsyncStorage.setItem(LOCAL_HISTORICO_KEY, JSON.stringify(historico));
}

export const historicoService = {
  async listar(userEmail?: string): Promise<RegistroHistorico[]> {
    if (isLocalMode()) {
      const all = await getLocalHistorico();
      if (userEmail) return all.filter((r) => r.usuario_email === userEmail);
      return all;
    }
    return api.get<RegistroHistorico[]>('/historico/me');
  },

  async registrarPix(dados: NovaDoacaoPix, userEmail: string, userNome: string): Promise<RegistroHistorico> {
    if (isLocalMode()) {
      const registro: RegistroHistorico = {
        id: `local_pix_${Date.now()}`,
        tipo: 'pix',
        usuario_email: userEmail,
        usuario_nome: userNome,
        instituicao_nome: dados.instituicao_nome,
        instituicao_slug: dados.instituicao_slug,
        valor: dados.valor,
        data: dados.data,
        hora: dados.hora,
        status: 'confirmado',
        created_at: new Date().toISOString(),
      };
      const historico = await getLocalHistorico();
      await saveLocalHistorico([registro, ...historico]);
      return registro;
    }

    const formData = new FormData();
    formData.append('instituicao_slug', dados.instituicao_slug);
    formData.append('valor', String(dados.valor));
    formData.append('data', dados.data);
    formData.append('hora', dados.hora);
    formData.append('status', 'confirmado');
    if (dados.comprovante) {
      formData.append('comprovante', dados.comprovante as unknown as Blob);
    }
    return api.postForm<RegistroHistorico>('/doacoes/pix', formData);
  },

  async registrarVoluntariado(dados: NovoVoluntariado, userEmail: string, userNome: string): Promise<RegistroHistorico> {
    if (isLocalMode()) {
      const registro: RegistroHistorico = {
        id: `local_vol_${Date.now()}`,
        tipo: 'voluntariado',
        usuario_email: userEmail,
        usuario_nome: userNome,
        instituicao_nome: dados.instituicao_nome,
        instituicao_slug: dados.instituicao_slug,
        data: dados.data,
        hora: dados.hora,
        status: 'pendente',
        created_at: new Date().toISOString(),
      };
      const historico = await getLocalHistorico();
      await saveLocalHistorico([registro, ...historico]);
      return registro;
    }

    const formData = new FormData();
    formData.append('instituicao_slug', dados.instituicao_slug);
    formData.append('data', dados.data);
    formData.append('hora', dados.hora);
    formData.append('status', 'pendente');
    (dados.fotos ?? []).forEach((foto) => {
      formData.append('fotos', foto as unknown as Blob);
    });
    return api.postForm<RegistroHistorico>('/voluntariado/realizado', formData);
  },
};
