import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Palette, Sparkles, ExternalLink, Code } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/theme/ThemeContext';

interface ThemePreset {
  id: string;
  name: string;
  bg: string;
  surface: string;
  text: string;
  primary: string;
  border: string;
  dotColor: string;
}

const PRESETS: ThemePreset[] = [
  {
    id: 'dark',
    name: 'Dark Studio',
    bg: '#202124',
    surface: '#292A2D',
    text: '#F1F3F4',
    primary: '#F1F3F4',
    border: '#3C4043',
    dotColor: '#F1F3F4',
  },
  {
    id: 'amoled',
    name: 'Pure AMOLED',
    bg: '#000000',
    surface: '#0A0A0A',
    text: '#F5F5F5',
    primary: '#FFFFFF',
    border: '#242424',
    dotColor: '#FFFFFF',
  },
  {
    id: 'lava',
    name: 'Lava Ember',
    bg: '#160D05',
    surface: '#211308',
    text: '#FFF7E8',
    primary: '#FFB020',
    border: '#4A2D12',
    dotColor: '#FFB020',
  },
  {
    id: 'terminal',
    name: 'Matrix Hacker',
    bg: '#071009',
    surface: '#0A170D',
    text: '#9CFF9C',
    primary: '#6CFF75',
    border: '#285D31',
    dotColor: '#6CFF75',
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    bg: '#111315',
    surface: '#181A1D',
    text: '#F1F3F5',
    primary: '#3478D4',
    border: '#2A2E34',
    dotColor: '#3478D4',
  },
  {
    id: 'light',
    name: 'Paper Clean',
    bg: '#F7F7F5',
    surface: '#FFFFFF',
    text: '#111111',
    primary: '#111111',
    border: '#E2E2DF',
    dotColor: '#686868',
  },
];

export function BentoLiveThemePreview() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [activeTheme, setActiveTheme] = useState<ThemePreset>(PRESETS[0]);

  return (
    <View className="w-full flex-col gap-4">
      {/* Interactive Theme Picker Chips */}
      <View className="flex-col gap-2">
        <View className="flex-row items-center justify-between px-1">
          <Text className="text-text-muted text-xs font-mono uppercase tracking-wider">
            {t('landing.stage_themes_interactive_hint')}
          </Text>
          <View className="flex-row items-center gap-1.5">
            <Palette size={13} color={colors.primary} />
            <Text className="text-primary text-xs font-mono font-bold">
              {activeTheme.name}
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {PRESETS.map((preset) => {
            const isSelected = activeTheme.id === preset.id;
            return (
              <Pressable
                key={preset.id}
                onPress={() => setActiveTheme(preset)}
                className={`flex-row items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                  isSelected
                    ? 'bg-primary border-primary shadow-sm'
                    : 'bg-surface border-border hover:bg-surface-elevated'
                }`}
              >
                <View
                  style={{ backgroundColor: preset.dotColor }}
                  className="w-2.5 h-2.5 rounded-full border border-border"
                />
                <Text
                  className={`text-xs font-semibold ${
                    isSelected ? 'text-primary-foreground font-bold' : 'text-text-secondary'
                  }`}
                >
                  {preset.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Live Rendered Card Mockup */}
      <View
        style={{
          backgroundColor: activeTheme.bg,
          borderColor: activeTheme.border,
        }}
        className="w-full rounded-2xl border p-5 transition-colors shadow-xl"
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <View
              style={{
                backgroundColor: activeTheme.primary,
              }}
              className="w-10 h-10 rounded-xl items-center justify-center shadow-sm"
            >
              <Sparkles size={18} color={activeTheme.bg} />
            </View>
            <View>
              <Text
                style={{ color: activeTheme.text }}
                className="font-black text-sm uppercase tracking-tight"
              >
                Alex Silva
              </Text>
              <Text
                style={{ color: activeTheme.text, opacity: 0.7 }}
                className="text-xs font-mono"
              >
                Senior Systems Architect
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: activeTheme.surface,
              borderColor: activeTheme.border,
            }}
            className="px-2.5 py-1 rounded-full border flex-row items-center gap-1.5"
          >
            <Code size={12} color={activeTheme.primary} />
            <Text
              style={{ color: activeTheme.text }}
              className="text-xs font-mono font-semibold"
            >
              TypeScript
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: activeTheme.surface,
            borderColor: activeTheme.border,
          }}
          className="p-3.5 rounded-xl border mb-3.5"
        >
          <Text
            style={{ color: activeTheme.text }}
            className="font-bold text-xs mb-1"
          >
            Distributed Task Runner
          </Text>
          <Text
            style={{ color: activeTheme.text, opacity: 0.75 }}
            className="text-xs leading-relaxed"
          >
            A high-throughput worker pool running on isolated worker threads.
          </Text>
        </View>

        <View className="flex-row items-center justify-between pt-2 border-t border-border/40">
          <Text
            style={{ color: activeTheme.text, opacity: 0.6 }}
            className="text-xs font-mono"
          >
            100% Responsive HTML5
          </Text>
          <View className="flex-row items-center gap-1">
            <Text
              style={{ color: activeTheme.primary }}
              className="text-xs font-mono font-bold"
            >
              Preview Live
            </Text>
            <ExternalLink size={12} color={activeTheme.primary} />
          </View>
        </View>
      </View>
    </View>
  );
}
