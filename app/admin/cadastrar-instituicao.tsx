import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../constants/Typography';
import { PillButton } from '../../components/PillButton';
import { FloatingHeader } from '../../components/FloatingHeader';
import { WhiteCard } from '../../components/WhiteCard';
import { useInstitutions } from '../../contexts/InstitutionsContext';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeColors } from '../../contexts/ThemeContext';
import { instituicoesService } from '../../services/instituicoes';

const TIPOS_PIX = ['cpf', 'cnpj', 'email', 'telefone', 'aleatória'];

export default function CadastrarInstituicaoScreen() {
  const { user } = useAuth();
  const { reload } = useInstitutions();
  const c = useThemeColors();

  const [nomeCorporativo, setNomeCorporativo] = useState('');
  const [nomeExibicao, setNomeExibicao] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [endereco, setEndereco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [chavePix, setChavePix] = useState('');
  const [tipoChavePix, setTipoChavePix] = useState(TIPOS_PIX[0]);
  const [videoYoutube, setVideoYoutube] = useState('');
  const [destaque, setDestaque] = useState(false);
  const [fotos, setFotos] = useState<Array<{ uri: string; name: string; type: string }>>([]);
  const [loading, setLoading] = useState(false);

  if (!user?.is_admin) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
        <FloatingHeader title="Acesso negado" onBack={() => router.back()} style={styles.header} />
        <Text style={[styles.notAdmin, { color: c.textMuted }]}>
          Somente administradores podem acessar esta tela.
        </Text>
      </SafeAreaView>
    );
  }

  const handleFotos = async () => {
    if (fotos.length >= 8) {
      Alert.alert('Limite', 'Máximo de 8 fotos por instituição.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const novas = result.assets.map((a) => ({
        uri: a.uri,
        name: a.fileName ?? `foto_${Date.now()}.jpg`,
        type: a.mimeType ?? 'image/jpeg',
      }));
      setFotos((prev) => [...prev, ...novas].slice(0, 8));
    }
  };

  const handleCadastrar = async () => {
    if (!nomeExibicao.trim() || !cidade.trim() || !estado.trim() || !chavePix.trim() || !descricao.trim()) {
      Alert.alert('Atenção', 'Preencha os campos obrigatórios: nome de exibição, cidade, estado, chave PIX e descrição.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('nome_corporativo', nomeCorporativo.trim() || nomeExibicao.trim());
      formData.append('nome_exibicao', nomeExibicao.trim());
      formData.append('cidade', cidade.trim());
      formData.append('estado', estado.trim().toUpperCase());
      formData.append('endereco', endereco.trim());
      formData.append('descricao', descricao.trim());
      formData.append('chave_pix', chavePix.trim());
      formData.append('tipo_chave_pix', tipoChavePix);
      formData.append('video_youtube', videoYoutube.trim());
      formData.append('destaque', String(destaque));
      fotos.forEach((f) => formData.append('fotos', f as unknown as Blob));

      await instituicoesService.criar(formData);
      await reload();
      Alert.alert('Sucesso!', 'Instituição cadastrada com sucesso.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: unknown) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (t: string) => void,
    placeholder: string,
    opts: { autoCapitalize?: 'none' | 'words' | 'sentences' | 'characters'; keyboardType?: 'default' | 'url'; maxLength?: number } = {}
  ) => (
    <View style={styles.fieldWrapper}>
      <Text style={[styles.label, { color: c.text }]}>{label}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: c.inputBg, color: c.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.placeholder}
        autoCapitalize={opts.autoCapitalize ?? 'sentences'}
        keyboardType={opts.keyboardType ?? 'default'}
        maxLength={opts.maxLength}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <FloatingHeader title="Cadastrar Instituição" onBack={() => router.back()} style={styles.header} />

          <Text style={[styles.headline, { color: c.text }]}>Nova{'\n'}Instituição</Text>

          <WhiteCard style={styles.form} large>
            {renderInput('Nome de exibição *', nomeExibicao, setNomeExibicao, 'Nome público da instituição', { autoCapitalize: 'words' })}
            {renderInput('Nome corporativo', nomeCorporativo, setNomeCorporativo, 'Razão social', { autoCapitalize: 'words' })}
            {renderInput('Cidade *', cidade, setCidade, 'São Paulo', { autoCapitalize: 'words' })}
            {renderInput('Estado *', estado, setEstado, 'SP', { autoCapitalize: 'characters', maxLength: 2 })}
            {renderInput('Endereço', endereco, setEndereco, 'Rua, número, bairro')}

            <View style={styles.fieldWrapper}>
              <Text style={[styles.label, { color: c.text }]}>Descrição *</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: c.inputBg, color: c.text }]}
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Descreva a missão e atividades da instituição..."
                placeholderTextColor={c.placeholder}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            {renderInput('Chave PIX *', chavePix, setChavePix, 'Chave PIX da instituição', { autoCapitalize: 'none' })}

            <View style={styles.fieldWrapper}>
              <Text style={[styles.label, { color: c.text }]}>Tipo da chave PIX</Text>
              <View style={styles.tipoRow}>
                {TIPOS_PIX.map((t) => {
                  const active = tipoChavePix === t;
                  return (
                    <TouchableOpacity
                      key={t}
                      style={[styles.tipoChip, { backgroundColor: active ? c.turquoiseStrong : c.inputBg }]}
                      onPress={() => setTipoChavePix(t)}
                    >
                      <Text style={[styles.tipoText, { color: active ? '#FFFFFF' : c.textMuted }]}>{t}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {renderInput('Link do YouTube (opcional)', videoYoutube, setVideoYoutube, 'https://youtu.be/...', { autoCapitalize: 'none', keyboardType: 'url' })}

            <View style={styles.switchRow}>
              <Text style={[styles.label, { color: c.text }]}>Exibir em destaque na Home</Text>
              <Switch
                value={destaque}
                onValueChange={setDestaque}
                trackColor={{ false: c.border, true: c.turquoise }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.fieldWrapper}>
              <Text style={[styles.label, { color: c.text }]}>Fotos ({fotos.length}/8)</Text>
              <TouchableOpacity style={[styles.addFotoBtn, { backgroundColor: c.orangeLight }]} onPress={handleFotos}>
                <Ionicons name="images-outline" size={20} color={c.orange} />
                <Text style={[styles.addFotoBtnText, { color: c.orange }]}>Selecionar fotos</Text>
              </TouchableOpacity>
              <Text style={[styles.fotosCount, { color: c.textMuted }]}>
                {fotos.length} foto(s) selecionada(s)
              </Text>
            </View>
          </WhiteCard>

          <PillButton label="Cadastrar Instituição" onPress={handleCadastrar} loading={loading} />
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
  form: { gap: 16, padding: 20 },
  fieldWrapper: { gap: 8 },
  label: { ...Typography.labelLarge },
  input: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, ...Typography.bodyMedium },
  textArea: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, ...Typography.bodyMedium, minHeight: 120 },
  tipoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tipoChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  tipoText: { ...Typography.labelSmall },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addFotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addFotoBtnText: { ...Typography.labelLarge },
  fotosCount: { ...Typography.bodySmall },
  notAdmin: { ...Typography.bodyMedium, textAlign: 'center', marginTop: 40 },
});
