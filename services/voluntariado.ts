import { api, isLocalMode } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SolicitacaoVoluntariado {
  id?: string;
  instituicao_id?: string;
  instituicao_slug: string;
  instituicao_nome: string;
  nome: string;
  email: string;
  telefone: string;
  descricao: string;
  data: string;
  hora: string;
  status: string;
}

const LOCAL_VOL_KEY = 'local_voluntarios';

export const voluntariadoService = {
  async enviarSolicitacao(dados: SolicitacaoVoluntariado): Promise<void> {
    if (isLocalMode()) {
      const raw = await AsyncStorage.getItem(LOCAL_VOL_KEY);
      const existentes = raw ? JSON.parse(raw) : [];
      existentes.push({ ...dados, id: `local_${Date.now()}` });
      await AsyncStorage.setItem(LOCAL_VOL_KEY, JSON.stringify(existentes));
      return;
    }
    await api.post('/voluntariado/solicitacoes', dados);
  },
};
