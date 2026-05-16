import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Shadows } from '../constants/Shadows';
import { useThemeColors } from '../contexts/ThemeContext';

interface WhiteCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  large?: boolean;
}

export function WhiteCard({ children, style, large = false }: WhiteCardProps) {
  const c = useThemeColors();
  return (
    <View
      style={[
        styles.card,
        large && styles.cardLarge,
        { backgroundColor: c.card },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    ...Shadows.card,
  } as ViewStyle,
  cardLarge: {
    borderRadius: 24,
    ...Shadows.cardLarge,
  } as ViewStyle,
});
