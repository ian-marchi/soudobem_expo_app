import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Typography } from '../../constants/Typography';
import { PillButton } from '../../components/PillButton';
import { FloatingHeader } from '../../components/FloatingHeader';
import { WhiteCard } from '../../components/WhiteCard';
import { useInstitutions } from '../../contexts/InstitutionsContext';
import { useThemeColors } from '../../contexts/ThemeContext';

const PRESETS = [10, 25, 50, 100, 200];

export default function ValorScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { buscarPorSlug } = useInstitutions();
  const c = useThemeColors();
  const inst = slug ? buscarPorSlug(slug) : undefined;

  const [valorSelecionado, setValorSelecionado] = useState<number | null>(null);
  const [valorCustom, setValorCustom] = useState('');
  const [modoCustom, setModoCustom] = useState(false);

  const valorFinal = modoCustom
    ? parseFloat(valorCustom.replace(',', '.')) || 0
    : valorSelecionado ?? 0;

  const handleContinuar = () => {
    if (valorFinal <= 0) {
      Alert.alert('Atenção', 'Informe um valor válido maior que zero.');
      return;
    }
    router.push({ pathname: '/doacao/pix', params: { slug, valor: String(valorFinal) } });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <FloatingHeader title={inst?.nome_exibicao ?? 'Doação'} onBack={() => router.back()} style={styles.header} />

        <Text style={[styles.headline, { color: c.text }]}>Escolha o{'\n'}valor da doação</Text>

        <WhiteCard style={styles.card} large>
          <View style={styles.currentValue}>
            <Text style={[styles.currencySymbol, { color: c.textMuted }]}>R$</Text>
            <Text style={[styles.valueDisplay, { color: c.text }]}>
              {valorFinal > 0 ? valorFinal.toFixed(2).replace('.', ',') : '0,00'}
            </Text>
          </View>

          <View style={styles.presetsGrid}>
            {PRESETS.map((v) => {
              const active = !modoCustom && valorSelecionado === v;
              return (
                <TouchableOpacity
                  key={v}
                  style={[styles.preset, { backgroundColor: active ? c.orange : c.inputBg }]}
                  onPress={() => { setValorSelecionado(v); setModoCustom(false); }}
                >
                  <Text style={[styles.presetText, { color: active ? '#FFFFFF' : c.text }]}>
                    R$ {v}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.customToggle, { borderColor: modoCustom ? c.orange : c.border }]}
            onPress={() => { setModoCustom(true); setValorSelecionado(null); }}
          >
            <Text style={[styles.customToggleText, { color: modoCustom ? c.orange : c.textMuted }]}>
              Outro valor
            </Text>
          </TouchableOpacity>

          {modoCustom && (
            <View style={[styles.customInput, { backgroundColor: c.inputBg }]}>
              <Text style={[styles.customPrefix, { color: c.textMuted }]}>R$</Text>
              <TextInput
                style={[styles.customInputField, { color: c.text }]}
                value={valorCustom}
                onChangeText={setValorCustom}
                placeholder="0,00"
                placeholderTextColor={c.placeholder}
                keyboardType="decimal-pad"
                autoFocus
              />
            </View>
          )}

          <Text style={[styles.hint, { color: c.textMuted }]}>
            O valor poderá ser ajustado antes de confirmar a doação.
          </Text>
        </WhiteCard>

        <PillButton
          label="Continuar para o PIX"
          onPress={handleContinuar}
          disabled={valorFinal <= 0}
          style={styles.submitBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, gap: 20, paddingBottom: 40 },
  header: { marginBottom: 4 },
  headline: { ...Typography.displayMedium },
  card: { gap: 20, padding: 24 },
  currentValue: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 8, paddingVertical: 8 },
  currencySymbol: { ...Typography.titleLarge },
  valueDisplay: { fontFamily: 'Nunito_800ExtraBold', fontSize: 48, lineHeight: 56 },
  presetsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  preset: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, minWidth: 80, alignItems: 'center' },
  presetText: { ...Typography.labelLarge },
  customToggle: { borderWidth: 2, borderRadius: 12, paddingVertical: 10, alignItems: 'center', borderStyle: 'dashed' },
  customToggleText: { ...Typography.labelLarge },
  customInput: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, gap: 8 },
  customPrefix: { ...Typography.titleSmall },
  customInputField: { flex: 1, ...Typography.titleLarge, paddingVertical: 12 },
  hint: { ...Typography.bodySmall, textAlign: 'center' },
  submitBtn: { marginTop: 4 },
});
