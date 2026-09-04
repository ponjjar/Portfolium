import React from 'react';
import { useTranslation } from 'react-i18next';

import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

interface ProjectLayoutConfig {
  columns: number;
  cardStyle: 'banner-card' | 'logo-side-card' | 'text-card';
  carousel: {
    enabled: boolean;
    autoplay: boolean;
    intervalMs: number;
    paginationDots?: boolean;
  };
}

interface ProjectLayoutModalProps {
  visible: boolean;
  onClose: () => void;
  config: ProjectLayoutConfig;
  onUpdate: (config: ProjectLayoutConfig) => void;
}

export function ProjectLayoutModal({ visible, onClose, config, onUpdate }: ProjectLayoutModalProps) {
  const { t } = useTranslation();
  return (
    <Modal variant="popover"
      visible={visible}
      onClose={onClose}
      title={t("project_layout.modal_title")}
      size="md"
      footer={
        <Button variant="default" className="w-full" onPress={onClose}>
          <Text className="text-primary-foreground font-bold">{t("common.done")}</Text>
        </Button>
      }
    >
      <ScrollView className="py-2">
        
        {/* DISPLAY STYLE */}
        <Text className="text-text font-bold text-sm mb-3">{t("project_layout.display_style")}</Text>
        <View className="gap-3 mb-6">
          <TouchableOpacity 
            onPress={() => onUpdate({ ...config, cardStyle: 'banner-card' })}
            className={`border rounded-xl p-3 flex-row items-center ${config.cardStyle === 'banner-card' ? 'border-primary bg-primary/10' : 'border-border bg-surface'}`}
          >
            <View className="w-12 h-12 bg-input-background border border-border rounded flex-col overflow-hidden mr-3">
              <View className="w-full h-1/2 bg-border" />
              <View className="p-1">
                <View className="w-full h-1 bg-border rounded mb-0.5" />
                <View className="w-3/4 h-1 bg-border rounded" />
              </View>
            </View>
            <View>
              <Text className={`font-bold ${config.cardStyle === 'banner-card' ? 'text-primary' : 'text-text'}`}>{t("project_layout.style_banner")}</Text>
              <Text className="text-text-secondary text-xs">{t("project_layout.style_banner_desc")}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => onUpdate({ ...config, cardStyle: 'logo-side-card' })}
            className={`border rounded-xl p-3 flex-row items-center ${config.cardStyle === 'logo-side-card' ? 'border-primary bg-primary/10' : 'border-border bg-surface'}`}
          >
            <View className="w-12 h-12 bg-input-background border border-border rounded flex-row overflow-hidden mr-3">
              <View className="w-1/3 h-full bg-border" />
              <View className="p-1 flex-1 justify-center">
                <View className="w-full h-1 bg-border rounded mb-0.5" />
                <View className="w-3/4 h-1 bg-border rounded" />
              </View>
            </View>
            <View>
              <Text className={`font-bold ${config.cardStyle === 'logo-side-card' ? 'text-primary' : 'text-text'}`}>{t("project_layout.style_logo")}</Text>
              <Text className="text-text-secondary text-xs">{t("project_layout.style_logo_desc")}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => onUpdate({ ...config, cardStyle: 'text-card' })}
            className={`border rounded-xl p-3 flex-row items-center ${config.cardStyle === 'text-card' ? 'border-primary bg-primary/10' : 'border-border bg-surface'}`}
          >
            <View className="w-12 h-12 bg-input-background border border-border rounded flex-col justify-center p-2 mr-3">
              <View className="w-full h-1 bg-border rounded mb-1" />
              <View className="w-3/4 h-1 bg-border rounded mb-1" />
              <View className="w-1/2 h-1 bg-border rounded" />
            </View>
            <View>
              <Text className={`font-bold ${config.cardStyle === 'text-card' ? 'text-primary' : 'text-text'}`}>{t("project_layout.style_text")}</Text>
              <Text className="text-text-secondary text-xs">{t("project_layout.style_text_desc")}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* STRUCTURE */}
        <Text className="text-text font-bold text-sm mb-3">{t("project_layout.structure")}</Text>
        <View className="flex-row gap-2 mb-4">
          <TouchableOpacity 
            onPress={() => onUpdate({ ...config, carousel: { ...config.carousel, enabled: false } })}
            className={`flex-1 py-3 rounded items-center border ${!config.carousel.enabled ? 'border-primary bg-primary/20' : 'border-border bg-input-background'}`}
          >
            <Text className={!config.carousel.enabled ? 'text-primary font-bold' : 'text-text'}>{t("project_layout.grid")}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => onUpdate({ ...config, carousel: { ...config.carousel, enabled: true } })}
            className={`flex-1 py-3 rounded items-center border ${config.carousel.enabled ? 'border-primary bg-primary/20' : 'border-border bg-input-background'}`}
          >
            <Text className={config.carousel.enabled ? 'text-primary font-bold' : 'text-text'}>{t("project_layout.carousel")}</Text>
          </TouchableOpacity>
        </View>

        {/* Conditional Structure Options */}
        <View className="p-4 bg-surface rounded-xl border border-border">
          {!config.carousel.enabled ? (
            <>
              <Text className="text-text-secondary text-xs mb-2">{t("project_layout.columns")}</Text>
              <View className="flex-row gap-2">
                {[1, 2, 3].map(cols => (
                  <TouchableOpacity
                    key={cols}
                    onPress={() => onUpdate({ ...config, columns: cols })}
                    className={`flex-1 py-2 rounded items-center border ${config.columns === cols ? 'border-primary bg-primary/20' : 'border-border bg-input-background'}`}
                  >
                    <Text className={config.columns === cols ? 'text-primary font-bold' : 'text-text'}>{cols}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            <>
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-text font-bold">{t("project_layout.autoplay")}</Text>
                  <Text className="text-text-secondary text-xs">{t("project_layout.autoplay_desc")}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => onUpdate({ 
                    ...config, 
                    carousel: { ...config.carousel, autoplay: !config.carousel.autoplay } 
                  })}
                  className={`w-10 h-6 rounded-full p-1 justify-center ${config.carousel.autoplay ? 'bg-primary' : 'bg-input-background border border-border'}`}
                >
                  <View className={`w-4 h-4 rounded-full bg-white shadow-sm ${config.carousel.autoplay ? 'ml-auto' : ''}`} />
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-text font-bold">{t("project_layout.pagination")}</Text>
                  <Text className="text-text-secondary text-xs">{t("project_layout.pagination_desc")}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => onUpdate({ 
                    ...config, 
                    carousel: { ...config.carousel, paginationDots: !config.carousel.paginationDots } 
                  })}
                  className={`w-10 h-6 rounded-full p-1 justify-center ${config.carousel.paginationDots ? 'bg-primary' : 'bg-input-background border border-border'}`}
                >
                  <View className={`w-4 h-4 rounded-full bg-white shadow-sm ${config.carousel.paginationDots ? 'ml-auto' : ''}`} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

      </ScrollView>
    </Modal>
  );
}
