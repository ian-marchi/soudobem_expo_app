import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../constants/Typography';
import { Shadows } from '../../constants/Shadows';
import { SearchField } from '../../components/SearchField';
import { InstitutionCard } from '../../components/InstitutionCard';
import { DecorativeDots } from '../../components/DecorativeDots';
import { WhiteCard } from '../../components/WhiteCard';
import { useAuth } from '../../contexts/AuthContext';
import { useInstitutions } from '../../contexts/InstitutionsContext';
import { useThemeColors } from '../../contexts/ThemeContext';
import { Instituicao } from '../../data/localData';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const { instituicoes, loading } = useInstitutions();
  const c = useThemeColors();
  const [busca, setBusca] = useState('');

  const firstName = user?.nome?.split(' ')[0] ?? 'Visitante';

  const destaque = instituicoes.filter((i) => i.destaque);
  const filtered = busca.trim()
    ? destaque.filter(
        (i) =>
          i.nome_exibicao.toLowerCase().includes(busca.toLowerCase()) ||
          i.cidade.toLowerCase().includes(busca.toLowerCase())
      )
    : destaque;

  const handleCard = (inst: Instituicao) => {
    router.push(`/instituicao/${inst.slug ?? inst.id}`);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Card superior flutuante — maior e mais para baixo */}
        <WhiteCard style={[styles.topCard, { ...Shadows.topBar }]}>
          <View style={styles.greetingRow}>
            <View style={styles.greetingLeft}>
              <Text style={[styles.greetingSmall, { color: c.textMuted }]}>Bem-vindo de volta,</Text>
              <Text style={[styles.greetingName, { color: c.text }]}>Olá, {firstName}!</Text>
              <Text style={[styles.greetingDesc, { color: c.textMuted }]}>
                Descubra causas que precisam de você
              </Text>
            </View>
            <View style={styles.greetingIcons}>
              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons name="person-circle-outline" size={30} color={c.text} />
              </TouchableOpacity>
              <View style={styles.bellWrapper}>
                <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name="notifications-outline" size={28} color={c.text} />
                </TouchableOpacity>
                <View style={[styles.badge, { backgroundColor: c.turquoiseStrong }]}>
                  <Text style={styles.badgeText}>1</Text>
                </View>
              </View>
            </View>
          </View>

          <SearchField value={busca} onChangeText={setBusca} placeholder="Buscar instituições..." />
        </WhiteCard>

        {/* Título da seção */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleBlock}>
            <Text style={[styles.sectionSmall, { color: c.turquoiseStrong }]}>Curadoria do app</Text>
            <Text style={[styles.sectionTitle, { color: c.text }]}>Instituições em{'\n'}Destaque</Text>
          </View>
          <DecorativeDots style={styles.dots} />
        </View>

        {loading ? (
          <Text style={[styles.helperText, { color: c.textMuted }]}>Carregando...</Text>
        ) : filtered.length === 0 ? (
          <Text style={[styles.helperText, { color: c.textMuted }]}>Nenhuma instituição encontrada.</Text>
        ) : (
          <FlatList
            data={filtered}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.carousel}
            snapToInterval={width * 0.72 + 16}
            decelerationRate="fast"
            renderItem={({ item }) => (
              <InstitutionCard
                instituicao={item}
                onPress={() => handleCard(item)}
                onApoiar={() => handleCard(item)}
              />
            )}
          />
        )}

        <Text style={[styles.swipeHint, { color: c.placeholder }]}>← Arraste para ver mais →</Text>

        <WhiteCard style={styles.trustBlock}>
          <View style={styles.trustRow}>
            <Ionicons name="shield-checkmark-outline" size={24} color={c.turquoiseStrong} />
            <View style={styles.trustText}>
              <Text style={[styles.trustTitle, { color: c.text }]}>Doe com mais confiança</Text>
              <Text style={[styles.trustBody, { color: c.textMuted }]}>
                Todas as instituições são verificadas e seu histórico fica salvo automaticamente.
              </Text>
            </View>
          </View>
        </WhiteCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 24, gap: 22 },
  topCard: {
    marginHorizontal: 20,
    marginTop: 52,
    gap: 18,
    borderRadius: 24,
    paddingVertical: 22,
    paddingHorizontal: 18,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  greetingLeft: { gap: 4, flex: 1 },
  greetingSmall: { ...Typography.bodySmall },
  greetingName: { ...Typography.displayMedium },
  greetingDesc: { ...Typography.bodySmall, marginTop: 2 },
  greetingIcons: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconBtn: { padding: 4 },
  bellWrapper: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { ...Typography.labelSmall, color: '#FFFFFF', fontSize: 10 },
  sectionHeader: { flexDirection: 'row', paddingHorizontal: 20, position: 'relative' },
  sectionTitleBlock: { flex: 1, gap: 4 },
  sectionSmall: { ...Typography.labelSmall, textTransform: 'uppercase', letterSpacing: 1 },
  sectionTitle: { ...Typography.displayMedium },
  dots: { top: 0, right: 0 },
  carousel: { paddingHorizontal: 20, gap: 16 },
  helperText: { ...Typography.bodyMedium, textAlign: 'center', paddingHorizontal: 20 },
  swipeHint: { ...Typography.bodySmall, textAlign: 'center' },
  trustBlock: { marginHorizontal: 20 },
  trustRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  trustText: { flex: 1, gap: 4 },
  trustTitle: { ...Typography.titleSmall },
  trustBody: { ...Typography.bodySmall },
});
