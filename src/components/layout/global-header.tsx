import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/ui/language-selector';
import { ThemeSelector } from '@/components/ui/ThemeSelector';

export function GlobalHeader() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleClose = () => {
    router.replace('/');
  };

  return (
    <View className="w-full pt-8 pb-4 px-6 bg-background border-b border-border z-50">
      <View className="w-full mx-auto flex-row items-center justify-between">
        <Text className="text-text font-bold tracking-[0.2em] uppercase text-sm">
          {t('common.portfolio_builder')}
        </Text>
        <View className="flex-row gap-2 relative">
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
    </View>
  );
}
