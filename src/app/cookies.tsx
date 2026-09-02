import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Pressable, Switch, Alert, Platform } from 'react-native';
import { ArrowLeft, Cookie, Shield, Check, Trash2, HardDrive, BarChart3 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeSelector } from '@/components/ui/ThemeSelector';
import { LanguageSelector } from '@/components/ui/language-selector';
import { Button } from '@/components/ui/button';

const COOKIE_PREFS_KEY = '@portfolio_builder_cookie_preferences';

export default function CookiesScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [sessionStorageEnabled, setSessionStorageEnabled] = useState(true);
  const [telemetryEnabled, setTelemetryEnabled] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    async function loadPrefs() {
      try {
        const saved = await AsyncStorage.getItem(COOKIE_PREFS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setSessionStorageEnabled(parsed.sessionStorage ?? true);
          setTelemetryEnabled(parsed.telemetry ?? false);
        }
      } catch {
        // Fallback silencioso
      }
    }
    loadPrefs();
  }, []);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem(
        COOKIE_PREFS_KEY,
        JSON.stringify({
          sessionStorage: sessionStorageEnabled,
          telemetry: telemetryEnabled,
          savedAt: new Date().toISOString(),
        })
      );
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 3000);
    } catch {
      // Ignorar erro
    }
  };

  const handleClearSession = async () => {
    const doClear = async () => {
      try {
        await AsyncStorage.removeItem('@portfolio_builder_session');
        if (Platform.OS === 'web') {
          window.alert(t('cookies.clear_success'));
        } else {
          Alert.alert('', t('cookies.clear_success'));
        }
      } catch {
        // Ignorar erro
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(t('cookies.clear_confirm'))) {
        await doClear();
      }
    } else {
      Alert.alert(
        t('cookies.clear_btn'),
        t('cookies.clear_confirm'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('common.confirm'), style: 'destructive', onPress: doClear },
        ]
      );
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border bg-surface">
        <Pressable
          onPress={() => router.push('/')}
          className="flex-row items-center gap-2 active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel={t('cookies.back_to_home')}
        >
          <ArrowLeft size={20} color="var(--text)" />
          <Text className="text-text font-bold text-base">{t('cookies.back_to_home')}</Text>
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
              <Cookie size={28} color="var(--primary)" />
            </View>
            <Text className="text-text text-3xl md:text-5xl font-extrabold text-center mb-2">
              {t('cookies.title')}
            </Text>
            <Text className="text-text-secondary text-base md:text-lg text-center max-w-xl">
              {t('cookies.subtitle')}
            </Text>
          </View>

          {/* Preference 1: Essential */}
          <View className="bg-surface border border-border rounded-3xl p-6 md:p-8 mb-4 flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <View className="flex-row items-center gap-2 mb-1">
                <Shield size={20} color="var(--primary)" />
                <Text className="text-text text-lg font-bold">{t('cookies.essential_title')}</Text>
              </View>
              <Text className="text-text-secondary text-sm leading-relaxed">
                {t('cookies.essential_desc')}
              </Text>
            </View>
            <View className="px-3 py-1.5 rounded-full bg-primary/10">
              <Text className="text-primary font-bold text-xs">{t('cookies.essential_status')}</Text>
            </View>
          </View>

          {/* Preference 2: Session Storage */}
          <View className="bg-surface border border-border rounded-3xl p-6 md:p-8 mb-4 flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <View className="flex-row items-center gap-2 mb-1">
                <HardDrive size={20} color="var(--primary)" />
                <Text className="text-text text-lg font-bold">{t('cookies.session_title')}</Text>
              </View>
              <Text className="text-text-secondary text-sm leading-relaxed">
                {t('cookies.session_desc')}
              </Text>
            </View>
            <Switch
              value={sessionStorageEnabled}
              onValueChange={setSessionStorageEnabled}
              trackColor={{ false: 'var(--border)', true: 'var(--primary)' }}
            />
          </View>

          {/* Preference 3: Telemetry */}
          <View className="bg-surface border border-border rounded-3xl p-6 md:p-8 mb-8 flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <View className="flex-row items-center gap-2 mb-1">
                <BarChart3 size={20} color="var(--primary)" />
                <Text className="text-text text-lg font-bold">{t('cookies.analytics_title')}</Text>
              </View>
              <Text className="text-text-secondary text-sm leading-relaxed">
                {t('cookies.analytics_desc')}
              </Text>
            </View>
            <Switch
              value={telemetryEnabled}
              onValueChange={setTelemetryEnabled}
              trackColor={{ false: 'var(--border)', true: 'var(--primary)' }}
            />
          </View>

          {/* Save Button */}
          <View className="items-center mb-12">
            <Button
              onPress={handleSave}
              className="w-full md:w-auto h-12 md:h-14 px-10 bg-primary rounded-full"
            >
              <View className="flex-row items-center justify-center gap-2">
                {savedFeedback ? (
                  <>
                    <Check size={18} color="var(--primary-foreground)" />
                    <Text className="text-primary-foreground font-bold text-base">{t('cookies.saved_success')}</Text>
                  </>
                ) : (
                  <Text className="text-primary-foreground font-bold text-base">{t('cookies.save_btn')}</Text>
                )}
              </View>
            </Button>
          </View>

          {/* Danger Zone: Clear Storage */}
          <View className="border border-border rounded-3xl p-6 items-center bg-surface">
            <Pressable
              onPress={handleClearSession}
              className="flex-row items-center gap-2 py-2 px-4 rounded-xl border border-border-strong active:opacity-70"
            >
              <Trash2 size={16} color="var(--text-muted)" />
              <Text className="text-text-secondary font-bold text-sm">{t('cookies.clear_btn')}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
