import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/ui/language-selector';
import { ThemeSelector } from '@/components/ui/ThemeSelector';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, FadeIn } from 'react-native-reanimated';

interface WizardHeaderProps {
  step: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  onClose?: () => void;
}

export function WizardHeader({ step, totalSteps = 5, title, subtitle, onClose }: WizardHeaderProps) {
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

  const handleClose = () => {
    if (onClose) onClose();
    else router.replace('/');
  };

  return (
    <View className="pt-12 pb-8 px-6 bg-background">
      {/* Top Bar */}
      <View className="flex-row items-center justify-between mb-12">
        <Text className="text-text font-bold tracking-[0.2em] uppercase text-sm">
          {t('common.portfolio_builder')}
        </Text>
        <View className="flex-row gap-2 relative z-50">
          <ThemeSelector />
          <LanguageSelector />
          <TouchableOpacity 
            onPress={handleClose}
            className="w-10 h-10 items-center justify-center rounded-full bg-surface border border-border"
            accessibilityLabel={t('common.close')}
          >
            <X size={18} color="var(--text)" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress */}
      <View className="mb-8">
        <View className="flex-row items-center justify-between mb-4">
          <Animated.Text entering={FadeIn} key={`step-${step}`} className="text-text-secondary text-[10px] uppercase tracking-wider font-bold">
            {t('common.step_of', { step, total: totalSteps })}
          </Animated.Text>
          <Animated.Text entering={FadeIn} key={`perc-${percentage}`} className="text-text-secondary text-[10px] uppercase tracking-wider font-bold">
            {percentage}%
          </Animated.Text>
        </View>
        <View className="h-[1px] bg-border w-full relative">
          <Animated.View 
            className="absolute left-0 top-0 bottom-0 bg-text" 
            style={animatedProgressStyle} 
          />
        </View>
      </View>

      {/* Titles */}
      <Animated.View entering={FadeIn.duration(400)}>
        <Text className="text-text text-3xl font-bold mb-3">{title}</Text>
        {subtitle && (
          <Text className="text-text-secondary text-base leading-relaxed">
            {subtitle}
          </Text>
        )}
      </Animated.View>
    </View>
  );
}
