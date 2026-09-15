import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/components/ui/modal';
import { Download, FileJson, FileCode, Globe, FolderArchive, FileText, CheckCircle2 } from 'lucide-react-native';
import { useThemeColors } from '@/theme/ThemeContext';

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
  onExportHtml: () => Promise<void> | void;
  onExportJson: () => Promise<void> | void;
  onExportZip: () => Promise<void> | void;
  onExportGitHubPages: () => Promise<void> | void;
  onExportMarkdown?: () => Promise<void> | void;
}

export function ExportModal({ 
  visible, 
  onClose, 
  onExportHtml, 
  onExportJson,
  onExportZip,
  onExportGitHubPages,
  onExportMarkdown,
}: ExportModalProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleAction = async (key: string, action: () => Promise<void> | void) => {
    setActiveAction(key);
    try {
      await action();
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={t('export_modal.title')}
      size="md"
    >
      <ScrollView className="py-2 max-h-[75vh]" showsVerticalScrollIndicator={false}>
        <Text className="text-text-secondary text-sm mb-6">
          {t('export_modal.subtitle')}
        </Text>

        <View className="gap-4">
          
          {/* HTML Export Card */}
          <View className="border border-border rounded-2xl p-5 bg-surface-elevated shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-2.5">
                <View className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 items-center justify-center">
                  <FileCode color={colors.primary} size={18} />
                </View>
                <Text className="text-text font-bold text-base tracking-tight">
                  {t('export_modal.html_title')}
                </Text>
              </View>
              <View className="px-2 py-0.5 rounded-full bg-primary/15 border border-primary/25">
                <Text className="text-primary font-mono font-bold text-xs uppercase">.html</Text>
              </View>
            </View>
            <Text className="text-text-secondary text-xs sm:text-sm mb-4 leading-relaxed">
              {t('export_modal.html_desc')}
            </Text>
            <TouchableOpacity 
              onPress={() => handleAction('html', onExportHtml)}
              disabled={activeAction !== null}
              className="bg-primary py-3 px-4 rounded-xl items-center flex-row justify-center gap-2 active:opacity-90"
              accessibilityRole="button"
              accessibilityLabel={t('export_modal.html_btn')}
            >
              {activeAction === 'html' ? (
                <ActivityIndicator size="small" color={colors.primaryForeground} />
              ) : (
                <Download color={colors.primaryForeground} size={16} />
              )}
              <Text className="text-primary-foreground font-bold text-sm">
                {t('export_modal.html_btn')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ZIP Export Card */}
          <View className="border border-border rounded-2xl p-5 bg-surface-elevated shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-2.5">
                <View className="w-8 h-8 rounded-xl bg-surface border border-border items-center justify-center">
                  <FolderArchive color={colors.text} size={18} />
                </View>
                <Text className="text-text font-bold text-base tracking-tight">
                  {t('export_modal.zip_title')}
                </Text>
              </View>
              <View className="px-2 py-0.5 rounded-full bg-surface border border-border">
                <Text className="text-text-muted font-mono font-bold text-xs uppercase">.zip</Text>
              </View>
            </View>
            <Text className="text-text-secondary text-xs sm:text-sm mb-4 leading-relaxed">
              {t('export_modal.zip_desc')}
            </Text>
            <TouchableOpacity 
              onPress={() => handleAction('zip', onExportZip)}
              disabled={activeAction !== null}
              className="bg-surface border border-border py-3 px-4 rounded-xl items-center flex-row justify-center gap-2 active:bg-surface-elevated"
              accessibilityRole="button"
              accessibilityLabel={t('export_modal.zip_btn')}
            >
              {activeAction === 'zip' ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <Download color={colors.text} size={16} />
              )}
              <Text className="text-text font-bold text-sm">
                {t('export_modal.zip_btn')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Technical Resume Markdown Card */}
          {onExportMarkdown && (
            <View className="border border-border rounded-2xl p-5 bg-surface-elevated shadow-sm">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-2.5">
                  <View className="w-8 h-8 rounded-xl bg-surface border border-border items-center justify-center">
                    <FileText color={colors.text} size={18} />
                  </View>
                  <Text className="text-text font-bold text-base tracking-tight">
                    {t('export_modal.markdown_title')}
                  </Text>
                </View>
                <View className="px-2 py-0.5 rounded-full bg-surface border border-border">
                  <Text className="text-text-muted font-mono font-bold text-xs uppercase">.md</Text>
                </View>
              </View>
              <Text className="text-text-secondary text-xs sm:text-sm mb-4 leading-relaxed">
                {t('export_modal.markdown_desc')}
              </Text>
              <TouchableOpacity 
                onPress={() => handleAction('markdown', onExportMarkdown)}
                disabled={activeAction !== null}
                className="bg-surface border border-border py-3 px-4 rounded-xl items-center flex-row justify-center gap-2 active:bg-surface-elevated"
                accessibilityRole="button"
                accessibilityLabel={t('export_modal.markdown_btn')}
              >
                {activeAction === 'markdown' ? (
                  <ActivityIndicator size="small" color={colors.text} />
                ) : (
                  <Download color={colors.text} size={16} />
                )}
                <Text className="text-text font-bold text-sm">
                  {t('export_modal.markdown_btn')}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* GitHub Pages Card */}
          <View className="border border-border rounded-2xl p-5 bg-surface-elevated shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-2.5">
                <View className="w-8 h-8 rounded-xl bg-surface border border-border items-center justify-center">
                  <Globe color={colors.text} size={18} />
                </View>
                <Text className="text-text font-bold text-base tracking-tight">
                  {t('export_modal.github_title')}
                </Text>
              </View>
              <View className="px-2 py-0.5 rounded-full bg-surface border border-border">
                <Text className="text-text-muted font-mono font-bold text-xs uppercase">Pages</Text>
              </View>
            </View>
            <Text className="text-text-secondary text-xs sm:text-sm mb-4 leading-relaxed">
              {t('export_modal.github_desc')}
            </Text>
            <TouchableOpacity 
              onPress={() => handleAction('github', onExportGitHubPages)}
              disabled={activeAction !== null}
              className="bg-surface border border-border py-3 px-4 rounded-xl items-center flex-row justify-center gap-2 active:bg-surface-elevated"
              accessibilityRole="button"
              accessibilityLabel={t('export_modal.github_btn')}
            >
              {activeAction === 'github' ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <Globe color={colors.text} size={16} />
              )}
              <Text className="text-text font-bold text-sm">
                {t('export_modal.github_btn')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Session JSON Backup Card */}
          <View className="border border-border rounded-2xl p-5 bg-surface-elevated shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-2.5">
                <View className="w-8 h-8 rounded-xl bg-surface border border-border items-center justify-center">
                  <FileJson color={colors.text} size={18} />
                </View>
                <Text className="text-text font-bold text-base tracking-tight">
                  {t('export_modal.json_title')}
                </Text>
              </View>
              <View className="px-2 py-0.5 rounded-full bg-surface border border-border">
                <Text className="text-text-muted font-mono font-bold text-xs uppercase">.json</Text>
              </View>
            </View>
            <Text className="text-text-secondary text-xs sm:text-sm mb-4 leading-relaxed">
              {t('export_modal.json_desc')}
            </Text>
            <TouchableOpacity 
              onPress={() => handleAction('json', onExportJson)}
              disabled={activeAction !== null}
              className="bg-surface border border-border py-3 px-4 rounded-xl items-center flex-row justify-center gap-2 active:bg-surface-elevated"
              accessibilityRole="button"
              accessibilityLabel={t('export_modal.json_btn')}
            >
              {activeAction === 'json' ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <Download color={colors.text} size={16} />
              )}
              <Text className="text-text font-bold text-sm">
                {t('export_modal.json_btn')}
              </Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* Auto-save Assurance Footer Note */}
        <View className="mt-6 pt-4 border-t border-border flex-row items-center gap-2">
          <CheckCircle2 size={14} color={colors.primary} />
          <Text className="text-text-muted text-xs leading-relaxed flex-1">
            {t('export_modal.auto_saved_note')}
          </Text>
        </View>
      </ScrollView>
    </Modal>
  );
}
