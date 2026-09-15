import React, { memo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useThemeColors } from '@/theme/ThemeContext';
import { Sparkles, Eye } from 'lucide-react-native';

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

const PRESET_IDS = [
  'minimal',
  'dark',
  'clean-light',
  'amoled',
  'cosmic-glow',
  'soft-purple-glow',
  'neon-orbit',
  'lava',
  'grid-stars',
] as const;

const ACCENT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#FFFFFF', '#000000'];

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <TouchableOpacity 
      className="flex-row items-center justify-between py-3 border-b border-border"
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityLabel={label}
    >
      <Text className="text-text font-bold">{label}</Text>
      <View className={`w-10 h-6 rounded-full p-1 justify-center ${value ? 'bg-primary' : 'bg-surface-elevated border border-border'}`}>
        <View className={`w-4 h-4 rounded-full ${value ? 'bg-primary-foreground ml-auto' : 'bg-text-secondary'} shadow-sm`} />
      </View>
    </TouchableOpacity>
  );
}

/**
 * Lightweight, memoized live theme preview.
 * Structurally isolated to prevent layout thrashing on frequent preset/accent changes.
 */
interface LivePreviewProps {
  preset: string;
  presetLabel: string;
  accent: string;
  glowsEnabled: boolean;
  glowIntensity: 'low' | 'medium' | 'high';
  starsEnabled: boolean;
  starsDensity: 'low' | 'medium' | 'high';
}

const LiveThemeMiniPreview = memo(function LiveThemeMiniPreview({
  preset,
  presetLabel,
  accent,
  glowsEnabled,
  glowIntensity,
  starsEnabled,
  starsDensity,
}: LivePreviewProps) {
  const { t } = useTranslation();

  const glowOpacity = glowIntensity === 'high' ? 0.35 : glowIntensity === 'medium' ? 0.22 : 0.12;
  const starsOpacity = starsDensity === 'high' ? 0.8 : starsDensity === 'medium' ? 0.5 : 0.25;

  return (
    <View className="mb-6 rounded-2xl border border-border bg-surface-elevated p-4 overflow-hidden relative shadow-sm">
      {/* Glow effect simulation */}
      {glowsEnabled && (
        <View 
          className="absolute -top-10 -right-10 w-28 h-28 rounded-full pointer-events-none"
          style={{
            backgroundColor: accent,
            opacity: glowOpacity,
            filter: 'blur(20px)',
          }}
        />
      )}

      {/* Micro stars indicator */}
      {starsEnabled && (
        <View 
          className="absolute top-2 right-3 flex-row items-center gap-1 pointer-events-none"
          style={{ opacity: starsOpacity }}
        >
          <Sparkles size={10} color={accent} />
          <Text className="text-text-muted font-mono text-xs">✨</Text>
        </View>
      )}

      {/* Mini preview header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <Eye size={13} color={accent} />
          <Text className="text-text-secondary font-mono text-xs font-semibold uppercase tracking-wider">
            {t('visual_theme.preview_title')}
          </Text>
        </View>
        <View className="px-2 py-0.5 rounded-full bg-surface border border-border">
          <Text className="text-text font-mono text-xs font-bold">{presetLabel}</Text>
        </View>
      </View>

      {/* Miniature mock portfolio card */}
      <View className="p-3.5 rounded-xl bg-surface border border-border flex-row items-center justify-between gap-3">
        <View className="flex-row items-center gap-3">
          <View 
            className="w-8 h-8 rounded-full items-center justify-center shadow-sm"
            style={{ backgroundColor: accent }}
          >
            <Text className="text-primary-foreground font-black text-xs">JD</Text>
          </View>
          <View>
            <Text className="text-text font-bold text-sm">Jane Developer</Text>
            <Text className="text-text-secondary text-xs">
              {t('visual_theme.preview_sample_role')}
            </Text>
          </View>
        </View>

        <View 
          className="px-3 py-1.5 rounded-lg shadow-sm"
          style={{ backgroundColor: accent }}
        >
          <Text className="text-primary-foreground font-bold text-xs">
            {t('visual_theme.preview_sample_cta')}
          </Text>
        </View>
      </View>
    </View>
  );
});

export function VisualThemeModal({ visible, onClose, config, onUpdate }: VisualThemeModalProps) {
  const { t } = useTranslation();
  const colors = useThemeColors();

  const getPresetLabel = (id: typeof PRESET_IDS[number]) => {
    switch (id) {
      case 'minimal': return t('visual_theme.presets.minimal');
      case 'dark': return t('visual_theme.presets.dark');
      case 'clean-light': return t('visual_theme.presets.clean_light');
      case 'amoled': return t('visual_theme.presets.amoled');
      case 'cosmic-glow': return t('visual_theme.presets.cosmic_glow');
      case 'soft-purple-glow': return t('visual_theme.presets.soft_purple');
      case 'neon-orbit': return t('visual_theme.presets.neon_orbit');
      case 'lava': return t('visual_theme.presets.lava');
      case 'grid-stars': return t('visual_theme.presets.grid_stars');
    }
  };

  const getIntensityLabel = (intensity: 'low' | 'medium' | 'high') => {
    switch (intensity) {
      case 'low': return t('visual_theme.intensity_low');
      case 'medium': return t('visual_theme.intensity_medium');
      case 'high': return t('visual_theme.intensity_high');
    }
  };

  const getDensityLabel = (density: 'low' | 'medium' | 'high') => {
    switch (density) {
      case 'low': return t('visual_theme.density_low');
      case 'medium': return t('visual_theme.density_medium');
      case 'high': return t('visual_theme.density_high');
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={t('visual_theme.modal_title')}
      size="md"
      footer={
        <Button variant="default" className="w-full" onPress={onClose}>
          <Text className="text-primary-foreground font-bold">{t('common.done')}</Text>
        </Button>
      }
    >
      <ScrollView className="py-2" showsVerticalScrollIndicator={false}>
        {/* Memoized Live Theme Mini-Preview */}
        <LiveThemeMiniPreview
          preset={config.preset}
          presetLabel={getPresetLabel(config.preset)}
          accent={config.accent}
          glowsEnabled={config.backgroundEffects.glows.enabled}
          glowIntensity={config.backgroundEffects.glows.intensity}
          starsEnabled={config.backgroundEffects.microStars.enabled}
          starsDensity={config.backgroundEffects.microStars.density}
        />

        <Text className="text-text font-bold text-sm mb-3">{t('visual_theme.preset_title')}</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {PRESET_IDS.map(id => (
            <TouchableOpacity
              key={id}
              onPress={() => onUpdate({ ...config, preset: id })}
              className={`px-3 py-2 rounded-full border ${config.preset === id ? 'border-primary bg-primary/20' : 'border-border bg-surface'}`}
              accessibilityRole="button"
              accessibilityLabel={getPresetLabel(id)}
            >
              <Text className={config.preset === id ? 'text-primary font-bold text-xs' : 'text-text text-xs'}>
                {getPresetLabel(id)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-text font-bold text-sm mb-3">{t('visual_theme.accent_color')}</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {ACCENT_COLORS.map(color => (
            <TouchableOpacity
              key={color}
              onPress={() => onUpdate({ ...config, accent: color })}
              className="w-10 h-10 rounded-full border-2 items-center justify-center active:scale-95"
              accessibilityRole="button"
              accessibilityLabel={`Accent color ${color}`}
              style={{ 
                backgroundColor: color, 
                borderColor: config.accent === color ? colors.text : 'transparent' 
              }}
            >
              {config.accent === color && <View className="w-3 h-3 rounded-full bg-background/60" />}
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-text font-bold text-sm mt-4 mb-2">{t('visual_theme.background_effects')}</Text>
        <View className="bg-surface rounded-xl border border-border overflow-hidden mb-6">
          <View className="px-4">
            <ToggleRow 
              label={t('visual_theme.glows_label')} 
              value={config.backgroundEffects.glows.enabled} 
              onChange={(v) => onUpdate({ ...config, backgroundEffects: { ...config.backgroundEffects, glows: { ...config.backgroundEffects.glows, enabled: v } } })} 
            />
          </View>
          {config.backgroundEffects.glows.enabled && (
            <View className="p-4 bg-surface-elevated border-b border-border">
              <Text className="text-text-secondary text-xs mb-2 uppercase tracking-wider font-bold">{t('visual_theme.glow_intensity')}</Text>
              <View className="flex-row gap-2 mb-4">
                {(['low', 'medium', 'high'] as const).map(intensity => (
                  <TouchableOpacity 
                    key={intensity}
                    onPress={() => onUpdate({ ...config, backgroundEffects: { ...config.backgroundEffects, glows: { ...config.backgroundEffects.glows, intensity } } })}
                    className={`flex-1 py-1.5 rounded items-center border ${config.backgroundEffects.glows.intensity === intensity ? 'border-primary bg-primary/20' : 'border-border bg-surface'}`}
                    accessibilityRole="button"
                  >
                    <Text className={config.backgroundEffects.glows.intensity === intensity ? 'text-primary font-bold text-xs' : 'text-text text-xs'}>
                      {getIntensityLabel(intensity)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View className="px-4">
            <ToggleRow 
              label={t('visual_theme.stars_label')} 
              value={config.backgroundEffects.microStars.enabled} 
              onChange={(v) => onUpdate({ ...config, backgroundEffects: { ...config.backgroundEffects, microStars: { ...config.backgroundEffects.microStars, enabled: v } } })} 
            />
          </View>
          {config.backgroundEffects.microStars.enabled && (
            <View className="p-4 bg-surface-elevated">
              <Text className="text-text-secondary text-xs mb-2 uppercase tracking-wider font-bold">{t('visual_theme.stars_density')}</Text>
              <View className="flex-row gap-2">
                {(['low', 'medium', 'high'] as const).map(density => (
                  <TouchableOpacity 
                    key={density}
                    onPress={() => onUpdate({ ...config, backgroundEffects: { ...config.backgroundEffects, microStars: { ...config.backgroundEffects.microStars, density } } })}
                    className={`flex-1 py-1.5 rounded items-center border ${config.backgroundEffects.microStars.density === density ? 'border-primary bg-primary/20' : 'border-border bg-surface'}`}
                    accessibilityRole="button"
                  >
                    <Text className={config.backgroundEffects.microStars.density === density ? 'text-primary font-bold text-xs' : 'text-text text-xs'}>
                      {getDensityLabel(density)}
                    </Text>
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
