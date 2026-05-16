// Cores de marca (fixas em ambos os temas)
export const Brand = {
  orange: '#FF7A00',
  turquoise: '#80CBC4',
  turquoiseStrong: '#21B7BE',
  white: '#FFFFFF',
  error: '#E53935',
} as const;

// Tokens semânticos por tema
export interface ThemeColors {
  orange: string;
  orangeLight: string;
  turquoise: string;
  turquoiseStrong: string;
  white: string;
  error: string;
  success: string;
  // semânticos
  background: string;
  card: string;
  text: string;
  textMuted: string;
  inputBg: string;
  border: string;
  placeholder: string;
  shadowColor: string;
  // aliases legados
  darkGray: string;
  structuralGray: string;
}

export const lightColors: ThemeColors = {
  orange: Brand.orange,
  orangeLight: '#FFF0E0',
  turquoise: Brand.turquoise,
  turquoiseStrong: Brand.turquoiseStrong,
  white: Brand.white,
  error: Brand.error,
  success: Brand.turquoiseStrong,
  background: '#FAF9F6',
  card: '#FFFFFF',
  text: '#424242',
  textMuted: '#757575',
  inputBg: '#ECECEC',
  border: '#E0E0E0',
  placeholder: '#9E9E9E',
  shadowColor: '#000000',
  darkGray: '#424242',
  structuralGray: '#E0E0E0',
};

export const darkColors: ThemeColors = {
  orange: Brand.orange,
  orangeLight: '#3A2A1A',
  turquoise: Brand.turquoise,
  turquoiseStrong: Brand.turquoiseStrong,
  white: Brand.white,
  error: '#EF5350',
  success: Brand.turquoiseStrong,
  background: '#161616',
  card: '#242424',
  text: '#F2F2F2',
  textMuted: '#A8A8A8',
  inputBg: '#333333',
  border: '#3D3D3D',
  placeholder: '#7A7A7A',
  shadowColor: '#000000',
  darkGray: '#F2F2F2',
  structuralGray: '#3D3D3D',
};

// Compatibilidade: export estático (tema claro) para código legado
export const Colors = lightColors;
export type ColorName = keyof ThemeColors;

export default Colors;
