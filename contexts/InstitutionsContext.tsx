import React, { createContext, useContext, useEffect, useState } from 'react';
import { Instituicao, instituicoesService } from '../services/instituicoes';

interface InstitutionsContextValue {
  instituicoes: Instituicao[];
  loading: boolean;
  reload: () => Promise<void>;
  buscarPorSlug: (slug: string) => Instituicao | undefined;
}

const InstitutionsContext = createContext<InstitutionsContextValue | null>(null);

export function InstitutionsProvider({ children }: { children: React.ReactNode }) {
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await instituicoesService.listar();
      setInstituicoes(data);
    } catch (e) {
      console.warn('Falha ao carregar instituições:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const buscarPorSlug = (slug: string) =>
    instituicoes.find((i) => i.slug === slug || i.id === slug);

  return (
    <InstitutionsContext.Provider value={{ instituicoes, loading, reload: load, buscarPorSlug }}>
      {children}
    </InstitutionsContext.Provider>
  );
}

export function useInstitutions() {
  const ctx = useContext(InstitutionsContext);
  if (!ctx) throw new Error('useInstitutions deve ser usado dentro de InstitutionsProvider');
  return ctx;
}
