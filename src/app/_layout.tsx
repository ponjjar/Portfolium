import '../global.css';
import '../i18n';
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { loadSession } from '../storage';
import { usePortfolioStore } from '../store';
import { View, ActivityIndicator } from 'react-native';
import { ThemeProvider } from '../theme/ThemeContext';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const { importSession } = usePortfolioStore();

  useEffect(() => {
    async function init() {
      const savedSession = await loadSession();
      if (savedSession) {
        importSession(savedSession);
      }
      setIsReady(true);
    }
    init();
  }, [importSession]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#101010', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#F5F5F5" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' } // Let ThemeProvider handle background
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(wizard)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
