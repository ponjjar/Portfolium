import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import {
  Globe,
  Terminal,
  FileCheck2,
  Lock,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react-native';

const HERO_SHOWCASE_IMG = require('@/../assets/images/hero-showcase.jpg');

export function InteractiveHeroShowcase() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'preview' | 'terminal' | 'metrics'>('preview');

  return (
    <View className="gsap-hero-showcase w-full rounded-3xl p-1 bg-gradient-to-b from-primary/40 via-border to-border/30 shadow-2xl shadow-primary/20">
      <View className="w-full rounded-[22px] overflow-hidden bg-surface border border-border">
        {/* Interactive Studio Navigation Header */}
        <View className="w-full flex-col sm:flex-row items-center justify-between px-4 py-3 border-b border-border bg-surface-elevated gap-3">
          {/* Mac OS Window Controls */}
          <View className="hidden sm:flex flex-row items-center gap-2">
            <View className="w-3 h-3 rounded-full bg-red-500/80" />
            <View className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <View className="w-3 h-3 rounded-full bg-green-500/80" />
          </View>

          {/* Tab Switcher */}
          <View className="flex-row items-center gap-1.5 p-1 rounded-full bg-background border border-border">
            <Pressable
              onPress={() => setActiveTab('preview')}
              className={`flex-row items-center gap-2 px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'preview' ? 'bg-primary shadow-sm' : 'hover:bg-surface'
              }`}
            >
              <Globe
                size={13}
                color={activeTab === 'preview' ? 'var(--primary-foreground)' : 'var(--text-muted)'}
              />
              <Text
                className={`text-xs font-bold ${
                  activeTab === 'preview' ? 'text-primary-foreground' : 'text-text-muted'
                }`}
              >
                {t('landing.tab_preview')}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('terminal')}
              className={`flex-row items-center gap-2 px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'terminal' ? 'bg-primary shadow-sm' : 'hover:bg-surface'
              }`}
            >
              <Terminal
                size={13}
                color={activeTab === 'terminal' ? 'var(--primary-foreground)' : 'var(--text-muted)'}
              />
              <Text
                className={`text-xs font-bold ${
                  activeTab === 'terminal' ? 'text-primary-foreground' : 'text-text-muted'
                }`}
              >
                {t('landing.tab_terminal')}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('metrics')}
              className={`flex-row items-center gap-2 px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'metrics' ? 'bg-primary shadow-sm' : 'hover:bg-surface'
              }`}
            >
              <FileCheck2
                size={13}
                color={activeTab === 'metrics' ? 'var(--primary-foreground)' : 'var(--text-muted)'}
              />
              <Text
                className={`text-xs font-bold ${
                  activeTab === 'metrics' ? 'text-primary-foreground' : 'text-text-muted'
                }`}
              >
                {t('landing.tab_metrics')}
              </Text>
            </Pressable>
          </View>

          {/* Secure URL Indicator */}
          <View className="hidden md:flex flex-row items-center gap-2 px-3 py-1 rounded-full bg-background border border-border">
            <Lock size={12} color="var(--primary)" />
            <Text className="text-text-muted text-xs font-mono">https://portfolium.dev/showcase</Text>
            <Share2 size={12} color="var(--text-muted)" className="ml-1" />
          </View>
        </View>

        {/* Tab 1: Web 3D Showcase */}
        {activeTab === 'preview' && (
          <View className="relative w-full h-72 sm:h-96 md:h-[520px] overflow-hidden bg-background items-center justify-center">
            <Image
              source={HERO_SHOWCASE_IMG}
              contentFit="cover"
              transition={300}
              style={{ width: '100%', height: '100%' }}
            />
            {/* Live Floating Badge Overlay */}
            <View className="absolute bottom-6 left-6 hidden sm:flex flex-row items-center gap-3 px-4 py-2 rounded-2xl bg-surface/85 backdrop-blur-md border border-border shadow-lg">
              <View className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <Text className="text-text font-bold text-xs">
                Renderizado na GPU • 60 FPS
              </Text>
            </View>
          </View>
        )}

        {/* Tab 2: GitHub Live Terminal Simulator */}
        {activeTab === 'terminal' && (
          <View className="w-full h-72 sm:h-96 md:h-[520px] bg-[#0c1017] p-6 sm:p-8 font-mono justify-between overflow-hidden">
            <View className="flex-col gap-3">
              <View className="flex-row items-center gap-2 text-cyan-400">
                <Text className="text-emerald-400 font-bold">$</Text>
                <Text className="text-cyan-300 font-mono text-sm">
                  portfolium scan --user octocat --deep-manifests
                </Text>
              </View>

              <Text className="text-slate-400 text-xs font-mono">
                [info] Conectando com GitHub API v3... 200 OK (0ms auth)
              </Text>
              <Text className="text-slate-300 text-xs font-mono">
                [info] Repositórios encontrados: 28 repositórios públicos
              </Text>

              <View className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 my-2">
                <Text className="text-emerald-400 text-xs font-mono mb-1">
                  ✔ package.json (Next.js 15, React 19, TypeScript 5.8)
                </Text>
                <Text className="text-emerald-400 text-xs font-mono mb-1">
                  ✔ Cargo.toml (Rust 1.84, Tokio, Axum async engine)
                </Text>
                <Text className="text-emerald-400 text-xs font-mono">
                  ✔ requirements.txt (PyTorch, FastAPI, HuggingFace Transformers)
                </Text>
              </View>

              <Text className="text-indigo-300 text-xs font-mono">
                [synthesis] Compilando grafo de tecnologias e badges SVG...
              </Text>
              <Text className="text-emerald-300 text-xs font-mono font-bold">
                ✔ 3 saídas geradas: index.html (34kb), README.md (8kb), cv_ats.pdf (12kb)
              </Text>
            </View>

            <View className="flex-row items-center gap-2 pt-4 border-t border-slate-800">
              <View className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Text className="text-emerald-400 text-xs font-mono">
                Sessão local pronta. Zero dados persistidos em servidores externos.
              </Text>
            </View>
          </View>
        )}

        {/* Tab 3: ATS Score & Quality Audit */}
        {activeTab === 'metrics' && (
          <View className="w-full h-72 sm:h-96 md:h-[520px] bg-background p-6 sm:p-10 justify-between">
            <View className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <View className="p-5 rounded-2xl bg-surface border border-border items-center text-center">
                <View className="w-12 h-12 rounded-full bg-emerald-500/10 items-center justify-center mb-3">
                  <FileCheck2 size={24} color="#10b981" />
                </View>
                <Text className="text-emerald-400 font-black text-3xl mb-1">99/100</Text>
                <Text className="text-text font-bold text-sm">Compatibilidade ATS</Text>
                <Text className="text-text-muted text-xs mt-1">
                  Parsing perfeito em Workday, Greenhouse e Lever
                </Text>
              </View>

              <View className="p-5 rounded-2xl bg-surface border border-border items-center text-center">
                <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mb-3">
                  <Zap size={24} color="var(--primary)" />
                </View>
                <Text className="text-primary font-black text-3xl mb-1">100</Text>
                <Text className="text-text font-bold text-sm">Performance Web</Text>
                <Text className="text-text-muted text-xs mt-1">
                  LCP 0.4s • Zero JavaScript runtime no HTML exportado
                </Text>
              </View>

              <View className="p-5 rounded-2xl bg-surface border border-border items-center text-center">
                <View className="w-12 h-12 rounded-full bg-cyan-500/10 items-center justify-center mb-3">
                  <ShieldCheck size={24} color="#06b6d4" />
                </View>
                <Text className="text-cyan-400 font-black text-3xl mb-1">0 Bytes</Text>
                <Text className="text-text font-bold text-sm">Vazamento de Dados</Text>
                <Text className="text-text-muted text-xs mt-1">
                  Arquitetura 100% Local-First soberana
                </Text>
              </View>
            </View>

            <View className="p-4 rounded-2xl bg-surface-elevated border border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <CheckCircle2 size={20} color="var(--primary)" />
                <Text className="text-text font-semibold text-sm">
                  Pronto para enviar a recrutadores e publicar no GitHub Pages
                </Text>
              </View>
              <View className="px-3 py-1 rounded-full bg-primary/10 border border-primary/25">
                <Text className="text-primary font-bold text-xs">Aprovado</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
