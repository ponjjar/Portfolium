import { View, Text, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { tokens } from '../theme/tokens';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: tokens.colors.text.main,
  },
  link: {
    marginTop: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
  },
  linkText: {
    fontSize: 14,
    color: tokens.colors.primary,
  },
});
