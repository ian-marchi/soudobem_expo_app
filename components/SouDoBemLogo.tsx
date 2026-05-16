import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { useThemeColors } from '../contexts/ThemeContext';

interface SouDoBemLogoProps {
  size?: 'large' | 'medium' | 'small';
  style?: ViewStyle;
}

export function SouDoBemLogo({ size = 'large', style }: SouDoBemLogoProps) {
  const c = useThemeColors();
  const iconSize = size === 'large' ? 80 : size === 'medium' ? 56 : 36;
  const titleSize = size === 'large' ? 26 : size === 'medium' ? 20 : 14;
  const subtitleSize = size === 'large' ? 26 : size === 'medium' ? 20 : 14;

  return (
    <View style={[styles.container, style]}>
      <Svg width={iconSize} height={iconSize} viewBox="0 0 100 100">
        {/* Arco superior de proteção */}
        <Path
          d="M20 45 Q20 15 50 15 Q80 15 80 45"
          stroke={c.text}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        {/* Coração laranja */}
        <Path
          d="M50 72 Q30 58 30 44 Q30 36 38 36 Q44 36 50 42 Q56 36 62 36 Q70 36 70 44 Q70 58 50 72Z"
          fill={Colors.orange}
        />
        {/* Nó/laço no centro */}
        <Path
          d="M44 52 Q50 46 56 52 Q50 58 44 52Z"
          fill={Colors.white}
          opacity="0.8"
        />
        {/* Mão esquerda */}
        <Path
          d="M18 60 Q24 50 34 54"
          stroke={c.text}
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M18 68 Q14 58 18 60"
          stroke={c.text}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        {/* Mão direita */}
        <Path
          d="M82 60 Q76 50 66 54"
          stroke={c.text}
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M82 68 Q86 58 82 60"
          stroke={c.text}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        {/* Pontos turquesa decorativos */}
        <Circle cx="28" cy="28" r="3" fill={Colors.turquoise} />
        <Circle cx="72" cy="28" r="3" fill={Colors.turquoise} />
        <Circle cx="20" cy="40" r="2" fill={Colors.turquoise} />
        <Circle cx="80" cy="40" r="2" fill={Colors.turquoise} />
      </Svg>

      {size !== 'small' && (
        <View style={styles.wordmark}>
          <Text style={[styles.wordmarkSou, { fontSize: titleSize, color: c.text }]}>Sou do </Text>
          <Text style={[styles.wordmarkBem, { fontSize: subtitleSize }]}>Bem</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  wordmark: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  wordmarkSou: {
    fontFamily: 'Nunito_700Bold',
    color: Colors.darkGray,
  },
  wordmarkBem: {
    fontFamily: 'Nunito_700Bold',
    color: Colors.orange,
  },
});
