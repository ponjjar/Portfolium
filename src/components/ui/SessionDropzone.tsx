import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Upload, FileCode, CheckCircle2, AlertCircle, ArrowUpRight, Sparkles } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { usePortfolioStore } from '@/store';
import { PortfolioSessionSchema } from '@/domain/portfolio/schema';
import { useThemeColors } from '@/theme/ThemeContext';

interface SessionDropzoneProps {
  onSuccess?: () => void;
  className?: string;
}

export function SessionDropzone({ onSuccess, className = '' }: SessionDropzoneProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const router = useRouter();
  const { importSession } = usePortfolioStore();

  const [isDragOver, setIsDragOver] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dropzoneRef = useRef<View>(null);

  const validateAndImport = React.useCallback(
    (rawContent: string) => {
      setIsValidating(true);
      setErrorMessage(null);

      try {
        let parsed: unknown;
        try {
          parsed = JSON.parse(rawContent);
        } catch {
          setErrorMessage(t('welcome.import_invalid'));
          setIsValidating(false);
          return;
        }

        const parseResult = PortfolioSessionSchema.safeParse(parsed);
        if (!parseResult.success) {
          // Provide friendly schema error
          setErrorMessage(t('welcome.import_invalid'));
          setIsValidating(false);
          return;
        }

        const imported = importSession(parseResult.data);
        if (imported) {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/(wizard)/profile');
          }
        } else {
          setErrorMessage(t('welcome.import_error'));
        }
      } catch {
        setErrorMessage(t('welcome.import_error'));
      } finally {
        setIsValidating(false);
      }
    },
    [importSession, onSuccess, router, t]
  );

  const handlePickDocument = async () => {
    try {
      setErrorMessage(null);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (Platform.OS === 'web' && asset.file) {
          const content = await asset.file.text();
          validateAndImport(content);
        } else {
          const content = await FileSystem.readAsStringAsync(asset.uri);
          validateAndImport(content);
        }
      }
    } catch {
      setErrorMessage(t('welcome.pick_error'));
    }
  };

  // Web-only drag & drop handlers bound to window and container
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    };

    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault();
      // Only reset if left the window
      if (e.relatedTarget === null) {
        setIsDragOver(false);
      }
    };

    const handleWindowDrop = async (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          const content = await file.text();
          validateAndImport(content);
        } else {
          setErrorMessage(t('welcome.drop_json_only'));
        }
      }
    };

    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, [t, validateAndImport]);

  return (
    <View ref={dropzoneRef} className={`w-full max-w-2xl mx-auto ${className}`}>
      <Pressable
        onPress={handlePickDocument}
        accessibilityRole="button"
        accessibilityLabel={t('landing.dropzone_title')}
        className={`group relative w-full p-8 sm:p-10 lg:p-12 rounded-3xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
          isDragOver
            ? 'border-primary bg-primary/10 scale-[1.01] shadow-2xl'
            : 'border-border hover:border-primary/50 bg-surface/90 hover:bg-surface-elevated'
        }`}
      >
        {/* Subtle Decorative Ambient Glow */}
        <View
          className={`absolute -right-8 -top-8 w-44 h-44 rounded-full blur-3xl pointer-events-none transition-opacity ${
            isDragOver ? 'bg-primary/25 opacity-100' : 'bg-primary/5 opacity-40 group-hover:opacity-80'
          }`}
        />

        <View className="flex-col items-center text-center">
          {/* Status Badge */}
          <View className="mb-5 px-3.5 py-1.5 rounded-full bg-surface-elevated border border-border flex-row items-center gap-2 shadow-sm">
            <Sparkles size={12} color={colors.primary} />
            <Text className="text-text-secondary text-xs font-mono font-medium tracking-wide">
              {t('landing.dropzone_badge')}
            </Text>
          </View>

          {/* Central Animated Icon Holder */}
          <View
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl items-center justify-center mb-5 transition-all duration-300 ${
              isDragOver
                ? 'bg-primary scale-110 shadow-xl shadow-primary/30'
                : 'bg-surface-elevated border border-border group-hover:border-primary/40 group-hover:scale-105'
            }`}
          >
            {isValidating ? (
              <ActivityIndicator color={colors.primary} />
            ) : isDragOver ? (
              <FileCode size={32} color={colors.primaryForeground} />
            ) : (
              <Upload size={30} color={colors.text} />
            )}
          </View>

          {/* Title & Prompts */}
          <Text className="text-text font-black text-xl sm:text-2xl uppercase tracking-tight mb-2.5">
            {isDragOver ? t('landing.dropzone_active') : t('landing.dropzone_title')}
          </Text>

          <Text className="text-text-secondary text-xs sm:text-sm font-normal max-w-lg mb-6 leading-relaxed">
            {isValidating ? t('landing.dropzone_validating') : t('landing.dropzone_prompt')}
          </Text>

          {/* Browse Trigger Button */}
          <View className="px-6 py-3 rounded-full bg-surface-elevated border border-border group-hover:border-primary/50 group-hover:bg-primary/10 flex-row items-center gap-2.5 shadow-sm active:scale-95 transition-all">
            <Text className="text-text group-hover:text-primary font-bold text-xs uppercase tracking-wider font-mono">
              {t('landing.dropzone_browse')}
            </Text>
            <ArrowUpRight size={14} color={colors.text} />
          </View>

          {/* Hint & Trust Guarantee */}
          <View className="mt-6 pt-5 border-t border-border/60 w-full flex-row items-center justify-center gap-2">
            <CheckCircle2 size={13} color={colors.primary} />
            <Text className="text-text-muted text-xs font-mono tracking-tight text-center">
              {t('landing.dropzone_hint')}
            </Text>
          </View>
        </View>
      </Pressable>

      {/* Inline Schema Error Alert */}
      {errorMessage && (
        <View className="mt-3 p-3.5 rounded-2xl bg-surface border border-border flex-row items-center justify-between shadow-lg">
          <View className="flex-row items-center gap-2.5 flex-1 pr-2">
            <AlertCircle size={16} color={colors.primary} />
            <Text className="text-text text-xs font-medium flex-1">{errorMessage}</Text>
          </View>
          <Pressable
            onPress={() => setErrorMessage(null)}
            className="px-2.5 py-1 rounded-lg bg-surface-elevated border border-border active:opacity-70"
          >
            <Text className="text-text-secondary text-xs font-mono">OK</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
