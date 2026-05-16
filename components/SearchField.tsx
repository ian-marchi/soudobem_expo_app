import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../constants/Typography';
import { useThemeColors } from '../contexts/ThemeContext';

interface SearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export function SearchField({ value, onChangeText, placeholder = 'Buscar...', style }: SearchFieldProps) {
  const c = useThemeColors();
  return (
    <View style={[styles.container, { backgroundColor: c.inputBg }, style]}>
      <Ionicons name="search" size={20} color={c.orange} />
      <TextInput
        style={[styles.input, { color: c.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.placeholder}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    height: 48,
    paddingHorizontal: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    ...Typography.bodyMedium,
  },
});
