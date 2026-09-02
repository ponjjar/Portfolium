import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { ArrowLeft, FileText, ShieldCheck, Scale, AlertCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { ThemeSelector } from '@/components/ui/ThemeSelector';
import { LanguageSelector } from '@/components/ui/language-selector';

export default function TermsOfUseScreen() {
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
          accessibilityLabel={t('terms.back_to_home')}
        >
          <ArrowLeft size={20} color="var(--text)" />
          <Text className="text-text font-bold text-base">{t('terms.back_to_home')}</Text>
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
          <View className="items-center mb-10 text-center">
            <View className="w-14 h-14 rounded-2xl bg-primary/10 items-center justify-center mb-4">
              <FileText size={28} color="var(--primary)" />
            </View>
            <Text className="text-text text-3xl md:text-5xl font-extrabold text-center mb-2">
              {t('terms.title')}
            </Text>
            <Text className="text-text-muted text-sm text-center mb-4">
              {t('terms.last_updated')}
            </Text>
            <Text className="text-text-secondary text-base md:text-lg text-center leading-relaxed">
              {t('terms.intro')}
            </Text>
          </View>

          {/* Section 1 */}
          <View className="bg-surface border border-border rounded-3xl p-6 md:p-8 mb-6">
            <View className="flex-row items-center gap-3 mb-3">
              <ShieldCheck size={22} color="var(--primary)" />
              <Text className="text-text text-xl font-bold">{t('terms.sec1_title')}</Text>
            </View>
            <Text className="text-text-secondary leading-relaxed text-base">
              {t('terms.sec1_desc')}
            </Text>
          </View>

          {/* Section 2 */}
          <View className="bg-surface border border-border rounded-3xl p-6 md:p-8 mb-6">
            <View className="flex-row items-center gap-3 mb-3">
              <Scale size={22} color="var(--primary)" />
              <Text className="text-text text-xl font-bold">{t('terms.sec2_title')}</Text>
            </View>
            <Text className="text-text-secondary leading-relaxed text-base">
              {t('terms.sec2_desc')}
            </Text>
          </View>

          {/* Section 3 */}
          <View className="bg-surface border border-border rounded-3xl p-6 md:p-8 mb-6">
            <View className="flex-row items-center gap-3 mb-3">
              <AlertCircle size={22} color="var(--primary)" />
              <Text className="text-text text-xl font-bold">{t('terms.sec3_title')}</Text>
            </View>
            <Text className="text-text-secondary leading-relaxed text-base">
              {t('terms.sec3_desc')}
            </Text>
          </View>

          {/* Section 4 */}
          <View className="bg-surface border border-border rounded-3xl p-6 md:p-8 mb-12">
            <View className="flex-row items-center gap-3 mb-3">
              <FileText size={22} color="var(--primary)" />
              <Text className="text-text text-xl font-bold">{t('terms.sec4_title')}</Text>
            </View>
            <Text className="text-text-secondary leading-relaxed text-base">
              {t('terms.sec4_desc')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
