import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../constants/Typography';
import { PillButton } from '../../components/PillButton';
import { WhiteCard } from '../../components/WhiteCard';
import { SouDoBemLogo } from '../../components/SouDoBemLogo';
import { DecorativeDots } from '../../components/DecorativeDots';
import { useInstitutions } from '../../contexts/InstitutionsContext';
import { useThemeColors } from '../../contexts/ThemeContext';
import { BRAND_AZUL } from '../../data/institutionImages';

const { width } = Dimensions.get('window');

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function AgradecimentoScreen() {
  const params = useLocalSearchParams<{
    slug: string;
    valor: string;
    data: string;
    hora: string;
    metodo: string;
    nome_usuario: string;
  }>();

  const { buscarPorSlug } = useInstitutions();
  const c = useThemeColors();
  const inst = params.slug ? buscarPorSlug(params.slug) : undefined;
  const valor = parseFloat(params.valor ?? '0');

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <SouDoBemLogo size="small" />
          <TouchableOpacity onPress={() => router.replace('/(tabs)/home')} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={c.text} />
          </TouchableOpacity>
        </View>

        {/* Imagem de marca pós-doação */}
        <Image source={BRAND_AZUL} style={styles.brandImage} resizeMode="contain" />

        <Text style={[styles.title, { color: c.text }]}>Doação Realizada{'\n'}com Sucesso!</Text>

        <WhiteCard style={styles.receiptCard} large>
          <View style={styles.receiptTop}>
            <View style={[styles.receiptAvatar, { backgroundColor: c.orangeLight }]}>
              <Text style={[styles.receiptAvatarText, { color: c.orange }]}>
                {(inst?.nome_exibicao ?? 'I').charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.receiptInfo}>
              <Text style={[styles.receiptInst, { color: c.text }]}>
                {inst?.nome_exibicao ?? 'Instituição'}
              </Text>
              <Text style={[styles.receiptValue, { color: c.orange }]}>{formatBRL(valor)}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: c.border }]} />

          <View style={styles.receiptMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color={c.textMuted} />
              <Text style={[styles.metaText, { color: c.textMuted }]}>Data: {params.data}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="card-outline" size={14} color={c.textMuted} />
              <Text style={[styles.metaText, { color: c.textMuted }]}>Método: {params.metodo}</Text>
            </View>
          </View>
        </WhiteCard>

        <Text style={[styles.thankYou, { color: c.textMuted }]}>
          Obrigado por sua generosidade, {params.nome_usuario?.split(' ')[0] ?? 'amigo'}!
          {'\n'}Sua contribuição ajudará a transformar vidas em{' '}
          {inst?.cidade ?? 'nossa comunidade'}.
        </Text>

        <DecorativeDots style={styles.dots} />

        <PillButton
          label="Explorar Mais Causas"
          onPress={() => router.replace('/(tabs)/explorar')}
          variant="orange"
          style={styles.ctaBtn}
        />

        <TouchableOpacity onPress={() => router.replace('/(tabs)/home')} style={styles.homeLink}>
          <Text style={[styles.homeLinkText, { color: c.textMuted }]}>Voltar ao início</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 24, gap: 20, paddingBottom: 40, alignItems: 'center' },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  closeBtn: { padding: 8 },
  brandImage: { width: width * 0.55, height: width * 0.55, marginVertical: 8 },
  title: { ...Typography.displayLarge, textAlign: 'center' },
  receiptCard: { width: '100%', gap: 16, padding: 20 },
  receiptTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  receiptAvatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  receiptAvatarText: { ...Typography.titleMedium, fontSize: 22 },
  receiptInfo: { flex: 1, gap: 4 },
  receiptInst: { ...Typography.titleSmall },
  receiptValue: { fontFamily: 'Nunito_800ExtraBold', fontSize: 22 },
  divider: { height: 1 },
  receiptMeta: { flexDirection: 'row', gap: 20, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { ...Typography.bodySmall },
  thankYou: { ...Typography.bodyLarge, textAlign: 'center', lineHeight: 26 },
  dots: { position: 'relative', top: 0, right: 0 },
  ctaBtn: { width: '100%' },
  homeLink: { paddingVertical: 8 },
  homeLinkText: { ...Typography.bodyMedium, textDecorationLine: 'underline' },
});
