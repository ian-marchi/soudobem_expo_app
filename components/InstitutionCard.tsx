import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ViewStyle } from 'react-native';
import { Typography } from '../constants/Typography';
import { Shadows } from '../constants/Shadows';
import { PillButton } from './PillButton';
import { Instituicao } from '../data/localData';
import { getInstitutionAvatar } from '../data/institutionImages';
import { useThemeColors } from '../contexts/ThemeContext';

const CARD_WIDTH = Dimensions.get('window').width * 0.72;

interface InstitutionCardProps {
  instituicao: Instituicao;
  onPress: () => void;
  onApoiar: () => void;
  style?: ViewStyle;
}

export function InstitutionCard({ instituicao, onPress, onApoiar, style }: InstitutionCardProps) {
  const c = useThemeColors();
  const avatar = getInstitutionAvatar(instituicao.slug ?? instituicao.id);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: c.card }, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={avatar} style={styles.avatar} resizeMode="cover" />
        ) : (
          <View style={[styles.avatar, { backgroundColor: c.orangeLight, alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={[styles.avatarInitial, { color: c.orange }]}>
              {instituicao.nome_exibicao.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.name, { color: c.text }]} numberOfLines={2}>
        {instituicao.nome_exibicao}
      </Text>

      <Text style={[styles.location, { color: c.textMuted }]} numberOfLines={1}>
        {instituicao.cidade} - {instituicao.estado}
      </Text>

      <Text style={[styles.desc, { color: c.textMuted }]} numberOfLines={2}>
        {instituicao.descricao}
      </Text>

      <PillButton label="Apoiar" onPress={onApoiar} style={styles.button} small />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 20,
    width: CARD_WIDTH,
    alignItems: 'center',
    gap: 8,
    ...Shadows.cardLarge,
  } as ViewStyle,
  avatarContainer: {
    marginBottom: 4,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  avatarInitial: {
    ...Typography.displayMedium,
  },
  name: {
    ...Typography.titleSmall,
    textAlign: 'center',
  },
  location: {
    ...Typography.bodySmall,
    textAlign: 'center',
  },
  desc: {
    ...Typography.bodySmall,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginTop: 6,
  } as ViewStyle,
});
