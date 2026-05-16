import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Brand } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { PillButton } from '../../components/PillButton';
import { WhiteCard } from '../../components/WhiteCard';
import { SouDoBemLogo } from '../../components/SouDoBemLogo';
import { DecorativeDots } from '../../components/DecorativeDots';
import { useInstitutions } from '../../contexts/InstitutionsContext';
import { useThemeColors } from '../../contexts/ThemeContext';

function VoluntarioIllustration() {
  return (
    <View style={{ alignItems: 'center', marginVertical: 16 }}>
      <Svg width={150} height={150} viewBox="0 0 160 160">
        <Circle cx="80" cy="80" r="72" fill={Brand.turquoise} opacity="0.12" />
        <Path
          d="M50 95 Q60 75 80 80 Q100 75 110 95"
          stroke={Brand.turquoiseStrong}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M80 72 Q65 60 65 50 Q65 42 72 42 Q77 42 80 47 Q83 42 88 42 Q95 42 95 50 Q95 60 80 72Z"
          fill={Brand.turquoiseStrong}
        />
        <Path d="M68 78 L76 86 L94 64" stroke="#FFFFFF" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="35" cy="110" r="4" fill={Brand.turquoise} />
        <Circle cx="125" cy="105" r="4" fill={Brand.orange} />
      </Svg>
    </View>
  );
}

export default function AgradecimentoVoluntariadoScreen() {
  const params = useLocalSearchParams<{ slug: string; data: string; hora: string }>();
  const { buscarPorSlug } = useInstitutions();
  const c = useThemeColors();
  const inst = params.slug ? buscarPorSlug(params.slug) : undefined;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <SouDoBemLogo size="small" />
          <TouchableOpacity onPress={() => router.replace('/(tabs)/home')} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={c.text} />
          </TouchableOpacity>
        </View>

        <VoluntarioIllustration />

        <Text style={[styles.title, { color: c.text }]}>Trabalho registrado{'\n'}com sucesso!</Text>

        <Text style={[styles.subtitle, { color: c.textMuted }]}>
          Obrigado por dedicar seu tempo e talento.{'\n'}
          Cada gesto de solidariedade transforma o mundo.
        </Text>

        <WhiteCard style={styles.card} large>
          <View style={styles.cardRow}>
            <Ionicons name="people-outline" size={22} color={c.turquoiseStrong} />
            <Text style={[styles.cardInst, { color: c.text }]}>
              {inst?.nome_exibicao ?? 'Instituição'}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Ionicons name="calendar-outline" size={18} color={c.textMuted} />
            <Text style={[styles.cardMeta, { color: c.textMuted }]}>
              {params.data} às {params.hora}
            </Text>
          </View>
          <View style={styles.statusChip}>
            <Text style={styles.statusText}>Pendente de confirmação</Text>
          </View>
        </WhiteCard>

        <DecorativeDots style={{ position: 'relative' }} />

        <PillButton
          label="Voltar ao início"
          onPress={() => router.replace('/(tabs)/home')}
          variant="orange"
          style={styles.btn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 24, gap: 20, paddingBottom: 40, alignItems: 'center' },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  closeBtn: { padding: 8 },
  title: { ...Typography.displayLarge, textAlign: 'center' },
  subtitle: { ...Typography.bodyLarge, textAlign: 'center', lineHeight: 26 },
  card: { width: '100%', gap: 12, padding: 20 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardInst: { ...Typography.titleSmall, flex: 1 },
  cardMeta: { ...Typography.bodyMedium },
  statusChip: {
    backgroundColor: '#FFF9C4',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  statusText: { ...Typography.labelSmall, color: '#F57F17' },
  btn: { width: '100%' },
});
