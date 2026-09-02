import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  Globe,
  Terminal,
  FileCheck2,
  ExternalLink,
  CheckCircle2,
  GitBranch,
  Sparkles,
} from 'lucide-react-native';

export function MobileFirstHeroShowcase() {
  const [activeTab, setActiveTab] = useState<'preview' | 'terminal' | 'ats'>('preview');

  return (
    <View className="w-full max-w-4xl mx-auto rounded-3xl p-1 bg-gradient-to-b from-primary/30 via-border to-border/40 shadow-2xl shadow-primary/10">
      <View className="w-full rounded-[22px] overflow-hidden bg-surface border border-border/80 flex-col">
        {/* Mobile-First Segmented Control Bar */}
        <View className="w-full p-2.5 bg-surface-elevated border-b border-border flex-row items-center justify-between gap-1.5 flex-wrap sm:flex-nowrap">
          <View className="flex-row items-center gap-1.5 w-full sm:w-auto">
            <Pressable
              onPress={() => setActiveTab('preview')}
              className={`flex-1 sm:flex-initial flex-row items-center justify-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'preview' ? 'bg-primary shadow-sm' : 'bg-surface hover:bg-surface-elevated'
              }`}
            >
              <Globe
                size={14}
                color={activeTab === 'preview' ? 'var(--primary-foreground)' : 'var(--text-secondary)'}
              />
              <Text
                className={`text-xs font-bold ${
                  activeTab === 'preview' ? 'text-primary-foreground' : 'text-text-secondary'
                }`}
              >
                Portfólio Web
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('terminal')}
              className={`flex-1 sm:flex-initial flex-row items-center justify-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'terminal' ? 'bg-primary shadow-sm' : 'bg-surface hover:bg-surface-elevated'
              }`}
            >
              <Terminal
                size={14}
                color={activeTab === 'terminal' ? 'var(--primary-foreground)' : 'var(--text-secondary)'}
              />
              <Text
                className={`text-xs font-bold ${
                  activeTab === 'terminal' ? 'text-primary-foreground' : 'text-text-secondary'
                }`}
              >
                GitHub Scan
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('ats')}
              className={`flex-1 sm:flex-initial flex-row items-center justify-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'ats' ? 'bg-primary shadow-sm' : 'bg-surface hover:bg-surface-elevated'
              }`}
            >
              <FileCheck2
                size={14}
                color={activeTab === 'ats' ? 'var(--primary-foreground)' : 'var(--text-secondary)'}
              />
              <Text
                className={`text-xs font-bold ${
                  activeTab === 'ats' ? 'text-primary-foreground' : 'text-text-secondary'
                }`}
              >
                Score ATS
              </Text>
            </Pressable>
          </View>

          {/* Quick status indicator */}
          <View className="hidden md:flex flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-background border border-border">
            <View className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Text className="text-text-muted text-[11px] font-mono">100% Local-First Engine</Text>
          </View>
        </View>

        {/* Tab 1: Live Interactive Developer Profile (Native Mobile & Desktop Layout) */}
        {activeTab === 'preview' && (
          <View className="p-5 sm:p-8 bg-background flex-col gap-6">
            {/* Developer Identity Card */}
            <View className="flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
              <View className="flex-row items-center gap-3.5">
                <View className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-primary to-cyan-400 items-center justify-center shadow-lg shadow-primary/20">
                  <Text className="text-primary-foreground font-black text-xl sm:text-2xl">AC</Text>
                </View>
                <View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-text font-black text-lg sm:text-xl">Alex Chen</Text>
                    <View className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <Text className="text-emerald-400 font-bold text-[10px] uppercase">Available</Text>
                    </View>
                  </View>
                  <Text className="text-text-secondary text-xs sm:text-sm font-medium">
                    Staff Software Engineer & Creative Technologist
                  </Text>
                  <Text className="text-text-muted text-xs mt-0.5">San Francisco, CA • Open to Remote</Text>
                </View>
              </View>

              <View className="flex-row items-center gap-2">
                <View className="px-3.5 py-2 rounded-xl bg-surface border border-border flex-row items-center gap-1.5">
                  <GitBranch size={13} color="var(--primary)" />
                  <Text className="text-text font-mono text-xs font-bold">28 Repos</Text>
                </View>
                <View className="px-3.5 py-2 rounded-xl bg-primary/10 border border-primary/25 flex-row items-center gap-1.5">
                  <Sparkles size={13} color="var(--primary)" />
                  <Text className="text-primary font-mono text-xs font-bold">A+ Design</Text>
                </View>
              </View>
            </View>

            {/* Stack Badges */}
            <View className="flex-col gap-2">
              <Text className="text-text-muted text-[11px] font-mono uppercase tracking-wider font-bold">
                Tech Stack Principal
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {[
                  'TypeScript',
                  'React 19',
                  'Next.js',
                  'Rust',
                  'Tailwind CSS',
                  'Node.js',
                  'GraphQL',
                  'Docker',
                ].map((tech) => (
                  <View
                    key={tech}
                    className="px-3 py-1 rounded-full bg-surface border border-border"
                  >
                    <Text className="text-text font-mono text-xs font-medium">{tech}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Featured Project Showcase Card */}
            <View className="p-4 sm:p-5 rounded-2xl bg-surface border border-border/90 flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-1">
                  <Text className="text-text font-bold text-sm sm:text-base">
                    Neural Nexus AI Platform
                  </Text>
                  <View className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                    <Text className="text-cyan-400 font-bold text-[10px]">Open Source</Text>
                  </View>
                </View>
                <Text className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                  Engine de inferência de modelos locais em Rust com interface WebGL em tempo real.
                </Text>
              </View>

              <View className="flex-row items-center gap-2 w-full sm:w-auto justify-end">
                <View className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 flex-row items-center gap-1">
                  <Text className="text-primary font-bold text-xs">⭐ 1.4k stars</Text>
                </View>
                <View className="p-2 rounded-xl bg-surface-elevated border border-border">
                  <ExternalLink size={14} color="var(--text-muted)" />
                </View>
              </View>
            </View>

            {/* Bottom Footer Info */}
            <View className="flex-row items-center justify-between pt-2">
              <Text className="text-text-muted text-xs font-mono">
                Tema: AMOLED Black • Layout: Minimal Auto
              </Text>
              <View className="flex-row items-center gap-1">
                <CheckCircle2 size={13} color="var(--primary)" />
                <Text className="text-primary text-xs font-bold font-mono">
                  Geração Estática Pronta
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Tab 2: GitHub Live Terminal Simulator (Responsive) */}
        {activeTab === 'terminal' && (
          <View className="p-5 sm:p-7 bg-[#0c1017] font-mono flex-col gap-4">
            <View className="flex-row items-center gap-2 text-cyan-400">
              <Text className="text-emerald-400 font-bold">$</Text>
              <Text className="text-cyan-300 font-mono text-xs sm:text-sm break-all">
                portfolium scan --user octocat --deep-manifests
              </Text>
            </View>

            <View className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex-col gap-2">
              <Text className="text-emerald-400 text-xs font-mono">
                ✔ package.json (Next.js 15, React 19, TypeScript 5.8)
              </Text>
              <Text className="text-emerald-400 text-xs font-mono">
                ✔ Cargo.toml (Rust 1.84, Tokio, Axum async engine)
              </Text>
              <Text className="text-emerald-400 text-xs font-mono">
                ✔ requirements.txt (PyTorch, FastAPI, HuggingFace)
              </Text>
            </View>

            <Text className="text-indigo-300 text-xs font-mono">
              [synthesis] 28 repositórios analisados • 0ms latência externa
            </Text>
            <Text className="text-emerald-300 text-xs font-mono font-bold">
              ✔ 3 saídas geradas: index.html (34kb), README.md (8kb), cv_ats.pdf (12kb)
            </Text>
          </View>
        )}

        {/* Tab 3: ATS Score & Quality Audit (Responsive) */}
        {activeTab === 'ats' && (
          <View className="p-5 sm:p-7 bg-background flex-col gap-4">
            <View className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <View className="p-4 rounded-2xl bg-surface border border-border items-center text-center">
                <Text className="text-emerald-400 font-black text-2xl sm:text-3xl mb-0.5">99/100</Text>
                <Text className="text-text font-bold text-xs sm:text-sm">Score ATS</Text>
                <Text className="text-text-muted text-[11px] mt-0.5">Workday & Greenhouse</Text>
              </View>

              <View className="p-4 rounded-2xl bg-surface border border-border items-center text-center">
                <Text className="text-primary font-black text-2xl sm:text-3xl mb-0.5">100</Text>
                <Text className="text-text font-bold text-xs sm:text-sm">Web Perf</Text>
                <Text className="text-text-muted text-[11px] mt-0.5">LCP 0.4s • Zero JS runtime</Text>
              </View>

              <View className="p-4 rounded-2xl bg-surface border border-border items-center text-center">
                <Text className="text-cyan-400 font-black text-2xl sm:text-3xl mb-0.5">0 Bytes</Text>
                <Text className="text-text font-bold text-xs sm:text-sm">Data Leaks</Text>
                <Text className="text-text-muted text-[11px] mt-0.5">100% Local no browser</Text>
              </View>
            </View>

            <View className="p-3.5 rounded-2xl bg-surface-elevated border border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <CheckCircle2 size={16} color="var(--primary)" />
                <Text className="text-text font-semibold text-xs sm:text-sm">
                  Validado para vagas remotas globais
                </Text>
              </View>
              <View className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                <Text className="text-primary font-bold text-xs">Aprovado</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
