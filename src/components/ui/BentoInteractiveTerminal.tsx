import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { FileCode, Terminal, CheckCircle2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/theme/ThemeContext';

const MANIFESTS = [
  {
    name: 'package.json',
    lang: 'Node / React',
    lines: [
      '{',
      '  "name": "portfolio-builder",',
      '  "dependencies": {',
      '    "expo": "~57.0.17",',
      '    "react": "19.2.3",',
      '    "nativewind": "^4.2.6",',
      '    "zustand": "^5.0.15"',
      '  }',
      '}',
    ],
    detected: ['React 19', 'Expo SDK 57', 'NativeWind', 'Zustand'],
  },
  {
    name: 'Cargo.toml',
    lang: 'Rust',
    lines: [
      '[package]',
      'name = "high-speed-api"',
      'version = "0.2.0"',
      '',
      '[dependencies]',
      'tokio = { version = "1.0", features = ["full"] }',
      'axum = "0.7"',
      'serde_json = "1.0"',
    ],
    detected: ['Rust 1.82', 'Tokio', 'Axum', 'Serde'],
  },
  {
    name: 'go.mod',
    lang: 'Go',
    lines: [
      'module github.com/developer/core',
      '',
      'go 1.24',
      '',
      'require (',
      '    github.com/gin-gonic/gin v1.10.0',
      '    go.uber.org/zap v1.27.0',
      ')',
    ],
    detected: ['Go 1.24', 'Gin Gonic', 'Uber Zap'],
  },
];

export function BentoInteractiveTerminal() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeManifest = MANIFESTS[selectedIdx];

  return (
    <View className="w-full h-full bg-surface-elevated/90 border border-border rounded-2xl flex-col overflow-hidden shadow-lg">
      {/* Terminal Titlebar */}
      <View className="px-4 py-3 bg-surface border-b border-border flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-full bg-primary/20 border border-border" />
          <View className="w-3 h-3 rounded-full bg-primary/20 border border-border" />
          <View className="w-3 h-3 rounded-full bg-primary/20 border border-border" />
        </View>

        {/* Tab switcher */}
        <View className="flex-row items-center gap-1 bg-surface-elevated p-1 rounded-xl border border-border">
          {MANIFESTS.map((m, idx) => (
            <Pressable
              key={m.name}
              onPress={() => setSelectedIdx(idx)}
              className={`px-2.5 py-1 rounded-lg flex-row items-center gap-1.5 transition-colors ${
                selectedIdx === idx ? 'bg-primary' : 'bg-transparent hover:bg-surface'
              }`}
            >
              <FileCode
                size={12}
                color={selectedIdx === idx ? colors.primaryForeground : colors.textMuted}
              />
              <Text
                className={`text-xs font-mono font-bold ${
                  selectedIdx === idx ? 'text-primary-foreground' : 'text-text-muted'
                }`}
              >
                {m.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="hidden sm:flex flex-row items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface border border-border">
          <Terminal size={11} color={colors.primary} />
          <Text className="text-text-muted text-xs font-mono">AST v2</Text>
        </View>
      </View>

      {/* Code Editor Body */}
      <View className="flex-1 p-4 sm:p-5 font-mono justify-between flex-col">
        <View className="flex-col gap-1">
          {activeManifest.lines.map((line, i) => (
            <View key={i} className="flex-row items-center gap-3">
              <Text className="text-text-muted/60 text-xs font-mono select-none w-4 text-right">
                {i + 1}
              </Text>
              <Text
                className={`text-xs font-mono ${
                  line.startsWith('  "') || line.startsWith('name =') || line.startsWith('require')
                    ? 'text-primary font-semibold'
                    : 'text-text-secondary'
                }`}
              >
                {line}
              </Text>
            </View>
          ))}
        </View>

        {/* Live Detected Tags footer */}
        <View className="pt-4 mt-4 border-t border-border flex-col gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-text-muted text-xs font-mono uppercase tracking-wider">
              {t('landing.stage_terminal_analyzing')}
            </Text>
            <View className="flex-row items-center gap-1.5">
              <CheckCircle2 size={13} color={colors.primary} />
              <Text className="text-primary text-xs font-mono font-bold">
                {t('landing.stage_terminal_detected')}
              </Text>
            </View>
          </View>
          <View className="flex-row flex-wrap gap-1.5">
            {activeManifest.detected.map((tag) => (
              <View
                key={tag}
                className="px-2.5 py-1 rounded-md bg-surface border border-border"
              >
                <Text className="text-text text-xs font-mono font-medium">{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
