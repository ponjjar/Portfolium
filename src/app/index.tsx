import React, { useState, useEffect } from 'react';
import { View, Text, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import HeroAscii from '@/components/ui/hero-ascii';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload, ArrowDown, Database, Layout, Code2, FileText, Lock, Box, FileCode2 } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { usePortfolioStore } from '@/store';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/ui/language-selector';
import { ThemeSelector } from '@/components/ui/ThemeSelector';

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { importSession } = usePortfolioStore();
  const [isDragging, setIsDragging] = useState(false);
  const [importing, setImporting] = useState(false);

  const processJsonContent = React.useCallback((content: string) => {
    try {
      const data = JSON.parse(content);
      const success = importSession(data);
      if (success) {
        alert(t('welcome.import_success'));
        router.push('/(wizard)/profile');
      } else {
        alert(t('welcome.import_invalid'));
      }
    } catch {
      alert(t('welcome.import_error'));
    }
    setImporting(false);
  }, [importSession, router, t]);

  const handlePickFile = async () => {
    try {
      setImporting(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        if (Platform.OS === 'web' && asset.file) {
          const content = await asset.file.text();
          processJsonContent(content);
        } else {
          const content = await FileSystem.readAsStringAsync(asset.uri);
          processJsonContent(content);
        }
      } else {
        setImporting(false);
      }
    } catch {
      alert(t('welcome.pick_error'));
      setImporting(false);
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          setImporting(true);
          const content = await file.text();
          processJsonContent(content);
        } else {
          alert(t('welcome.drop_json_only'));
        }
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [processJsonContent, t]);
  
  return (
    <View className="flex-1 bg-background">
      {/* Absolute Overlays */}
      {isDragging && (
        <View className="absolute inset-0 z-50 bg-[#000000cc] border-4 border-dashed border-[#ffffff44] items-center justify-center">
          <Upload size={64} color="var(--text)" className="mb-4" />
          <Text className="text-text text-3xl font-bold text-center">{t('welcome.drop_here')}</Text>
        </View>
      )}

      <View className="absolute top-6 right-6 z-50 flex-row gap-2">
        <ThemeSelector />
        <LanguageSelector />
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION 1: HERO */}
        <View className="w-full h-screen justify-center items-center relative overflow-hidden">
          <View className="absolute inset-0 z-0">
            <HeroAscii />
          </View>
          
          <View className="z-10 items-center px-6 w-full max-w-4xl mt-12">
            <Text className="text-text-secondary tracking-[0.2em] uppercase text-xs font-bold mb-6">
              {t('common.portfolio_builder')}
            </Text>
            
            <Text className="text-text text-6xl md:text-8xl font-black text-center mb-6 leading-[1.1] tracking-tight">
              {t('welcome.title')}
            </Text>
            
            <Text className="text-text-secondary text-lg md:text-2xl text-center mb-12 px-4 max-w-2xl font-light">
              {t('welcome.subtitle')}
            </Text>
            
            <View className="flex-row flex-wrap justify-center gap-4 mb-16 w-full">
              <Button 
                onPress={() => router.push('/(wizard)/profile')}
                className="w-full md:w-auto h-14 px-8 bg-primary"
              >
                <View className="flex-row items-center">
                  <Text className="text-primary-foreground font-bold mr-2 text-base">{t('welcome.start')}</Text>
                  <ArrowRight size={18} color="var(--primary-foreground)" />
                </View>
              </Button>
              
              <Button 
                variant="outline" 
                onPress={handlePickFile}
                isLoading={importing}
                className="w-full md:w-auto h-14 px-8 border-border"
              >
                <View className="flex-row items-center">
                  <Upload size={18} color="var(--text)" className="mr-2" />
                  <Text className="text-text font-bold mr-2 text-base">{t('welcome.import_session')}</Text>
                </View>
              </Button>
            </View>
          </View>
          
          <View className="absolute bottom-10 items-center animate-bounce">
            <Text className="text-text-secondary text-[10px] mb-2 tracking-widest uppercase">
              {t('common.scroll_to_discover')}
            </Text>
            <ArrowDown size={16} color="var(--text-secondary)" />
          </View>
        </View>

        {/* SECTION 2: THE HUB (BASE) */}
        <View className="w-full min-h-screen justify-center items-center px-6 py-24 bg-surface">
          <View className="max-w-4xl w-full">
            <View className="items-center mb-16">
              <View className="w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center mb-6">
                <Database size={32} color="var(--primary)" />
              </View>
              <Text className="text-text text-4xl md:text-6xl font-bold text-center mb-4">
                {t('welcome.hub_title')}
              </Text>
              <Text className="text-text-secondary text-lg md:text-xl text-center max-w-2xl">
                {t('welcome.hub_desc')}
              </Text>
            </View>

            <View className="flex-row flex-wrap justify-center gap-4">
              {['Perfil', 'Projetos', 'Tecnologias', 'Experiências', 'Links', 'Social'].map(tag => (
                <View key={tag} className="px-6 py-3 rounded-full border border-border bg-background">
                  <Text className="text-text font-bold">{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* SECTION 3: RESULTADOS (FIBONACCI) */}
        <View className="w-full min-h-screen justify-center items-center px-6 py-24 bg-background">
          <View className="max-w-6xl w-full">
            <View className="mb-16">
              <Text className="text-text text-4xl md:text-6xl font-bold mb-4">
                {t('welcome.results_title')}
              </Text>
              <Text className="text-text-secondary text-lg md:text-xl max-w-2xl">
                {t('welcome.results_desc')}
              </Text>
            </View>

            <View className="flex-col md:flex-row gap-6">
              <View className="flex-1 bg-surface border border-border rounded-3xl p-8 min-h-[300px]">
                <Layout size={32} color="var(--text)" className="mb-6" />
                <Text className="text-text text-2xl font-bold mb-3">{t('welcome.result_portfolio')}</Text>
                <Text className="text-text-secondary leading-relaxed">{t('welcome.result_portfolio_desc')}</Text>
              </View>

              <View className="flex-1 flex-col gap-6">
                <View className="flex-1 bg-surface border border-border rounded-3xl p-8">
                  <Code2 size={32} color="var(--text)" className="mb-6" />
                  <Text className="text-text text-2xl font-bold mb-3">{t('welcome.result_readme')}</Text>
                  <Text className="text-text-secondary leading-relaxed">{t('welcome.result_readme_desc')}</Text>
                </View>
                
                <View className="flex-1 bg-surface border border-border rounded-3xl p-8">
                  <FileText size={32} color="var(--text)" className="mb-6" />
                  <Text className="text-text text-2xl font-bold mb-3">{t('welcome.result_cv')}</Text>
                  <Text className="text-text-secondary leading-relaxed">{t('welcome.result_cv_desc')}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* SECTION 4: INTEGRAÇÕES */}
        <View className="w-full min-h-screen justify-center items-center px-6 py-24 bg-surface">
          <View className="max-w-4xl w-full items-center">
            <View className="w-16 h-16 rounded-2xl bg-[#10b981]/10 items-center justify-center mb-6">
              <Code2 size={32} color="#10b981" />
            </View>
            <Text className="text-text text-4xl md:text-6xl font-bold text-center mb-4">
              {t('welcome.integrations_title')}
            </Text>
            <Text className="text-text-secondary text-lg md:text-xl text-center max-w-2xl mb-16">
              {t('welcome.integrations_desc')}
            </Text>
            <View className="w-full max-w-2xl h-64 bg-background border border-border rounded-3xl items-center justify-center">
              <FileCode2 size={48} color="var(--border-strong)" />
              <Text className="text-text-secondary mt-4">Conecte com sua conta GitHub</Text>
            </View>
          </View>
        </View>

        {/* SECTION 5: PRIVACIDADE & FINAL */}
        <View className="w-full min-h-screen justify-center items-center px-6 py-24 bg-background">
          <View className="max-w-4xl w-full items-center text-center">
            <View className="w-16 h-16 rounded-2xl bg-blue-500/10 items-center justify-center mb-6">
              <Lock size={32} color="#3b82f6" />
            </View>
            <Text className="text-text text-4xl md:text-6xl font-bold text-center mb-4">
              {t('welcome.privacy_title')}
            </Text>
            <Text className="text-text-secondary text-lg md:text-xl text-center max-w-2xl mb-16">
              {t('welcome.privacy_desc')}
            </Text>
            
            <View className="w-full p-12 bg-surface border border-border rounded-3xl items-center mb-8">
              <Text className="text-text text-3xl font-bold mb-8">Tudo pronto para começar?</Text>
              <Button 
                onPress={() => router.push('/(wizard)/profile')}
                className="h-14 px-12 bg-primary"
              >
                <Text className="text-primary-foreground font-bold text-lg">{t('welcome.start')}</Text>
              </Button>
            </View>

            <Text className="text-text-secondary text-xs text-center max-w-sm">
              {t('welcome.terms')}
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
