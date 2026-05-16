import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Share,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../constants/Typography';
import { Shadows } from '../../constants/Shadows';
import { PillButton } from '../../components/PillButton';
import { FloatingHeader } from '../../components/FloatingHeader';
import { DecorativeDots } from '../../components/DecorativeDots';
import { WhiteCard } from '../../components/WhiteCard';
import { YoutubePlayer } from '../../components/YoutubePlayer';
import { useInstitutions } from '../../contexts/InstitutionsContext';
import { useThemeColors } from '../../contexts/ThemeContext';
import { Instituicao } from '../../data/localData';
import { getInstitutionImages } from '../../data/institutionImages';

const { width } = Dimensions.get('window');
const MEDIA_WIDTH = width - 40;

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function InstitutionDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { buscarPorSlug, instituicoes } = useInstitutions();
  const c = useThemeColors();
  const [inst, setInst] = useState<Instituicao | undefined>(undefined);
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (slug) setInst(buscarPorSlug(slug));
  }, [slug, instituicoes]);

  if (!inst) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
        <FloatingHeader title="Carregando..." onBack={() => router.back()} />
        <Text style={[styles.notFound, { color: c.textMuted }]}>Instituição não encontrada.</Text>
      </SafeAreaView>
    );
  }

  const fotos = getInstitutionImages(inst.slug ?? inst.id);
  const youtubeId = inst.video_youtube ? extractYouTubeId(inst.video_youtube) : null;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Conheça a ${inst.nome_exibicao} no app Sou do Bem! Ajude quem mais precisa.`,
        title: inst.nome_exibicao,
      });
    } catch {}
  };

  const goToSlide = (idx: number) => {
    listRef.current?.scrollToOffset({ offset: idx * MEDIA_WIDTH, animated: true });
    setActiveIndex(idx);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <FloatingHeader
          title={inst.nome_exibicao}
          onBack={() => router.back()}
          onShare={handleShare}
          style={styles.header}
        />

        <View style={styles.headlineRow}>
          <View style={styles.headlineBlock}>
            <Text style={[styles.subLabel, { color: c.turquoiseStrong }]}>Instituição</Text>
            <Text style={[styles.headline, { color: c.text }]}>Conheça nossa{'\n'}instituição</Text>
          </View>
          <DecorativeDots style={styles.dots} />
        </View>

        {/* Carrossel de fotos reais */}
        <View>
          {fotos.length > 0 ? (
            <>
              <FlatList
                ref={listRef}
                data={fotos}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, i) => String(i)}
                onMomentumScrollEnd={(e) =>
                  setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / MEDIA_WIDTH))
                }
                renderItem={({ item }) => (
                  <Image source={item} style={styles.mediaImage} resizeMode="cover" />
                )}
              />
              {fotos.length > 1 && (
                <View style={styles.dotsRow}>
                  {fotos.map((_, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => goToSlide(i)}
                      style={[
                        styles.pageDot,
                        { backgroundColor: i === activeIndex ? c.orange : c.border },
                      ]}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={[styles.mediaPlaceholder, { backgroundColor: c.inputBg }]}>
              <Ionicons name="image-outline" size={48} color={c.textMuted} />
            </View>
          )}

          {youtubeId && (
            <View style={styles.videoSection}>
              <View style={styles.videoLabelRow}>
                <Ionicons name="logo-youtube" size={18} color="#FF0000" />
                <Text style={[styles.videoBtnText, { color: c.text }]}>
                  Vídeo institucional
                </Text>
              </View>
              <YoutubePlayer
                videoId={youtubeId}
                width={MEDIA_WIDTH}
                style={styles.videoPlayer}
              />
            </View>
          )}
        </View>

        {/* Descrição */}
        <WhiteCard style={styles.descCard}>
          <Text style={[styles.descTitle, { color: c.text }]}>{inst.nome_exibicao}</Text>
          <Text style={[styles.descLocation, { color: c.textMuted }]}>
            {inst.cidade} — {inst.estado}
          </Text>
          <Text style={[styles.descText, { color: c.textMuted }]}>{inst.descricao}</Text>

          {inst.endereco ? (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color={c.textMuted} />
              <Text style={[styles.infoText, { color: c.textMuted }]}>{inst.endereco}</Text>
            </View>
          ) : null}
        </WhiteCard>

        {/* Chips de confiança */}
        <View style={styles.chipsRow}>
          <View style={[styles.chip, { backgroundColor: c.card }]}>
            <Ionicons name="lock-closed-outline" size={14} color={c.turquoiseStrong} />
            <Text style={[styles.chipText, { color: c.turquoiseStrong }]}>Doação segura</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: c.card }]}>
            <Ionicons name="stats-chart-outline" size={14} color={c.turquoiseStrong} />
            <Text style={[styles.chipText, { color: c.turquoiseStrong }]}>Histórico automático</Text>
          </View>
        </View>

        {/* Ações */}
        <WhiteCard style={styles.actionsCard} large>
          <PillButton
            label="Faça uma doação"
            onPress={() => router.push({ pathname: '/doacao/valor', params: { slug: inst.slug ?? inst.id } })}
            variant="orange"
          />
          <PillButton
            label="Trabalho voluntário"
            onPress={() => router.push({ pathname: '/voluntariado/interesse', params: { slug: inst.slug ?? inst.id } })}
            variant="outline"
          />
          <PillButton
            label="Já realizei o trabalho"
            onPress={() => router.push({ pathname: '/voluntariado/realizado', params: { slug: inst.slug ?? inst.id } })}
            variant="ghost"
            small
          />
        </WhiteCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 32, gap: 20 },
  header: { marginTop: 16 },
  headlineRow: { paddingHorizontal: 20, flexDirection: 'row', position: 'relative' },
  headlineBlock: { gap: 4 },
  subLabel: { ...Typography.labelSmall, textTransform: 'uppercase', letterSpacing: 1 },
  headline: { ...Typography.displayMedium },
  dots: { position: 'absolute', right: 0, top: 0 },
  mediaImage: {
    width: MEDIA_WIDTH,
    height: 210,
    borderRadius: 16,
    marginHorizontal: 20,
  },
  mediaPlaceholder: {
    marginHorizontal: 20,
    height: 210,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  pageDot: { width: 8, height: 8, borderRadius: 4 },
  videoSection: { marginTop: 16, marginHorizontal: 20, gap: 8 },
  videoLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  videoBtnText: { ...Typography.labelLarge },
  videoPlayer: { alignSelf: 'center' },
  descCard: { marginHorizontal: 20, gap: 8 },
  descTitle: { ...Typography.titleMedium },
  descLocation: { ...Typography.bodySmall },
  descText: { ...Typography.bodyMedium, lineHeight: 22, marginTop: 4 },
  infoRow: { flexDirection: 'row', gap: 6, alignItems: 'flex-start', marginTop: 4 },
  infoText: { ...Typography.bodySmall, flex: 1 },
  chipsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    ...Shadows.card,
  },
  chipText: { ...Typography.labelSmall },
  actionsCard: { marginHorizontal: 20, gap: 12, padding: 20 },
  notFound: { ...Typography.bodyMedium, textAlign: 'center', marginTop: 40 },
});
