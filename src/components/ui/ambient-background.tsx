import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { ThemeId } from '@/theme/ThemeContext';

interface AmbientBackgroundProps {
  theme: ThemeId;
}

const getColors = (theme: ThemeId) => {
  switch (theme) {
    case 'lava': return ['#40100C', '#2A0A08'];
    case 'amoled': return ['#0A0A0A', '#050510'];
    case 'light': return ['#e5e7eb', '#f3f4f6'];
    case 'dark':
    default: return ['#1e1b4b', '#172554']; // dark purple/blue
  }
};

export function AmbientBackground({ theme }: AmbientBackgroundProps) {
  const { width, height } = useWindowDimensions();
  const colors = getColors(theme);
  
  const rotation1 = useSharedValue(0);
  const rotation2 = useSharedValue(0);
  
  useEffect(() => {
    rotation1.value = withRepeat(
      withTiming(360, { duration: 25000, easing: Easing.linear }),
      -1,
      false
    );
    rotation2.value = withRepeat(
      withTiming(-360, { duration: 30000, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation1, rotation2]);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation1.value}deg` }, { translateX: width * 0.1 }]
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation2.value}deg` }, { translateX: -(width * 0.1) }]
  }));

  const isWeb = Platform.OS === 'web';

  return (
    <View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]} pointerEvents="none">
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: isWeb ? width * 0.8 : width * 1.5,
            height: isWeb ? width * 0.8 : width * 1.5,
            borderRadius: isWeb ? width * 0.4 : width * 0.75,
            backgroundColor: colors[0],
            top: -height * 0.1,
            left: -width * 0.1,
            opacity: isWeb ? 0.6 : 0.15,
            ...(isWeb ? { filter: 'blur(100px)' } : {}) as any,
          },
          animatedStyle1
        ]}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: isWeb ? width * 0.9 : width * 1.5,
            height: isWeb ? width * 0.9 : width * 1.5,
            borderRadius: isWeb ? width * 0.45 : width * 0.75,
            backgroundColor: colors[1],
            bottom: -height * 0.1,
            right: -width * 0.1,
            opacity: isWeb ? 0.5 : 0.15,
            ...(isWeb ? { filter: 'blur(120px)' } : {}) as any,
          },
          animatedStyle2
        ]}
      />
    </View>
  );
}
