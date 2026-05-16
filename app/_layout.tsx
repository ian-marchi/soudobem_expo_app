import { useFonts } from 'expo-font';
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../contexts/AuthContext';
import { InstitutionsProvider } from '../contexts/InstitutionsContext';
import { ThemeProvider } from '../contexts/ThemeContext';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <AuthProvider>
        <InstitutionsProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="instituicao/[slug]" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="doacao/valor" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="doacao/pix" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="doacao/agradecimento" options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
            <Stack.Screen name="voluntariado/interesse" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="voluntariado/realizado" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="voluntariado/agradecimento" options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
            <Stack.Screen name="admin/cadastrar-instituicao" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="admin/editar-instituicao" options={{ animation: 'slide_from_right' }} />
          </Stack>
        </InstitutionsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
