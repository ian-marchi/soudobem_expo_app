import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Brand } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Shadows } from '../constants/Shadows';
import { useThemeColors } from '../contexts/ThemeContext';

type Variant = 'orange' | 'turquoise' | 'outline' | 'ghost';

interface PillButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  small?: boolean;
}

export function PillButton({
  label,
  onPress,
  variant = 'orange',
  loading = false,
  disabled = false,
  style,
  textStyle,
  small = false,
}: PillButtonProps) {
  const c = useThemeColors();

  const bgByVariant: Record<Variant, string> = {
    orange: c.orange,
    turquoise: c.turquoiseStrong,
    outline: c.card,
    ghost: 'transparent',
  };

  const isLight = variant === 'orange' || variant === 'turquoise';

  const containerStyle = [
    styles.base,
    small && styles.small,
    { backgroundColor: bgByVariant[variant] },
    variant === 'outline' && { borderWidth: 2, borderColor: c.orange },
    variant === 'ghost' && styles.ghost,
    disabled && styles.disabled,
    style,
  ];

  const labelColor =
    variant === 'orange' || variant === 'turquoise'
      ? Brand.white
      : c.orange;

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isLight ? Brand.white : c.orange} />
      ) : (
        <Text style={[styles.label, small && styles.labelSmall, { color: labelColor }, textStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    ...Shadows.card,
  } as ViewStyle,
  small: {
    height: 44,
    paddingHorizontal: 20,
  } as ViewStyle,
  ghost: {
    shadowOpacity: 0,
    elevation: 0,
  } as ViewStyle,
  disabled: {
    opacity: 0.5,
  } as ViewStyle,
  label: {
    ...Typography.buttonText,
  } as TextStyle,
  labelSmall: {
    fontSize: 14,
  } as TextStyle,
});
