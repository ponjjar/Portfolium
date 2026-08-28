import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Text, Button, View } from 'react-native';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: {
      View: RN.View,
      Text: RN.Text,
      ScrollView: RN.ScrollView,
      createAnimatedComponent: (c: any) => c,
    },
    useSharedValue: (init: any) => ({ value: init }),
    useAnimatedStyle: (fn: any) => fn(),
    withTiming: (toValue: any, _config: any, cb: any) => {
      if (cb) cb(true);
      return toValue;
    },
    withRepeat: (anim: any) => anim,
    withSequence: (...anims: any[]) => anims[0],
    Easing: {
      bezier: () => (t: number) => t,
      inOut: () => (t: number) => t,
      ease: (t: number) => t,
      linear: (t: number) => t,
    },
    runOnJS: (fn: any) => fn,
  };
});

import { ThemeProvider, useTheme, getThemeBackground } from '../../src/theme/ThemeContext';
import { ThemeSelector } from '../../src/components/ui/ThemeSelector';

function ThemeConsumer() {
  const { theme, setTheme } = useTheme();
  return (
    <View>
      <Text testID="theme-value">{theme}</Text>
      <Button title="Set Light" onPress={() => setTheme('light', 100, 100)} />
      <Button title="Set Lava" onPress={() => setTheme('lava', 0, 0)} />
      <Button title="Set Amoled" onPress={() => setTheme('amoled', 200, 200)} />
    </View>
  );
}

describe('ThemeContext & getThemeBackground', () => {
  it('should return correct background colors matching global.css tokens', () => {
    expect(getThemeBackground('light')).toBe('#F7F7F5');
    expect(getThemeBackground('lava')).toBe('#211515');
    expect(getThemeBackground('dark')).toBe('#222222');
    expect(getThemeBackground('amoled')).toBe('#000000');
  });

  it('should initialize with default dark theme and update state', async () => {
    let tree: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(
        <ThemeProvider>
          <ThemeConsumer />
          <ThemeSelector />
        </ThemeProvider>
      );
    });

    const textNode = tree!.root.findByProps({ testID: 'theme-value' });
    expect(textNode.props.children).toBe('dark');

    // Switch theme directly (x=0, y=0)
    const lavaButton = tree!.root.findByProps({ title: 'Set Lava' });
    await act(async () => {
      lavaButton.props.onPress();
    });

    expect(tree!.root.findByProps({ testID: 'theme-value' }).props.children).toBe('lava');
  });
});
