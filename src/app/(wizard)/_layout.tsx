import { Stack } from 'expo-router';

export default function WizardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000' } }}>
      <Stack.Screen name="profile" />
      <Stack.Screen name="projects" />
      <Stack.Screen name="skills" />
      <Stack.Screen name="ai" />
    </Stack>
  );
}
