import { api, isLocalMode } from './api';
import { INSTITUICOES_LOCAL, Instituicao } from '../data/localData';

export type { Instituicao };

export const instituicoesService = {
  async listar(): Promise<Instituicao[]> {
    if (isLocalMode()) {
      return INSTITUICOES_LOCAL;
    }
    return api.get<Instituicao[]>('/instituicoes');
  },

  async buscarPorSlug(slug: string): Promise<Instituicao | null> {
    if (isLocalMode()) {
      return INSTITUICOES_LOCAL.find((i) => i.slug === slug || i.id === slug) ?? null;
    }
    try {
      return await api.get<Instituicao>(`/instituicoes/${slug}`);
    } catch {
      return null;
    }
  },

  async criar(formData: FormData): Promise<Instituicao> {
    return api.postForm<Instituicao>('/instituicoes', formData);
  },

  async atualizar(slug: string, formData: FormData): Promise<Instituicao> {
    return api.putForm<Instituicao>(`/instituicoes/${slug}`, formData);
  },
};
