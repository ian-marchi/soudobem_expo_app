import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../constants/Typography';
import { WhiteCard } from '../../components/WhiteCard';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme, useThemeColors } from '../../contexts/ThemeContext';
import type { ThemeColors } from '../../constants/Colors';

export default function ConfigScreen() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const c = useThemeColors();

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.pageTitle, { color: c.text }]}>Configurações</Text>

        {user && (
          <WhiteCard style={styles.accountCard}>
            <View style={[styles.accountAvatar, { backgroundColor: c.orangeLight }]}>
              <Text style={[styles.accountAvatarText, { color: c.orange }]}>
                {user.nome.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.accountInfo}>
              <Text style={[styles.accountName, { color: c.text }]}>{user.nome}</Text>
              <Text style={[styles.accountEmail, { color: c.textMuted }]}>{user.email}</Text>
              {user.is_admin && (
                <View style={[styles.adminBadge, { backgroundColor: c.turquoiseStrong }]}>
                  <Ionicons name="shield-checkmark" size={12} color="#FFFFFF" />
                  <Text style={styles.adminBadgeText}>Administrador</Text>
                </View>
              )}
            </View>
          </WhiteCard>
        )}

        <Section title="Informações pessoais" c={c}>
          <SettingRow icon="person-outline" label="Nome" value={user?.nome ?? '—'} c={c} />
          <SettingRow icon="mail-outline" label="Email" value={user?.email ?? '—'} c={c} last />
        </Section>

        <Section title="Aparência" c={c}>
          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <Ionicons name={isDark ? 'moon' : 'moon-outline'} size={20} color={c.text} />
              <Text style={[styles.switchLabel, { color: c.text }]}>Tema escuro</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: c.border, true: c.turquoise }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Section>

        {user?.is_admin && (
          <Section title="Administração" c={c}>
            <ActionRow
              icon="add-circle-outline"
              label="Cadastrar instituição"
              color={c.orange}
              onPress={() => router.push('/admin/cadastrar-instituicao')}
              c={c}
            />
            <ActionRow
              icon="create-outline"
              label="Editar instituição"
              color={c.orange}
              onPress={() => router.push('/admin/editar-instituicao')}
              c={c}
              last
            />
          </Section>
        )}

        {user ? (
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={20} color={c.error} />
            <Text style={[styles.logoutText, { color: c.error }]}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => router.push('/auth')} style={styles.loginPrompt}>
            <Text style={[styles.loginPromptText, { color: c.orange }]}>
              Fazer login / Criar conta
            </Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.version, { color: c.placeholder }]}>Sou do Bem v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children, c }: { title: string; children: React.ReactNode; c: ThemeColors }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={[styles.sectionTitle, { color: c.textMuted }]}>{title}</Text>
      <WhiteCard style={styles.sectionCard}>{children}</WhiteCard>
    </View>
  );
}

function SettingRow({ icon, label, value, c, last }: { icon: string; label: string; value: string; c: ThemeColors; last?: boolean }) {
  return (
    <View style={[styles.row, !last && { borderBottomWidth: 1, borderBottomColor: c.border }]}>
      <Ionicons name={icon as any} size={20} color={c.text} />
      <Text style={[styles.rowLabel, { color: c.text }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: c.textMuted }]} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function ActionRow({ icon, label, color, onPress, c, last }: { icon: string; label: string; color: string; onPress: () => void; c: ThemeColors; last?: boolean }) {
  return (
    <TouchableOpacity style={[styles.row, !last && { borderBottomWidth: 1, borderBottomColor: c.border }]} onPress={onPress}>
      <Ionicons name={icon as any} size={20} color={color} />
      <Text style={[styles.rowLabel, { color }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={c.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingTop: 28, gap: 20, paddingBottom: 40 },
  pageTitle: { ...Typography.titleLarge },
  accountCard: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20 },
  accountAvatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  accountAvatarText: { ...Typography.displayMedium, fontSize: 22 },
  accountInfo: { flex: 1, gap: 4 },
  accountName: { ...Typography.titleSmall },
  accountEmail: { ...Typography.bodySmall },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  adminBadgeText: { ...Typography.labelSmall, color: '#FFFFFF', fontSize: 10 },
  sectionTitle: { ...Typography.labelLarge, paddingHorizontal: 4 },
  sectionCard: { padding: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLabel: { ...Typography.bodyMedium, flex: 1 },
  rowValue: { ...Typography.bodyMedium, maxWidth: 160 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  switchLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  switchLabel: { ...Typography.bodyMedium },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  logoutText: { ...Typography.titleSmall },
  loginPrompt: { alignItems: 'center', paddingVertical: 16 },
  loginPromptText: { ...Typography.titleSmall, textDecorationLine: 'underline' },
  version: { ...Typography.bodySmall, textAlign: 'center' },
});
