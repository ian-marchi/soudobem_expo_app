import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Typography } from '../constants/Typography';
import { PillButton } from '../components/PillButton';
import { useAuth } from '../contexts/AuthContext';
import { useThemeColors } from '../contexts/ThemeContext';
import { BRAND_COLORIDO } from '../data/institutionImages';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { user, loading } = useAuth();
  const c = useThemeColors();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/(tabs)/home');
    }
  }, [user, loading]);

  if (loading) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <View style={styles.container}>
        <View style={styles.logoSection}>
          <Image source={BRAND_COLORIDO} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={[styles.slogan, { color: c.text }]}>
          Transformando intenção em ação.{'\n'}
          Ajudando quem{'\n'}
          mais precisa.
        </Text>

        <View style={styles.ctaSection}>
          <PillButton
            label="Quero Ajudar"
            onPress={() => router.push({ pathname: '/auth', params: { mode: 'cadastro' } })}
            variant="orange"
            style={styles.mainButton}
          />

          <TouchableOpacity
            onPress={() => router.push({ pathname: '/auth', params: { mode: 'login' } })}
            style={styles.secondaryLink}
          >
            <Text style={[styles.secondaryText, { color: c.text }]}>
              *Já sou doador / Entrar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: width * 0.7,
    height: width * 0.7,
  },
  slogan: {
    ...Typography.titleMedium,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 28,
  },
  ctaSection: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  mainButton: { width: width * 0.82 },
  secondaryLink: { paddingVertical: 8 },
  secondaryText: {
    ...Typography.bodyMedium,
    textDecorationLine: 'underline',
  },
});
