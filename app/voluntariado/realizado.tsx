import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Typography } from '../../constants/Typography';
import { PillButton } from '../../components/PillButton';
import { FloatingHeader } from '../../components/FloatingHeader';
import { WhiteCard } from '../../components/WhiteCard';
import { useInstitutions } from '../../contexts/InstitutionsContext';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeColors } from '../../contexts/ThemeContext';
import { historicoService } from '../../services/historico';

interface FotoItem {
  uri: string;
  name: string;
  type: string;
}

export default function VoluntariadoRealizadoScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { buscarPorSlug } = useInstitutions();
  const { user } = useAuth();
  const c = useThemeColors();
  const inst = slug ? buscarPorSlug(slug) : undefined;

  const [data, setData] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [fotos, setFotos] = useState<FotoItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelectFotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const novasFotos = result.assets.map((a) => ({
        uri: a.uri,
        name: a.fileName ?? `foto_${Date.now()}.jpg`,
        type: a.mimeType ?? 'image/jpeg',
      }));
      setFotos((prev) => [...prev, ...novasFotos].slice(0, 5));
    }
  };

  const handleRegistrar = async () => {
    if (!inst || !user) return;
    setLoading(true);
    try {
      const dataStr = data.toLocaleDateString('pt-BR');
      const horaStr = hora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      await historicoService.registrarVoluntariado(
        {
          instituicao_slug: inst.slug ?? inst.id,
          instituicao_nome: inst.nome_exibicao,
          data: dataStr,
          hora: horaStr,
          fotos,
        },
        user.email,
        user.nome
      );

      router.replace({
        pathname: '/voluntariado/agradecimento',
        params: { slug, data: dataStr, hora: horaStr },
      });
    } catch (e: unknown) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao registrar.');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (_: DateTimePickerEvent, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) setData(selected);
  };

  const onTimeChange = (_: DateTimePickerEvent, selected?: Date) => {
    setShowTimePicker(false);
    if (selected) setHora(selected);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <FloatingHeader
            title={inst?.nome_exibicao ?? 'Voluntariado'}
            onBack={() => router.back()}
            style={styles.header}
          />

          <Text style={[styles.headline, { color: c.text }]}>Registrar trabalho{'\n'}realizado</Text>

          <WhiteCard style={styles.form} large>
            <View style={styles.fieldWrapper}>
              <Text style={[styles.label, { color: c.text }]}>Data que ajudou *</Text>
              <TouchableOpacity
                style={[styles.dateBtn, { backgroundColor: c.inputBg }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={18} color={c.orange} />
                <Text style={[styles.dateBtnText, { color: c.text }]}>
                  {data.toLocaleDateString('pt-BR')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldWrapper}>
              <Text style={[styles.label, { color: c.text }]}>Horário do trabalho *</Text>
              <TouchableOpacity
                style={[styles.dateBtn, { backgroundColor: c.inputBg }]}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={18} color={c.orange} />
                <Text style={[styles.dateBtnText, { color: c.text }]}>
                  {hora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldWrapper}>
              <Text style={[styles.label, { color: c.text }]}>Fotos do trabalho (opcional)</Text>
              <View style={styles.fotosGrid}>
                {fotos.map((foto, idx) => (
                  <View key={idx} style={styles.fotoItem}>
                    <Image source={{ uri: foto.uri }} style={styles.fotoImg} />
                    <TouchableOpacity
                      style={[styles.fotoRemove, { backgroundColor: c.card }]}
                      onPress={() => setFotos((prev) => prev.filter((_, i) => i !== idx))}
                    >
                      <Ionicons name="close-circle" size={20} color={c.error} />
                    </TouchableOpacity>
                  </View>
                ))}
                {fotos.length < 5 && (
                  <TouchableOpacity
                    style={[styles.fotoAdd, { borderColor: c.orange, backgroundColor: c.orangeLight }]}
                    onPress={handleSelectFotos}
                  >
                    <Ionicons name="add" size={28} color={c.orange} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </WhiteCard>

          <PillButton label="Registrar trabalho" onPress={handleRegistrar} loading={loading} />

          {showDatePicker && (
            <DateTimePicker
              value={data}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
          {showTimePicker && (
            <DateTimePicker value={hora} mode="time" display="default" onChange={onTimeChange} />
          )}
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
  form: { gap: 20, padding: 20 },
  fieldWrapper: { gap: 8 },
  label: { ...Typography.labelLarge },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateBtnText: { ...Typography.bodyMedium },
  fotosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  fotoItem: { position: 'relative', width: 80, height: 80 },
  fotoImg: { width: 80, height: 80, borderRadius: 10 },
  fotoRemove: { position: 'absolute', top: -6, right: -6, borderRadius: 10 },
  fotoAdd: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
