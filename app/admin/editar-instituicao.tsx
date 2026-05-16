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
import { Shadows } from '../../constants/Shadows';
import { PillButton } from '../../components/PillButton';
import { FloatingHeader } from '../../components/FloatingHeader';
import { WhiteCard } from '../../components/WhiteCard';
import { useInstitutions } from '../../contexts/InstitutionsContext';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeColors } from '../../contexts/ThemeContext';
import { instituicoesService, Instituicao } from '../../services/instituicoes';

const TIPOS_PIX = ['cpf', 'cnpj', 'email', 'telefone', 'aleatória'];

type Fase = 'selecionar' | 'editar';

export default function EditarInstituicaoScreen() {
  const { user } = useAuth();
  const { instituicoes, reload } = useInstitutions();
  const c = useThemeColors();

  const [fase, setFase] = useState<Fase>('selecionar');
  const [instSelecionada, setInstSelecionada] = useState<Instituicao | null>(null);

  const [nomeExibicao, setNomeExibicao] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [endereco, setEndereco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [chavePix, setChavePix] = useState('');
  const [tipoChavePix, setTipoChavePix] = useState('');
  const [videoYoutube, setVideoYoutube] = useState('');
  const [destaque, setDestaque] = useState(false);
  const [novasFotos, setNovasFotos] = useState<Array<{ uri: string; name: string; type: string }>>([]);
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

  const handleSelecionar = (inst: Instituicao) => {
    setInstSelecionada(inst);
    setNomeExibicao(inst.nome_exibicao);
    setCidade(inst.cidade);
    setEstado(inst.estado);
    setEndereco(inst.endereco ?? '');
    setDescricao(inst.descricao);
    setChavePix(inst.chave_pix);
    setTipoChavePix(inst.tipo_chave_pix);
    setVideoYoutube(inst.video_youtube ?? '');
    setDestaque(inst.destaque);
    setNovasFotos([]);
    setFase('editar');
  };

  const handleAdicionarFotos = async () => {
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
      setNovasFotos((prev) => [...prev, ...novas].slice(0, 8));
    }
  };

  const handleSalvar = async () => {
    if (!instSelecionada) return;
    if (!nomeExibicao.trim() || !cidade.trim() || !estado.trim() || !chavePix.trim()) {
      Alert.alert('Atenção', 'Preencha os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('nome_exibicao', nomeExibicao.trim());
      formData.append('cidade', cidade.trim());
      formData.append('estado', estado.trim().toUpperCase());
      formData.append('endereco', endereco.trim());
      formData.append('descricao', descricao.trim());
      formData.append('chave_pix', chavePix.trim());
      formData.append('tipo_chave_pix', tipoChavePix);
      formData.append('video_youtube', videoYoutube.trim());
      formData.append('destaque', String(destaque));
      novasFotos.forEach((f) => formData.append('fotos', f as unknown as Blob));

      await instituicoesService.atualizar(instSelecionada.slug ?? instSelecionada.id, formData);
      await reload();
      Alert.alert('Sucesso!', 'Instituição atualizada com sucesso.', [
        { text: 'OK', onPress: () => { setFase('selecionar'); setInstSelecionada(null); } },
      ]);
    } catch (e: unknown) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao atualizar.');
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

  if (fase === 'selecionar') {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <FloatingHeader title="Editar Instituição" onBack={() => router.back()} style={styles.header} />
          <Text style={[styles.headline, { color: c.text }]}>Selecione a{'\n'}instituição</Text>

          {instituicoes.map((inst) => (
            <TouchableOpacity
              key={inst.id}
              style={[styles.instCard, { backgroundColor: c.card }]}
              onPress={() => handleSelecionar(inst)}
              activeOpacity={0.85}
            >
              <View style={[styles.instAvatar, { backgroundColor: c.orangeLight }]}>
                <Text style={[styles.instAvatarText, { color: c.orange }]}>
                  {inst.nome_exibicao.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.instInfo}>
                <Text style={[styles.instName, { color: c.text }]}>{inst.nome_exibicao}</Text>
                <Text style={[styles.instMeta, { color: c.textMuted }]}>
                  {inst.cidade} — {inst.estado}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={c.textMuted} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <FloatingHeader
            title={`Editar: ${instSelecionada?.nome_exibicao}`}
            onBack={() => setFase('selecionar')}
            style={styles.header}
          />

          <WhiteCard style={styles.form} large>
            {renderInput('Nome de exibição *', nomeExibicao, setNomeExibicao, 'Nome público', { autoCapitalize: 'words' })}
            {renderInput('Cidade *', cidade, setCidade, 'Cidade', { autoCapitalize: 'words' })}
            {renderInput('Estado *', estado, setEstado, 'UF', { autoCapitalize: 'characters', maxLength: 2 })}
            {renderInput('Endereço', endereco, setEndereco, 'Endereço completo')}

            <View style={styles.fieldWrapper}>
              <Text style={[styles.label, { color: c.text }]}>Descrição</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: c.inputBg, color: c.text }]}
                value={descricao}
                onChangeText={setDescricao}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={c.placeholder}
              />
            </View>

            {renderInput('Chave PIX *', chavePix, setChavePix, '', { autoCapitalize: 'none' })}

            <View style={styles.fieldWrapper}>
              <Text style={[styles.label, { color: c.text }]}>Tipo PIX</Text>
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

            {renderInput('Link YouTube', videoYoutube, setVideoYoutube, 'https://youtu.be/...', { autoCapitalize: 'none', keyboardType: 'url' })}

            <View style={styles.switchRow}>
              <Text style={[styles.label, { color: c.text }]}>Destaque na Home</Text>
              <Switch
                value={destaque}
                onValueChange={setDestaque}
                trackColor={{ false: c.border, true: c.turquoise }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.fieldWrapper}>
              <Text style={[styles.label, { color: c.text }]}>Adicionar fotos</Text>
              <TouchableOpacity style={[styles.addFotoBtn, { backgroundColor: c.orangeLight }]} onPress={handleAdicionarFotos}>
                <Ionicons name="images-outline" size={20} color={c.orange} />
                <Text style={[styles.addFotoBtnText, { color: c.orange }]}>
                  {novasFotos.length} nova(s) selecionada(s)
                </Text>
              </TouchableOpacity>
            </View>
          </WhiteCard>

          <View style={styles.actionRow}>
            <PillButton label="Salvar Alterações" onPress={handleSalvar} loading={loading} style={{ flex: 1 }} />
            <PillButton label="Cancelar" onPress={() => setFase('selecionar')} variant="outline" style={{ flex: 1 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, gap: 16, paddingBottom: 40 },
  header: { marginBottom: 4 },
  headline: { ...Typography.displayMedium },
  instCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    padding: 14,
    ...Shadows.card,
  },
  instAvatar: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  instAvatarText: { ...Typography.titleMedium },
  instInfo: { flex: 1, gap: 4 },
  instName: { ...Typography.titleSmall },
  instMeta: { ...Typography.bodySmall },
  form: { gap: 16, padding: 20 },
  fieldWrapper: { gap: 8 },
  label: { ...Typography.labelLarge },
  input: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, ...Typography.bodyMedium },
  textArea: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, ...Typography.bodyMedium, minHeight: 100 },
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
  actionRow: { flexDirection: 'row', gap: 12 },
  notAdmin: { ...Typography.bodyMedium, textAlign: 'center', marginTop: 40 },
});
