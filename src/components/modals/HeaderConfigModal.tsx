import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

interface HeaderConfig {
  enabled: boolean;
  showNavigation: boolean;
  showName: boolean;
  showAvatar: boolean;
  namePosition: 'left' | 'right';
}

interface HeaderConfigModalProps {
  visible: boolean;
  onClose: () => void;
  config: HeaderConfig;
  onUpdate: (config: HeaderConfig) => void;
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <TouchableOpacity 
      className="flex-row items-center justify-between py-3 border-b border-border"
      onPress={() => onChange(!value)}
    >
      <Text className="text-text">{label}</Text>
      <View className={`w-10 h-6 rounded-full p-1 justify-center ${value ? 'bg-primary' : 'bg-input-background border border-border'}`}>
        <View className={`w-4 h-4 rounded-full bg-white shadow-sm ${value ? 'ml-auto' : ''}`} />
      </View>
    </TouchableOpacity>
  );
}

export function HeaderConfigModal({ visible, onClose, config, onUpdate }: HeaderConfigModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={t('header_config.modal_title')}
      size="sm"
      footer={
        <Button variant="default" className="w-full" onPress={onClose}>
          <Text className="text-primary-foreground font-bold">{t('common.done')}</Text>
        </Button>
      }
    >
      <ScrollView className="py-2">
        <ToggleRow 
          label={t('header_config.enable_header')} 
          value={config.enabled} 
          onChange={(v) => onUpdate({ ...config, enabled: v })} 
        />
        
        {config.enabled && (
          <View className="pl-4 mt-2 mb-4 border-l-2 border-border">
            <ToggleRow 
              label={t('header_config.show_navigation')} 
              value={config.showNavigation} 
              onChange={(v) => onUpdate({ ...config, showNavigation: v })} 
            />
            <ToggleRow 
              label={t('header_config.show_name')} 
              value={config.showName} 
              onChange={(v) => onUpdate({ ...config, showName: v })} 
            />
            <ToggleRow 
              label={t('header_config.show_avatar')} 
              value={config.showAvatar} 
              onChange={(v) => onUpdate({ ...config, showAvatar: v })} 
            />

            {(config.showName || config.showAvatar) && (
              <View className="mt-4">
                <Text className="text-text-secondary text-xs mb-2 uppercase tracking-wider font-bold">{t('header_config.name_position')}</Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity 
                    onPress={() => onUpdate({ ...config, namePosition: 'left' })}
                    className={`flex-1 py-2 rounded items-center border ${config.namePosition === 'left' ? 'border-primary bg-primary/20' : 'border-border bg-input-background'}`}
                  >
                    <Text className={config.namePosition === 'left' ? 'text-primary font-bold' : 'text-text'}>{t('header_config.position_left')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => onUpdate({ ...config, namePosition: 'right' })}
                    className={`flex-1 py-2 rounded items-center border ${config.namePosition === 'right' ? 'border-primary bg-primary/20' : 'border-border bg-input-background'}`}
                  >
                    <Text className={config.namePosition === 'right' ? 'text-primary font-bold' : 'text-text'}>{t('header_config.position_right')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </Modal>
  );
}
