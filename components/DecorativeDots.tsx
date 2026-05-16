import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColors } from '../contexts/ThemeContext';

interface DecorativeDotsProps {
  style?: ViewStyle;
  size?: 'small' | 'medium';
}

export function DecorativeDots({ style, size = 'medium' }: DecorativeDotsProps) {
  const c = useThemeColors();
  const dotSize = size === 'small' ? 6 : 8;
  const smallDot = size === 'small' ? 4 : 6;
  const t = c.turquoise;
  const g = c.border;

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <View style={[styles.dot, { width: dotSize, height: dotSize, backgroundColor: t, top: 0, right: 16 }]} />
      <View style={[styles.dot, { width: smallDot, height: smallDot, backgroundColor: g, top: 14, right: 4 }]} />
      <View style={[styles.dot, { width: dotSize, height: dotSize, backgroundColor: g, top: 28, right: 24 }]} />
      <View style={[styles.dot, { width: smallDot, height: smallDot, backgroundColor: t, top: 42, right: 10 }]} />
      <View style={[styles.dot, { width: dotSize, height: dotSize, backgroundColor: t, top: 56, right: 30 }]} />
      <View style={[styles.dot, { width: smallDot, height: smallDot, backgroundColor: g, top: 70, right: 18 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 90,
    position: 'absolute',
  } as ViewStyle,
  dot: {
    position: 'absolute',
    borderRadius: 999,
  } as ViewStyle,
});
