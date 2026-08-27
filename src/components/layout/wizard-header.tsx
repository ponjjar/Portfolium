import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/ui/language-selector';

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

  const handleClose = () => {
    if (onClose) onClose();
    else router.replace('/');
  };

  return (
    <View className="pt-12 pb-8 px-6 bg-background">
      {/* Top Bar */}
      <View className="flex-row items-center justify-between mb-12">
        <Text className="text-white font-bold tracking-[0.2em] uppercase text-sm">
          {t('common.portfolio_builder')}
        </Text>
        <View className="flex-row items-center gap-4">
          <LanguageSelector />
          <Pressable onPress={handleClose} className="p-2 -mr-2">
            <X color="#fff" size={20} />
          </Pressable>
        </View>
      </View>

      {/* Progress */}
      <View className="mb-8">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-text-secondary text-[10px] uppercase tracking-wider font-bold">
            {t('common.step_of', { step, total: totalSteps })}
          </Text>
          <Text className="text-text-secondary text-[10px] uppercase tracking-wider font-bold">
            {percentage}%
          </Text>
        </View>
        <View className="h-[1px] bg-border w-full relative">
          <View 
            className="absolute left-0 top-0 bottom-0 bg-white" 
            style={{ width: `${percentage}%` }} 
          />
        </View>
      </View>

      {/* Titles */}
      <View>
        <Text className="text-white text-3xl font-bold mb-3">{title}</Text>
        {subtitle && (
          <Text className="text-text-secondary text-base leading-relaxed">
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
}
