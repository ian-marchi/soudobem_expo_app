import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { Typography } from '../../constants/Typography';
import { Shadows } from '../../constants/Shadows';
import { useThemeColors } from '../../contexts/ThemeContext';

type TabName = 'home' | 'explorar' | 'doacoes' | 'config';

function SouDoBemIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 20 Q5 14 5 9 Q5 6 8 6 Q10 6 12 8 Q14 6 16 6 Q19 6 19 9 Q19 14 12 20Z"
        fill={color}
      />
      <Path d="M12 12 Q10 10 12 8 Q14 10 12 12Z" fill="white" opacity="0.85" />
    </Svg>
  );
}

function TabIcon({ name, focused, color }: { name: TabName; focused: boolean; color: string }) {
  const size = 22;
  const icons: Record<TabName, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
    home: { active: 'home', inactive: 'home-outline' },
    explorar: { active: 'search', inactive: 'search-outline' },
    doacoes: { active: 'heart', inactive: 'heart-outline' },
    config: { active: 'settings', inactive: 'settings-outline' },
  };

  if (name === 'doacoes') {
    return <SouDoBemIcon color={color} size={size} />;
  }

  return (
    <Ionicons
      name={focused ? icons[name].active : icons[name].inactive}
      size={size}
      color={color}
    />
  );
}

export default function TabLayout() {
  const c = useThemeColors();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          { backgroundColor: c.card, borderTopColor: c.border },
        ],
        tabBarActiveTintColor: c.orange,
        tabBarInactiveTintColor: c.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color }) => (
          <TabIcon name={route.name as TabName} focused={focused} color={color} />
        ),
        tabBarItemStyle: styles.tabItem,
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="explorar" options={{ title: 'Explorar' }} />
      <Tabs.Screen name="doacoes" options={{ title: 'Doações' }} />
      <Tabs.Screen name="config" options={{ title: 'Config' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingTop: 8,
    ...Shadows.bottomBar,
  },
  tabItem: { paddingVertical: 4 },
  tabLabel: { ...Typography.labelSmall, marginTop: 2 },
});
