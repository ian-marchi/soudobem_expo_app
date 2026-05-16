import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../constants/Typography';
import { Shadows } from '../constants/Shadows';
import { PillButton } from '../components/PillButton';
import { SouDoBemLogo } from '../components/SouDoBemLogo';
import { useAuth } from '../contexts/AuthContext';
import { useThemeColors } from '../contexts/ThemeContext';
import { isLocalMode } from '../services/api';

type AuthMode = 'login' | 'cadastro' | 'verificacao';

export default function AuthScreen() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const c = useThemeColors();
  const [mode, setMode] = useState<AuthMode>((params.mode as AuthMode) ?? 'login');
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);

  const [codigo, setCodigo] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [pendingNome, setPendingNome] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingSenha, setPendingSenha] = useState('');

  const { login, register, verifyCode, completeRegistration, resendCode } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha email e senha.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), senha);
      router.replace('/(tabs)/home');
    } catch (e: unknown) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao entrar.');
    } finally {
      setLoading(false);
    }
  };

  const handleCadastro = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      const res = await register(nome.trim(), email.trim(), senha);
      if (res.verification_id) {
        setPendingNome(nome.trim());
        setPendingEmail(email.trim());
        setPendingSenha(senha);
        setVerificationId(res.verification_id);
        setMode('verificacao');
      } else {
        router.replace('/(tabs)/home');
      }
    } catch (e: unknown) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificar = async () => {
    if (!codigo.trim()) {
      Alert.alert('Atenção', 'Digite o código recebido por email.');
      return;
    }
    setLoading(true);
    try {
      const token = await verifyCode(verificationId, codigo.trim());
      await completeRegistration(pendingNome, pendingEmail, pendingSenha, token);
      router.replace('/(tabs)/home');
    } catch (e: unknown) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Código inválido.');
    } finally {
      setLoading(false);
    }
  };

  const handleReenviar = async () => {
    try {
      await resendCode(verificationId);
      Alert.alert('Código reenviado!', 'Verifique seu email.');
    } catch (e: unknown) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Não foi possível reenviar.');
    }
  };

  const handleAdminLocal = () => {
    setEmail('admin@admn.com');
    setSenha('admin#22018@');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color={c.text} />
            </TouchableOpacity>
            <SouDoBemLogo size="medium" />
          </View>

          <Text style={[styles.subtitle, { color: c.textMuted }]}>
            {mode === 'login'
              ? 'Bem-vindo de volta! Seu histórico de doações te espera.'
              : mode === 'cadastro'
              ? 'Crie sua conta e comece a transformar vidas.'
              : 'Enviamos um código para o seu email.'}
          </Text>

          <View style={[styles.card, { backgroundColor: c.card }]}>
            {mode !== 'verificacao' && (
              <View style={[styles.tabs, { backgroundColor: c.inputBg }]}>
                <TouchableOpacity
                  style={[styles.tab, mode === 'login' && { backgroundColor: c.card, ...Shadows.card }]}
                  onPress={() => setMode('login')}
                >
                  <Text style={[styles.tabLabel, { color: mode === 'login' ? c.orange : c.textMuted }]}>
                    Entrar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, mode === 'cadastro' && { backgroundColor: c.card, ...Shadows.card }]}
                  onPress={() => setMode('cadastro')}
                >
                  <Text style={[styles.tabLabel, { color: mode === 'cadastro' ? c.orange : c.textMuted }]}>
                    Criar conta
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {mode === 'cadastro' && (
              <Field label="Nome completo" value={nome} onChangeText={setNome} placeholder="Seu nome" autoCapitalize="words" />
            )}

            {mode !== 'verificacao' && (
              <>
                <Field label="Email" value={email} onChangeText={setEmail} placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" />
                <View>
                  <Field label="Senha" value={senha} onChangeText={setSenha} placeholder="Sua senha" secureTextEntry={!showSenha} />
                  <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowSenha((v) => !v)}>
                    <Ionicons name={showSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color={c.textMuted} />
                  </TouchableOpacity>
                </View>
              </>
            )}

            {mode === 'cadastro' && (
              <Field label="Confirmar senha" value={confirmarSenha} onChangeText={setConfirmarSenha} placeholder="Repita a senha" secureTextEntry />
            )}

            {mode === 'verificacao' && (
              <>
                <Text style={[styles.verificationHint, { color: c.textMuted }]}>
                  Digite o código de 6 dígitos enviado para{'\n'}
                  <Text style={{ color: c.orange }}>{pendingEmail}</Text>
                </Text>
                <Field label="Código de verificação" value={codigo} onChangeText={setCodigo} placeholder="123456" keyboardType="number-pad" autoCapitalize="none" />
              </>
            )}

            <PillButton
              label={mode === 'login' ? 'Entrar com email' : mode === 'cadastro' ? 'Criar conta' : 'Confirmar email'}
              onPress={mode === 'login' ? handleLogin : mode === 'cadastro' ? handleCadastro : handleVerificar}
              loading={loading}
              style={styles.submitBtn}
            />

            {mode === 'verificacao' && (
              <TouchableOpacity onPress={handleReenviar} style={styles.linkBtn}>
                <Text style={[styles.linkText, { color: c.orange }]}>Reenviar código</Text>
              </TouchableOpacity>
            )}

            {mode === 'login' && isLocalMode() && (
              <TouchableOpacity onPress={handleAdminLocal} style={styles.linkBtn}>
                <Text style={[styles.linkText, { color: c.orange }]}>Usar admin local</Text>
              </TouchableOpacity>
            )}

            {mode === 'verificacao' && (
              <TouchableOpacity onPress={() => setMode('cadastro')} style={styles.linkBtn}>
                <Text style={[styles.linkText, { color: c.orange }]}>Voltar</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

function Field({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, autoCapitalize }: FieldProps) {
  const c = useThemeColors();
  return (
    <View style={{ gap: 6 }}>
      <Text style={[styles.fieldLabel, { color: c.text }]}>{label}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: c.inputBg, color: c.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize={autoCapitalize ?? 'sentences'}
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40, gap: 24 },
  header: { paddingTop: 16, alignItems: 'center', gap: 16 },
  backBtn: { position: 'absolute', left: 0, top: 20, padding: 8 },
  subtitle: { ...Typography.bodyLarge, textAlign: 'center', paddingHorizontal: 16 },
  card: { borderRadius: 24, padding: 24, gap: 16, ...Shadows.cardLarge },
  tabs: { flexDirection: 'row', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabLabel: { ...Typography.labelLarge },
  fieldLabel: { ...Typography.labelLarge },
  input: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, ...Typography.bodyMedium },
  submitBtn: { marginTop: 8 },
  linkBtn: { alignItems: 'center', paddingVertical: 4 },
  linkText: { ...Typography.bodyMedium, textDecorationLine: 'underline' },
  eyeBtn: { position: 'absolute', right: 16, bottom: 12 },
  verificationHint: { ...Typography.bodyMedium, textAlign: 'center' },
});
