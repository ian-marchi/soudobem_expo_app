import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../constants/Typography';
import { Shadows } from '../../constants/Shadows';
import { SearchField } from '../../components/SearchField';
import { useInstitutions } from '../../contexts/InstitutionsContext';
import { useThemeColors } from '../../contexts/ThemeContext';
import { Instituicao } from '../../data/localData';
import { getInstitutionAvatar } from '../../data/institutionImages';

interface CidadeGroup {
  cidade: string;
  estado: string;
  items: Instituicao[];
}

export default function ExplorarScreen() {
  const { instituicoes, loading } = useInstitutions();
  const c = useThemeColors();
  const [busca, setBusca] = useState('');

  const filtered = useMemo(() => {
    const term = busca.toLowerCase().trim();
    if (!term) return instituicoes;
    return instituicoes.filter(
      (i) =>
        i.nome_exibicao.toLowerCase().includes(term) ||
        i.cidade.toLowerCase().includes(term)
    );
  }, [instituicoes, busca]);

  const grouped = useMemo<CidadeGroup[]>(() => {
    const map = new Map<string, CidadeGroup>();
    for (const inst of filtered) {
      const key = `${inst.cidade}-${inst.estado}`;
      if (!map.has(key)) {
        map.set(key, { cidade: inst.cidade, estado: inst.estado, items: [] });
      }
      map.get(key)!.items.push(inst);
    }
    return Array.from(map.values());
  }, [filtered]);

  const handleCard = (inst: Instituicao) => {
    router.push(`/instituicao/${inst.slug ?? inst.id}`);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <View style={[styles.topBar, { backgroundColor: c.card }]}>
        <Text style={[styles.title, { color: c.text }]}>Explorar</Text>
        <SearchField
          value={busca}
          onChangeText={setBusca}
          placeholder="Buscar por instituição ou cidade..."
        />
      </View>

      {loading ? (
        <Text style={[styles.center, { color: c.textMuted }]}>Carregando...</Text>
      ) : grouped.length === 0 ? (
        <Text style={[styles.center, { color: c.textMuted }]}>Nenhuma instituição encontrada.</Text>
      ) : (
        <FlatList
          data={grouped}
          keyExtractor={(item) => `${item.cidade}-${item.estado}`}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: group }) => (
            <View style={styles.group}>
              <Text style={[styles.groupTitle, { color: c.orange }]}>
                {group.cidade} — {group.estado}
              </Text>
              {group.items.map((inst) => {
                const avatar = getInstitutionAvatar(inst.slug ?? inst.id);
                return (
                  <TouchableOpacity
                    key={inst.id}
                    style={[styles.card, { backgroundColor: c.card }]}
                    onPress={() => handleCard(inst)}
                    activeOpacity={0.85}
                  >
                    {avatar ? (
                      <Image source={avatar} style={styles.avatarImg} resizeMode="cover" />
                    ) : (
                      <View style={[styles.avatarPlaceholder, { backgroundColor: c.orangeLight }]}>
                        <Text style={[styles.avatarInitial, { color: c.orange }]}>
                          {inst.nome_exibicao.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}

                    <View style={styles.cardInfo}>
                      <Text style={[styles.instName, { color: c.text }]} numberOfLines={1}>
                        {inst.nome_exibicao}
                      </Text>
                      <Text style={[styles.instDesc, { color: c.textMuted }]} numberOfLines={2}>
                        {inst.descricao}
                      </Text>
                    </View>

                    <Ionicons name="chevron-forward" size={20} color={c.textMuted} />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 20,
    gap: 12,
    ...Shadows.topBar,
  },
  title: { ...Typography.titleLarge },
  list: { padding: 20, gap: 24 },
  group: { gap: 10 },
  groupTitle: { ...Typography.titleSmall, marginBottom: 4 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    ...Shadows.card,
  },
  avatarImg: { width: 56, height: 56, borderRadius: 28 },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { ...Typography.titleMedium },
  cardInfo: { flex: 1, gap: 4 },
  instName: { ...Typography.titleSmall },
  instDesc: { ...Typography.bodySmall },
  center: { ...Typography.bodyMedium, textAlign: 'center', marginTop: 60 },
});
