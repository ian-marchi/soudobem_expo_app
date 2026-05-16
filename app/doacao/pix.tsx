import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../constants/Typography';
import { Shadows } from '../../constants/Shadows';
import { PillButton } from '../../components/PillButton';
import { FloatingHeader } from '../../components/FloatingHeader';
import { WhiteCard } from '../../components/WhiteCard';
import { useInstitutions } from '../../contexts/InstitutionsContext';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeColors } from '../../contexts/ThemeContext';
import { pixService } from '../../services/pix';
import { historicoService } from '../../services/historico';
import QRCode from 'react-native-qrcode-svg';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function PixScreen() {
  const { slug, valor: valorParam } = useLocalSearchParams<{ slug: string; valor: string }>();
  const { buscarPorSlug } = useInstitutions();
  const { user } = useAuth();
  const c = useThemeColors();

  const inst = slug ? buscarPorSlug(slug) : undefined;
  const [valor, setValor] = useState(parseFloat(valorParam ?? '0'));
  const [editandoValor, setEditandoValor] = useState(false);
  const [valorInput, setValorInput] = useState(valorParam ?? '0');
  const [pixPayload, setPixPayload] = useState('');
  const [carregandoPix, setCarregandoPix] = useState(true);
  const [comprovante, setComprovante] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    if (inst) gerarPix(valor);
  }, [inst]);

  const gerarPix = async (v: number) => {
    if (!inst) return;
    setCarregandoPix(true);
    try {
      const data = await pixService.gerarPix(inst, v);
      setPixPayload(data.payload_pix);
    } catch {
      Alert.alert('Erro', 'Não foi possível gerar o código PIX.');
    } finally {
      setCarregandoPix(false);
    }
  };

  const handleAplicarValor = () => {
    const novo = parseFloat(valorInput.replace(',', '.'));
    if (isNaN(novo) || novo <= 0) {
      Alert.alert('Atenção', 'Informe um valor válido.');
      return;
    }
    setValor(novo);
    setEditandoValor(false);
    gerarPix(novo);
  };

  const handleCopiar = async () => {
    await Clipboard.setStringAsync(pixPayload);
    Alert.alert('Copiado!', 'Código PIX copiado para a área de transferência.');
  };

  const handleComprovante = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'application/pdf'],
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setComprovante({ uri: asset.uri, name: asset.name, type: asset.mimeType ?? 'image/jpeg' });
    }
  };

  const handleConfirmar = async () => {
    if (!inst || !user) {
      Alert.alert('Atenção', 'Faça login para confirmar a doação.');
      return;
    }
    setConfirmando(true);
    try {
      const now = new Date();
      const data = now.toLocaleDateString('pt-BR');
      const hora = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      await historicoService.registrarPix(
        {
          instituicao_slug: inst.slug ?? inst.id,
          instituicao_nome: inst.nome_exibicao,
          valor,
          data,
          hora,
          comprovante: comprovante ?? undefined,
        },
        user.email,
        user.nome
      );

      router.replace({
        pathname: '/doacao/agradecimento',
        params: { slug, valor: String(valor), data, hora, metodo: 'PIX', nome_usuario: user.nome },
      });
    } catch (e: unknown) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao confirmar doação.');
    } finally {
      setConfirmando(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <FloatingHeader title="Doação via PIX" onBack={() => router.back()} style={styles.header} />

        <WhiteCard style={styles.valorCard}>
          <View style={styles.valorRow}>
            <Text style={[styles.valorLabel, { color: c.textMuted }]}>Valor selecionado</Text>
            <Text style={[styles.valorText, { color: c.text }]}>{formatBRL(valor)}</Text>
          </View>
          {!comprovante && (
            <TouchableOpacity onPress={editandoValor ? handleAplicarValor : () => setEditandoValor(true)}>
              <Text style={[styles.editBtnText, { color: c.orange }]}>
                {editandoValor ? 'Aplicar valor' : 'Editar valor'}
              </Text>
            </TouchableOpacity>
          )}
          {editandoValor && (
            <View style={[styles.editInput, { backgroundColor: c.inputBg }]}>
              <Text style={[styles.editPrefix, { color: c.textMuted }]}>R$</Text>
              <TextInput
                style={[styles.editInputField, { color: c.text }]}
                value={valorInput}
                onChangeText={setValorInput}
                keyboardType="decimal-pad"
                autoFocus
                placeholder="0,00"
                placeholderTextColor={c.placeholder}
              />
            </View>
          )}
        </WhiteCard>

        <WhiteCard style={styles.qrCard} large>
          <Text style={[styles.qrTitle, { color: c.text }]}>Escaneie ou copie o código</Text>

          {carregandoPix ? (
            <ActivityIndicator size="large" color={c.orange} style={{ marginVertical: 40 }} />
          ) : pixPayload ? (
            <>
              <View style={styles.qrWrapper}>
                <QRCode value={pixPayload} size={180} color="#1A1A1A" backgroundColor="#FFFFFF" />
              </View>

              <Text style={[styles.pixLabel, { color: c.textMuted }]}>PIX Copia e Cola</Text>
              <View style={[styles.pixPayloadBox, { backgroundColor: c.inputBg }]}>
                <Text style={[styles.pixPayloadText, { color: c.text }]} numberOfLines={3} ellipsizeMode="middle">
                  {pixPayload}
                </Text>
                <TouchableOpacity onPress={handleCopiar} style={styles.copyBtn}>
                  <Ionicons name="copy-outline" size={20} color={c.orange} />
                </TouchableOpacity>
              </View>

              <PillButton label="Copiar PIX copia e cola" onPress={handleCopiar} variant="outline" small />
            </>
          ) : (
            <Text style={[styles.errorText, { color: c.error }]}>Falha ao gerar PIX.</Text>
          )}
        </WhiteCard>

        <WhiteCard style={styles.comprovanteCard}>
          <Text style={[styles.comprovanteTitle, { color: c.text }]}>Comprovante (opcional)</Text>
          <Text style={[styles.comprovanteHint, { color: c.textMuted }]}>
            Após pagar, anexe o comprovante para seu histórico.
          </Text>

          {comprovante ? (
            <View style={[styles.comprovanteSelected, { backgroundColor: c.inputBg }]}>
              <Ionicons name="document-attach-outline" size={20} color={c.turquoiseStrong} />
              <Text style={[styles.comprovanteNome, { color: c.text }]} numberOfLines={1}>
                {comprovante.name}
              </Text>
              <TouchableOpacity onPress={() => setComprovante(null)}>
                <Ionicons name="close-circle-outline" size={20} color={c.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <PillButton label="Selecionar comprovante" onPress={handleComprovante} variant="outline" small />
          )}
        </WhiteCard>

        <View style={[styles.infoBox, { backgroundColor: c.orangeLight }]}>
          <Ionicons name="information-circle-outline" size={16} color={c.textMuted} />
          <Text style={[styles.infoText, { color: c.textMuted }]}>
            Realize o pagamento no seu banco e depois confirme a doação aqui.
          </Text>
        </View>

        <PillButton label="Confirmar doação" onPress={handleConfirmar} loading={confirmando} style={styles.confirmBtn} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, gap: 16, paddingBottom: 40 },
  header: { marginBottom: 4 },
  valorCard: { gap: 12 },
  valorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  valorLabel: { ...Typography.bodyMedium },
  valorText: { ...Typography.monetaryValue },
  editBtnText: { ...Typography.labelLarge, textDecorationLine: 'underline' },
  editInput: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, gap: 8 },
  editPrefix: { ...Typography.titleSmall },
  editInputField: { flex: 1, ...Typography.titleMedium, paddingVertical: 12 },
  qrCard: { gap: 16, padding: 24, alignItems: 'center' },
  qrTitle: { ...Typography.titleSmall, textAlign: 'center' },
  qrWrapper: { padding: 16, backgroundColor: '#FFFFFF', borderRadius: 16, ...Shadows.card },
  pixLabel: { ...Typography.labelLarge },
  pixPayloadBox: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 12, gap: 8, width: '100%' },
  pixPayloadText: { ...Typography.bodySmall, flex: 1, fontFamily: 'monospace' },
  copyBtn: { padding: 4 },
  errorText: { ...Typography.bodyMedium },
  comprovanteCard: { gap: 10 },
  comprovanteTitle: { ...Typography.titleSmall },
  comprovanteHint: { ...Typography.bodySmall },
  comprovanteSelected: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, padding: 12 },
  comprovanteNome: { ...Typography.bodySmall, flex: 1 },
  infoBox: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', borderRadius: 12, padding: 12 },
  infoText: { ...Typography.bodySmall, flex: 1 },
  confirmBtn: { marginTop: 4 },
});
