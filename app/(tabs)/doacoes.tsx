import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../constants/Typography';
import { Shadows } from '../../constants/Shadows';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeColors } from '../../contexts/ThemeContext';
import { historicoService, RegistroHistorico } from '../../services/historico';

type Periodo = 'semanal' | 'mensal' | 'anual' | 'tudo';

const PERIODOS: { key: Periodo; label: string }[] = [
  { key: 'semanal', label: 'Semana' },
  { key: 'mensal', label: 'Mês' },
  { key: 'anual', label: 'Ano' },
  { key: 'tudo', label: 'Tudo' },
];

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function parseDateBR(s: string): Date {
  if (s.includes('/')) {
    const [d, m, y] = s.split('/');
    return new Date(`${y}-${m}-${d}`);
  }
  return new Date(s);
}

function filterByPeriodo(records: RegistroHistorico[], periodo: Periodo): RegistroHistorico[] {
  if (periodo === 'tudo') return records;
  const now = new Date();
  return records.filter((r) => {
    const d = parseDateBR(r.data);
    if (periodo === 'semanal') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return d >= weekAgo;
    }
    if (periodo === 'mensal') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    return d.getFullYear() === now.getFullYear();
  });
}

export default function DoacoesScreen() {
  const { user } = useAuth();
  const c = useThemeColors();
  const [historico, setHistorico] = useState<RegistroHistorico[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState<Periodo>('mensal');

  useEffect(() => {
    if (user) {
      historicoService.listar(user.email).then(setHistorico).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const filtered = useMemo(() => filterByPeriodo(historico, periodo), [historico, periodo]);
  const totalDoado = useMemo(
    () => filtered.filter((r) => r.tipo === 'pix').reduce((a, r) => a + (r.valor ?? 0), 0),
    [filtered]
  );
  const qtdPix = filtered.filter((r) => r.tipo === 'pix').length;
  const qtdVol = filtered.filter((r) => r.tipo === 'voluntariado').length;
  const instituicoesUnicas = new Set(filtered.map((r) => r.instituicao_nome)).size;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Cabeçalho simples */}
        <View style={styles.pageHeader}>
          <Text style={[styles.pageEyebrow, { color: c.turquoiseStrong }]}>SEU IMPACTO</Text>
          <Text style={[styles.pageTitle, { color: c.text }]}>Minhas Doações</Text>
        </View>

        {/* Hero card azul */}
        <View style={[styles.hero, { backgroundColor: c.turquoiseStrong }]}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroLabel}>Total doado</Text>
              <Text style={styles.heroValue}>{formatBRL(totalDoado)}</Text>
            </View>
            <View style={styles.heroIcon}>
              <Ionicons name="heart" size={28} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>{qtdPix}</Text>
              <Text style={styles.heroStatLabel}>Doações PIX</Text>
            </View>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>{qtdVol}</Text>
              <Text style={styles.heroStatLabel}>Voluntariados</Text>
            </View>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>{instituicoesUnicas}</Text>
              <Text style={styles.heroStatLabel}>Instituições</Text>
            </View>
          </View>
        </View>

        {/* Filtro de período segmentado */}
        <View style={[styles.segment, { backgroundColor: c.inputBg }]}>
          {PERIODOS.map((p) => {
            const active = periodo === p.key;
            return (
              <TouchableOpacity
                key={p.key}
                style={[styles.segmentBtn, active && { backgroundColor: c.card, ...Shadows.card }]}
                onPress={() => setPeriodo(p.key)}
              >
                <Text style={[styles.segmentText, { color: active ? c.turquoiseStrong : c.textMuted }]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Timeline de atividade */}
        <Text style={[styles.sectionTitle, { color: c.text }]}>Atividade recente</Text>

        {loading ? (
          <Text style={[styles.helper, { color: c.textMuted }]}>Carregando...</Text>
        ) : !user ? (
          <View style={styles.emptyBlock}>
            <Ionicons name="lock-closed-outline" size={44} color={c.border} />
            <Text style={[styles.helper, { color: c.textMuted }]}>
              Faça login para ver seu histórico.
            </Text>
            <TouchableOpacity onPress={() => router.push('/auth')}>
              <Text style={[styles.link, { color: c.turquoiseStrong }]}>Entrar</Text>
            </TouchableOpacity>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyBlock}>
            <Ionicons name="heart-outline" size={44} color={c.border} />
            <Text style={[styles.helper, { color: c.textMuted }]}>
              Nenhuma atividade neste período.{'\n'}Que tal começar agora?
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explorar')}>
              <Text style={[styles.link, { color: c.turquoiseStrong }]}>Explorar causas</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.timeline}>
            {filtered.map((r, idx) => {
              const isPix = r.tipo === 'pix';
              return (
                <View key={r.id} style={styles.timelineItem}>
                  {/* Linha + ponto */}
                  <View style={styles.timelineGutter}>
                    <View
                      style={[
                        styles.timelineDot,
                        { backgroundColor: isPix ? c.turquoiseStrong : c.turquoise },
                      ]}
                    >
                      <Ionicons
                        name={isPix ? 'cash' : 'people'}
                        size={14}
                        color="#FFFFFF"
                      />
                    </View>
                    {idx < filtered.length - 1 && (
                      <View style={[styles.timelineLine, { backgroundColor: c.border }]} />
                    )}
                  </View>

                  {/* Conteúdo */}
                  <View style={[styles.timelineCard, { backgroundColor: c.card }]}>
                    <View style={styles.timelineCardTop}>
                      <Text style={[styles.timelineInst, { color: c.text }]} numberOfLines={1}>
                        {r.instituicao_nome}
                      </Text>
                      {isPix && r.valor != null && (
                        <Text style={[styles.timelineValue, { color: c.turquoiseStrong }]}>
                          {formatBRL(r.valor)}
                        </Text>
                      )}
                    </View>
                    <View style={styles.timelineMeta}>
                      <Text style={[styles.timelineType, { color: c.textMuted }]}>
                        {isPix ? 'Doação via PIX' : 'Trabalho voluntário'}
                      </Text>
                      <Text style={[styles.timelineDate, { color: c.textMuted }]}>
                        {r.data} · {r.hora}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingTop: 28, gap: 20, paddingBottom: 40 },
  pageHeader: { gap: 2 },
  pageEyebrow: { ...Typography.labelSmall, letterSpacing: 1.5 },
  pageTitle: { ...Typography.displayMedium },
  hero: {
    borderRadius: 24,
    padding: 22,
    gap: 18,
    ...Shadows.cardLarge,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLabel: { ...Typography.bodyMedium, color: 'rgba(255,255,255,0.85)' },
  heroValue: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 34,
    color: '#FFFFFF',
    marginTop: 2,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.25)' },
  heroStatsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  heroStat: { alignItems: 'center', flex: 1 },
  heroStatNum: { fontFamily: 'Nunito_700Bold', fontSize: 20, color: '#FFFFFF' },
  heroStatLabel: { ...Typography.labelSmall, color: 'rgba(255,255,255,0.85)' },
  segment: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentText: { ...Typography.labelLarge },
  sectionTitle: { ...Typography.titleMedium },
  helper: { ...Typography.bodyMedium, textAlign: 'center', lineHeight: 22 },
  link: { ...Typography.titleSmall, textDecorationLine: 'underline', textAlign: 'center' },
  emptyBlock: { alignItems: 'center', gap: 14, marginTop: 40 },
  timeline: { gap: 0 },
  timelineItem: { flexDirection: 'row', gap: 14 },
  timelineGutter: { alignItems: 'center', width: 28 },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: { width: 2, flex: 1, marginVertical: 4 },
  timelineCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    gap: 6,
    ...Shadows.card,
  },
  timelineCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  timelineInst: { ...Typography.titleSmall, flex: 1 },
  timelineValue: { fontFamily: 'Nunito_700Bold', fontSize: 16 },
  timelineMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  timelineType: { ...Typography.bodySmall },
  timelineDate: { ...Typography.bodySmall },
});
