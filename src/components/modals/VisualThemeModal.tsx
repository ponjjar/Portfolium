import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

export interface VisualThemeConfig {
  preset: 'minimal' | 'dark' | 'amoled' | 'lava' | 'cosmic-glow' | 'soft-purple-glow' | 'grid-stars' | 'clean-light' | 'neon-orbit';
  accent: string;
  backgroundEffects: {
    glows: {
      enabled: boolean;
      intensity: 'low' | 'medium' | 'high';
      color: string;
      count: number;
    };
    microStars: {
      enabled: boolean;
      density: 'low' | 'medium' | 'high';
      opacity: number;
    };
  };
}

interface VisualThemeModalProps {
  visible: boolean;
  onClose: () => void;
  config: VisualThemeConfig;
  onUpdate: (config: VisualThemeConfig) => void;
}

const PRESETS = [
  { id: 'minimal', label: 'Minimal (Auto)' },
  { id: 'dark', label: 'Dark' },
  { id: 'clean-light', label: 'Clean Light' },
  { id: 'amoled', label: 'AMOLED Black' },
  { id: 'cosmic-glow', label: 'Cosmic Glow' },
  { id: 'soft-purple-glow', label: 'Soft Purple' },
  { id: 'neon-orbit', label: 'Neon Orbit' },
  { id: 'lava', label: 'Lava' },
  { id: 'grid-stars', label: 'Grid + Stars' },
] as const;

const ACCENT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#FFFFFF', '#000000'];

export function VisualThemeModal({ visible, onClose, config, onUpdate }: VisualThemeModalProps) {
  const ToggleRow = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
    <TouchableOpacity 
      className="flex-row items-center justify-between py-3 border-b border-border"
      onPress={() => onChange(!value)}
    >
      <Text className="text-text font-bold">{label}</Text>
      <View className={`w-10 h-6 rounded-full p-1 justify-center ${value ? 'bg-primary' : 'bg-input-background border border-border'}`}>
        <View className={`w-4 h-4 rounded-full bg-white shadow-sm ${value ? 'ml-auto' : ''}`} />
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Tema e Efeitos Visuais"
      size="md"
      footer={
        <Button variant="default" className="w-full" onPress={onClose}>
          <Text className="text-primary-foreground font-bold">Concluir</Text>
        </Button>
      }
    >
      <ScrollView className="py-2">
        <Text className="text-text font-bold text-sm mb-3">Predefinição de Tema</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {PRESETS.map(preset => (
            <TouchableOpacity
              key={preset.id}
              onPress={() => onUpdate({ ...config, preset: preset.id })}
              className={`px-3 py-2 rounded-full border ${config.preset === preset.id ? 'border-primary bg-primary/20' : 'border-border bg-surface'}`}
            >
              <Text className={config.preset === preset.id ? 'text-primary font-bold text-xs' : 'text-text text-xs'}>{preset.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-text font-bold text-sm mb-3">Cor de Destaque</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {ACCENT_COLORS.map(color => (
            <TouchableOpacity
              key={color}
              onPress={() => onUpdate({ ...config, accent: color })}
              className="w-10 h-10 rounded-full border-2 items-center justify-center"
              style={{ 
                backgroundColor: color, 
                borderColor: config.accent === color ? 'var(--text)' : 'transparent' 
              }}
            >
              {config.accent === color && <View className="w-3 h-3 rounded-full bg-background/50" />}
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-text font-bold text-sm mt-4 mb-2">Efeitos de Fundo (Background)</Text>
        <View className="bg-surface rounded-xl border border-border overflow-hidden mb-6">
          <View className="px-4">
            <ToggleRow 
              label="Bolas de Brilho (Glows)" 
              value={config.backgroundEffects.glows.enabled} 
              onChange={(v) => onUpdate({ ...config, backgroundEffects: { ...config.backgroundEffects, glows: { ...config.backgroundEffects.glows, enabled: v } } })} 
            />
          </View>
          {config.backgroundEffects.glows.enabled && (
            <View className="p-4 bg-input-background border-b border-border">
              <Text className="text-text-secondary text-xs mb-2 uppercase tracking-wider font-bold">Intensidade do Brilho</Text>
              <View className="flex-row gap-2 mb-4">
                {(['low', 'medium', 'high'] as const).map(intensity => (
                  <TouchableOpacity 
                    key={intensity}
                    onPress={() => onUpdate({ ...config, backgroundEffects: { ...config.backgroundEffects, glows: { ...config.backgroundEffects.glows, intensity } } })}
                    className={`flex-1 py-1.5 rounded items-center border ${config.backgroundEffects.glows.intensity === intensity ? 'border-primary bg-primary/20' : 'border-border bg-surface'}`}
                  >
                    <Text className={config.backgroundEffects.glows.intensity === intensity ? 'text-primary font-bold text-xs' : 'text-text text-xs'}>{intensity === 'low' ? 'Suave' : intensity === 'medium' ? 'Médio' : 'Forte'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View className="px-4">
            <ToggleRow 
              label="Micro Estrelas (Pontilhado)" 
              value={config.backgroundEffects.microStars.enabled} 
              onChange={(v) => onUpdate({ ...config, backgroundEffects: { ...config.backgroundEffects, microStars: { ...config.backgroundEffects.microStars, enabled: v } } })} 
            />
          </View>
          {config.backgroundEffects.microStars.enabled && (
            <View className="p-4 bg-input-background">
              <Text className="text-text-secondary text-xs mb-2 uppercase tracking-wider font-bold">Densidade</Text>
              <View className="flex-row gap-2">
                {(['low', 'medium', 'high'] as const).map(density => (
                  <TouchableOpacity 
                    key={density}
                    onPress={() => onUpdate({ ...config, backgroundEffects: { ...config.backgroundEffects, microStars: { ...config.backgroundEffects.microStars, density } } })}
                    className={`flex-1 py-1.5 rounded items-center border ${config.backgroundEffects.microStars.density === density ? 'border-primary bg-primary/20' : 'border-border bg-surface'}`}
                  >
                    <Text className={config.backgroundEffects.microStars.density === density ? 'text-primary font-bold text-xs' : 'text-text text-xs'}>{density === 'low' ? 'Raro' : density === 'medium' ? 'Normal' : 'Denso'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

      </ScrollView>
    </Modal>
  );
}
