import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { ArrowUpRight, Sparkles } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';

interface CircularBadgeTextProps {
  text?: string;
  size?: number;
  icon?: 'arrow' | 'sparkles';
}

export function CircularBadgeText({
  text: _text = '100% LOCAL-FIRST • VERIFIED',
  size = 100,
  icon = 'arrow',
}: CircularBadgeTextProps) {
  const colors = useThemeColors();
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 16000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [rotation]);

  const animatedRingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View
      className="items-center justify-center relative"
      style={{ width: size, height: size }}
    >
      {/* Outer Rotating Geometric Dashed Ring */}
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 1.5,
            borderColor: colors.borderStrong,
            borderStyle: 'dashed',
            position: 'absolute',
          },
          animatedRingStyle,
        ]}
      />

      {/* Outer Solid Ring */}
      <View
        style={{
          width: size - 14,
          height: size - 14,
          borderRadius: (size - 14) / 2,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          position: 'absolute',
        }}
      />

      {/* Center Core Badge */}
      <View
        className="rounded-full items-center justify-center shadow-lg"
        style={{
          width: size * 0.44,
          height: size * 0.44,
          backgroundColor: colors.surfaceElevated,
          borderWidth: 1,
          borderColor: colors.borderStrong,
        }}
      >
        {icon === 'arrow' ? (
          <ArrowUpRight size={size * 0.22} color={colors.primary} />
        ) : (
          <Sparkles size={size * 0.22} color={colors.primary} />
        )}
      </View>
    </View>
  );
}
