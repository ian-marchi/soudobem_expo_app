import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../constants/Typography';
import { Shadows } from '../constants/Shadows';
import { useThemeColors } from '../contexts/ThemeContext';

interface FloatingHeaderProps {
  title: string;
  onBack?: () => void;
  onShare?: () => void;
  style?: ViewStyle;
}

export function FloatingHeader({ title, onBack, onShare, style }: FloatingHeaderProps) {
  const c = useThemeColors();
  return (
    <View style={[styles.container, { backgroundColor: c.card }, style]}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={c.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconBtn} />
      )}

      <Text style={[styles.title, { color: c.text }]} numberOfLines={1}>{title}</Text>

      {onShare ? (
        <TouchableOpacity onPress={onShare} style={styles.iconBtn}>
          <Ionicons name="share-outline" size={22} color={c.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconBtn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 12,
    marginHorizontal: 20,
    ...Shadows.topBar,
  } as ViewStyle,
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  title: {
    flex: 1,
    ...Typography.titleSmall,
    textAlign: 'center',
  },
});
