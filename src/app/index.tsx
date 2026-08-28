import React, { useState, useEffect } from 'react';
import { View, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import HeroAscii from '@/components/ui/hero-ascii';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload, ArrowDown } from 'lucide-react-native';
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
    <View className="flex-1 bg-background justify-center items-center">
      <HeroAscii />
      
      {/* Overlay Drag and Drop */}
      {isDragging && (
        <View className="absolute inset-0 z-50 bg-[#000000cc] border-4 border-dashed border-[#ffffff44] items-center justify-center">
          <Upload size={64} color="var(--text)" className="mb-4" />
          <Text className="text-text text-3xl font-bold text-center">{t('welcome.drop_here')}</Text>
        </View>
      )}

      {/* Language and Theme Selectors na Home */}
      <View className="absolute top-12 right-6 z-50 flex-row gap-2">
        <ThemeSelector />
        <LanguageSelector />
      </View>

      {/* Content wrapper */}
      <View className="z-10 items-center px-6 w-full max-w-3xl mt-12">
        <Text className="text-text-secondary tracking-[0.2em] uppercase text-xs font-bold mb-6">
          {t('common.portfolio_builder')}
        </Text>
        
        <Text className="text-text text-5xl md:text-7xl font-bold text-center mb-6 leading-tight tracking-tight">
          {t('welcome.title')}
        </Text>
        
        <Text className="text-text-secondary text-base md:text-xl text-center mb-12 px-4 max-w-xl">
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
              <View className="bg-surface-elevated px-2 py-1 rounded ml-2">
                <Text className="text-text-secondary text-[10px] font-mono">.json</Text>
              </View>
            </View>
          </Button>
        </View>
        
        <Text className="text-text-secondary text-xs text-center mb-16 max-w-sm">
          {t('welcome.terms')}
        </Text>
      </View>
      
      <View className="absolute bottom-10 items-center">
        <Text className="text-text-secondary text-[10px] mb-2 tracking-widest uppercase">
          {t('common.scroll_to_discover')}
        </Text>
        <ArrowDown size={16} color="var(--text-secondary)" />
      </View>
    </View>
  );
}
