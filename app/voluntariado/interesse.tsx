import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Typography } from '../../constants/Typography';
import { PillButton } from '../../components/PillButton';
import { FloatingHeader } from '../../components/FloatingHeader';
import { WhiteCard } from '../../components/WhiteCard';
import { useInstitutions } from '../../contexts/InstitutionsContext';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeColors } from '../../contexts/ThemeContext';
import { voluntariadoService } from '../../services/voluntariado';

export default function VoluntariadoInteresseScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { buscarPorSlug } = useInstitutions();
  const { user } = useAuth();
  const c = useThemeColors();
  const inst = slug ? buscarPorSlug(slug) : undefined;

  const [nome, setNome] = useState(user?.nome ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [telefone, setTelefone] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnviar = async () => {
    if (!nome.trim() || !email.trim() || !telefone.trim() || !descricao.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }
    if (!inst) return;

    setLoading(true);
    try {
      const now = new Date();
      await voluntariadoService.enviarSolicitacao({
        instituicao_slug: inst.slug ?? inst.id,
        instituicao_nome: inst.nome_exibicao,
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        descricao: descricao.trim(),
        data: now.toLocaleDateString('pt-BR'),
        hora: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: 'enviado',
      });

      Alert.alert(
        'Solicitação enviada!',
        `Sua solicitação de voluntariado para ${inst.nome_exibicao} foi registrada com sucesso.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (e: unknown) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao enviar solicitação.');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    label: string,
    value: string,
    onChangeText: (t: string) => void,
    placeholder: string,
    opts: { keyboardType?: 'default' | 'email-address' | 'phone-pad'; autoCapitalize?: 'none' | 'words' | 'sentences' } = {}
  ) => (
    <View style={styles.fieldWrapper}>
      <Text style={[styles.label, { color: c.text }]}>{label}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: c.inputBg, color: c.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.placeholder}
        keyboardType={opts.keyboardType ?? 'default'}
        autoCapitalize={opts.autoCapitalize ?? 'sentences'}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <FloatingHeader
            title={inst?.nome_exibicao ?? 'Voluntariado'}
            onBack={() => router.back()}
            style={styles.header}
          />

          <Text style={[styles.headline, { color: c.text }]}>Quero ser{'\n'}voluntário</Text>

          {inst && (
            <WhiteCard style={styles.instCard}>
              <Text style={[styles.instName, { color: c.text }]}>{inst.nome_exibicao}</Text>
              <Text style={[styles.instLocation, { color: c.textMuted }]}>
                {inst.cidade} — {inst.estado}
              </Text>
            </WhiteCard>
          )}

          <WhiteCard style={styles.form} large>
            {renderField('Nome completo *', nome, setNome, 'Seu nome', { autoCapitalize: 'words' })}
            {renderField('Email *', email, setEmail, 'seu@email.com', { keyboardType: 'email-address', autoCapitalize: 'none' })}
            {renderField('Telefone *', telefone, setTelefone, '(00) 00000-0000', { keyboardType: 'phone-pad' })}
            <View style={styles.fieldWrapper}>
              <Text style={[styles.label, { color: c.text }]}>Como você pode ajudar? *</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: c.inputBg, color: c.text }]}
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Descreva sua disponibilidade e habilidades..."
                placeholderTextColor={c.placeholder}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </WhiteCard>

          <PillButton label="Enviar solicitação" onPress={handleEnviar} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, gap: 20, paddingBottom: 40 },
  header: { marginBottom: 4 },
  headline: { ...Typography.displayMedium },
  instCard: { gap: 4 },
  instName: { ...Typography.titleSmall },
  instLocation: { ...Typography.bodySmall },
  form: { gap: 16, padding: 20 },
  fieldWrapper: { gap: 6 },
  label: { ...Typography.labelLarge },
  input: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, ...Typography.bodyMedium },
  textArea: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, ...Typography.bodyMedium, minHeight: 100 },
});
