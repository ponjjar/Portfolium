import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface InfiniteMarqueeProps {
  items?: string[];
  reverse?: boolean;
}

const DEFAULT_ITEMS = [
  'LOCAL-FIRST SOVEREIGNTY',
  'GITHUB MANIFEST SCANNER',
  '9 VISUAL PRESETS & ORBIT LAYOUTS',
  'ATS-READY RESUME ENGINE',
  'HTML5 + CSS AUTOCONTIDO',
  'ZERO TRACKERS & ZERO LEAKS',
  'REACT 19 + EXPO SDK 57',
  'OPEN SOURCE MIT LICENSED',
];

export function InfiniteMarquee({ items = DEFAULT_ITEMS, reverse = false }: InfiniteMarqueeProps) {
  const translateX = useSharedValue(0);
  const content = [...items, ...items];

  useEffect(() => {
    const loopDistance = items.length * 200;
    translateX.value = 0;
    translateX.value = withRepeat(
      withTiming(reverse ? loopDistance : -loopDistance, {
        duration: items.length * 3200,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [items.length, reverse, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className="w-full overflow-hidden border-y border-border bg-surface/50 py-3">
      <Animated.View className="flex-row items-center" style={animatedStyle}>
        {content.map((item, index) => (
          <View key={index} className="flex-row items-center gap-4 px-4">
            <Text className="text-text font-black text-xs tracking-[0.18em] uppercase font-mono">
              {item}
            </Text>
            <Text className="text-primary text-xs font-black">✦</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}
