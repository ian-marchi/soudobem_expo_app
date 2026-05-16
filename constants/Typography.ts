import { TextStyle } from 'react-native';

export const FontFamily = {
  regular: 'Nunito_400Regular',
  medium: 'Nunito_500Medium',
  semiBold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
};

export const Typography = {
  displayLarge: {
    fontFamily: FontFamily.bold,
    fontSize: 28,
    lineHeight: 36,
  } as TextStyle,
  displayMedium: {
    fontFamily: FontFamily.bold,
    fontSize: 24,
    lineHeight: 32,
  } as TextStyle,
  titleLarge: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    lineHeight: 28,
  } as TextStyle,
  titleMedium: {
    fontFamily: FontFamily.semiBold,
    fontSize: 18,
    lineHeight: 24,
  } as TextStyle,
  titleSmall: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    lineHeight: 22,
  } as TextStyle,
  bodyLarge: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
  } as TextStyle,
  bodyMedium: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  } as TextStyle,
  bodySmall: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
  } as TextStyle,
  labelLarge: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
  } as TextStyle,
  labelSmall: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
  } as TextStyle,
  monetaryValue: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    lineHeight: 26,
  } as TextStyle,
  buttonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    lineHeight: 22,
  } as TextStyle,
};
