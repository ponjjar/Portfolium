import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, { Easing, Extrapolation, FadeIn, interpolate, SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface WizardHeaderProps {
  step: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  scrollY?: SharedValue<number>;
}

export function WizardHeader({ step, totalSteps = 5, title, subtitle, scrollY }: WizardHeaderProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const percentage = Math.round((step / totalSteps) * 100);

  const progress = useSharedValue(percentage);

  useEffect(() => {
    progress.value = withTiming(percentage, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
  }, [percentage, progress]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
    };
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    if (!scrollY) return {};
    const paddingBottom = interpolate(scrollY.value, [0, 100], [16, 0], Extrapolation.CLAMP);
    return { paddingBottom };
  });

  const animatedTitleStyle = useAnimatedStyle(() => {
    if (!scrollY) return {};
    const scale = interpolate(scrollY.value, [0, 100], [1, 0.85], Extrapolation.CLAMP);
    const translateY = interpolate(scrollY.value, [0, 100], [0, -4], Extrapolation.CLAMP);
    return {
      transformOrigin: '0% 0%',
      transform: [{ scale }, { translateY }]
    };
  });

  const animatedSubtitleStyle = useAnimatedStyle(() => {
    if (!scrollY) return {};
    const opacity = interpolate(scrollY.value, [0, 50], [1, 0], Extrapolation.CLAMP);
    const height = interpolate(scrollY.value, [0, 50], [24, 0], Extrapolation.CLAMP);
    return { opacity, height, overflow: 'hidden' };
  });

  return (
    <Animated.View className="pt-4 bg-background w-full border-b border-transparent" style={animatedHeaderStyle}>
      <View className="w-full max-w-5xl mx-auto px-6">
        {/* Progress */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Animated.Text entering={FadeIn} key={`step-${step}`} className="text-text text-[10px] uppercase tracking-wider font-bold">
              {t('common.step_of', { step, total: totalSteps })}
            </Animated.Text>
            <Animated.Text entering={FadeIn} key={`perc-${percentage}`} className="text-text text-[10px] uppercase tracking-wider font-bold">
              {percentage}%
            </Animated.Text>
          </View>
          <View className="h-[2px] bg-border w-full relative rounded-full overflow-hidden">
            <Animated.View
              className="absolute left-0 top-0 bottom-0 bg-primary"
              style={animatedProgressStyle}
            />
          </View>
        </View>

        {/* Titles */}
        <View className="flex-col justify-end min-h-[40px]">
          <Animated.View style={animatedTitleStyle} entering={FadeIn.duration(400)}>
            <Text className="text-text text-2xl md:text-3xl font-bold mb-1" numberOfLines={1}>{title}</Text>
          </Animated.View>

          {subtitle && (
            <Animated.View style={animatedSubtitleStyle}>
              <Text className="text-text-secondary text-sm md:text-base leading-relaxed">
                {subtitle}
              </Text>
            </Animated.View>
          )}
        </View>
      </View>
    </Animated.View>
  );
}
