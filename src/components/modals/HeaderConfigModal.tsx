import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
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

export function HeaderConfigModal({ visible, onClose, config, onUpdate }: HeaderConfigModalProps) {
  const ToggleRow = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
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

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Configuração do Cabeçalho"
      size="sm"
      footer={
        <Button variant="default" className="w-full" onPress={onClose}>
          <Text className="text-primary-foreground font-bold">Concluir</Text>
        </Button>
      }
    >
      <ScrollView className="py-2">
        <ToggleRow 
          label="Habilitar Cabeçalho" 
          value={config.enabled} 
          onChange={(v) => onUpdate({ ...config, enabled: v })} 
        />
        
        {config.enabled && (
          <View className="pl-4 mt-2 mb-4 border-l-2 border-border">
            <ToggleRow 
              label="Menu de Navegação (Seções)" 
              value={config.showNavigation} 
              onChange={(v) => onUpdate({ ...config, showNavigation: v })} 
            />
            <ToggleRow 
              label="Exibir Seu Nome" 
              value={config.showName} 
              onChange={(v) => onUpdate({ ...config, showName: v })} 
            />
            <ToggleRow 
              label="Exibir Seu Avatar" 
              value={config.showAvatar} 
              onChange={(v) => onUpdate({ ...config, showAvatar: v })} 
            />

            {(config.showName || config.showAvatar) && (
              <View className="mt-4">
                <Text className="text-text-secondary text-xs mb-2 uppercase tracking-wider font-bold">Posição da Identificação</Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity 
                    onPress={() => onUpdate({ ...config, namePosition: 'left' })}
                    className={`flex-1 py-2 rounded items-center border ${config.namePosition === 'left' ? 'border-primary bg-primary/20' : 'border-border bg-input-background'}`}
                  >
                    <Text className={config.namePosition === 'left' ? 'text-primary font-bold' : 'text-text'}>Esquerda</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => onUpdate({ ...config, namePosition: 'right' })}
                    className={`flex-1 py-2 rounded items-center border ${config.namePosition === 'right' ? 'border-primary bg-primary/20' : 'border-border bg-input-background'}`}
                  >
                    <Text className={config.namePosition === 'right' ? 'text-primary font-bold' : 'text-text'}>Direita</Text>
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
