import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Página não encontrada' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Esta tela não existe.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Voltar ao início</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    ...Typography.titleMedium,
    color: Colors.darkGray,
  },
  link: {
    marginTop: 20,
    paddingVertical: 12,
  },
  linkText: {
    ...Typography.bodyMedium,
    color: Colors.orange,
    textDecorationLine: 'underline',
  },
});
