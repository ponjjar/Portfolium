import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { ArrowLeft, Sparkles, Database, Layers, Palette, ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { ThemeSelector } from '@/components/ui/ThemeSelector';
import { LanguageSelector } from '@/components/ui/language-selector';
import { Button } from '@/components/ui/button';

export default function AboutUsScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border bg-surface">
        <Pressable
          onPress={() => router.push('/')}
          className="flex-row items-center gap-2 active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel={t('about.back_to_home')}
        >
          <ArrowLeft size={20} color="var(--text)" />
          <Text className="text-text font-bold text-base">{t('about.back_to_home')}</Text>
        </Pressable>

        <View className="flex-row items-center gap-2">
          <ThemeSelector />
          <LanguageSelector />
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 40, alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-3xl">
          {/* Header Section */}
          <View className="items-center mb-12 text-center">
            <View className="w-14 h-14 rounded-2xl bg-primary/10 items-center justify-center mb-4">
              <Sparkles size={28} color="var(--primary)" />
            </View>
            <Text className="text-text text-3xl md:text-5xl font-extrabold text-center mb-3">
              {t('about.title')}
            </Text>
            <Text className="text-primary font-bold text-base md:text-lg text-center tracking-wide">
              {t('about.hero_slogan')}
            </Text>
          </View>

          {/* Mission Section */}
          <View className="bg-surface border border-border rounded-3xl p-6 md:p-8 mb-8">
            <Text className="text-text text-2xl font-extrabold mb-4">{t('about.mission_title')}</Text>
            <Text className="text-text-secondary leading-relaxed text-base md:text-lg">
              {t('about.mission_desc')}
            </Text>
          </View>

          {/* Core Pillars */}
          <Text className="text-text text-2xl font-extrabold mb-6 text-center md:text-left">
            {t('about.pillars_title')}
          </Text>

          <View className="flex-col gap-4 mb-12">
            <View className="bg-surface border border-border rounded-3xl p-6 flex-row items-start gap-4">
              <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center shrink-0 mt-1">
                <Database size={20} color="var(--primary)" />
              </View>
              <View className="flex-1">
                <Text className="text-text text-lg font-bold mb-1">{t('about.pillar1_title')}</Text>
                <Text className="text-text-secondary text-base leading-relaxed">{t('about.pillar1_desc')}</Text>
              </View>
            </View>

            <View className="bg-surface border border-border rounded-3xl p-6 flex-row items-start gap-4">
              <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center shrink-0 mt-1">
                <Layers size={20} color="var(--primary)" />
              </View>
              <View className="flex-1">
                <Text className="text-text text-lg font-bold mb-1">{t('about.pillar2_title')}</Text>
                <Text className="text-text-secondary text-base leading-relaxed">{t('about.pillar2_desc')}</Text>
              </View>
            </View>

            <View className="bg-surface border border-border rounded-3xl p-6 flex-row items-start gap-4">
              <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center shrink-0 mt-1">
                <Palette size={20} color="var(--primary)" />
              </View>
              <View className="flex-1">
                <Text className="text-text text-lg font-bold mb-1">{t('about.pillar3_title')}</Text>
                <Text className="text-text-secondary text-base leading-relaxed">{t('about.pillar3_desc')}</Text>
              </View>
            </View>
          </View>

          {/* CTA Box */}
          <View className="bg-surface-elevated border border-border rounded-3xl p-8 items-center text-center">
            <Text className="text-text text-2xl font-bold mb-4 text-center">{t('about.cta_title')}</Text>
            <Button
              onPress={() => router.push('/(wizard)/profile')}
              className="h-12 md:h-14 px-8 bg-primary rounded-full"
            >
              <View className="flex-row items-center justify-center gap-2">
                <Text className="text-primary-foreground font-bold text-base">{t('about.cta_btn')}</Text>
                <ArrowRight size={18} color="var(--primary-foreground)" />
              </View>
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
