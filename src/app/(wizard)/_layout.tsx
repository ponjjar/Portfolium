import { Stack } from 'expo-router';
import { View } from 'react-native';
import { GlobalHeader } from '@/components/layout/global-header';
import { TurnstileProvider } from '@/components/ui/TurnstileProvider';

export default function WizardLayout() {
  return (
    <TurnstileProvider>
      <View className="flex-1 bg-background">
        <GlobalHeader />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
          <Stack.Screen name="profile" />
          <Stack.Screen name="experience" />
          <Stack.Screen name="projects" />
          <Stack.Screen name="skills" />
          <Stack.Screen name="ai" />
          <Stack.Screen name="editor" />
        </Stack>
      </View>
    </TurnstileProvider>
  );
}
