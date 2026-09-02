import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, Text, View, Pressable, Modal } from 'react-native';
import { Image } from 'expo-image';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/language-selector';
import { ThemeSelector } from '@/components/ui/ThemeSelector';
import { ArchitecturalGrid } from '@/components/ui/ArchitecturalGrid';
import { CircularBadgeText } from '@/components/ui/CircularBadgeText';
import { InfiniteMarquee } from '@/components/ui/InfiniteMarquee';
import { MobileFirstHeroShowcase } from '@/components/ui/MobileFirstHeroShowcase';
import { DeveloperReviews } from '@/components/ui/DeveloperReviews';
import { usePortfolioStore } from '@/store';
import {
  useGsapHero,
  useGsapScrollReveal,
  useGsapFloatingElements,
} from '@/utils/useGsapAnimation';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import {
  ArrowRight,
  Upload,
  Sparkles,
  Globe,
  FileCode2,
  FileText,
  CheckCircle2,
  Heart,
  XCircle,
  ExternalLink,
  Code,
  Download,
  Menu,
  X,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

// 3D Visual Assets
const GITHUB_SYNC_IMG = require('@/../assets/images/github-sync-bento.jpg');
const THEMES_PRESETS_IMG = require('@/../assets/images/themes-presets-bento.jpg');

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { importSession } = usePortfolioStore();

  const heroContainerRef = useRef<View>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Skill_AntiGravity_Ultimate_WebMotion Hooks
  useGsapHero(heroContainerRef);
  useGsapScrollReveal('.gsap-bento-card');
  useGsapScrollReveal('.gsap-format-card');
  useGsapFloatingElements('.gsap-floating-pill');

  const processJsonContent = React.useCallback(
    (content: string) => {
      try {
        const data = JSON.parse(content);
        const success = importSession(data);
        if (success) {
          if (Platform.OS === 'web') {
            window.alert(t('welcome.import_success'));
          }
          router.push('/(wizard)/profile');
        } else {
          if (Platform.OS === 'web') {
            window.alert(t('welcome.import_invalid'));
          }
        }
      } catch {
        if (Platform.OS === 'web') {
          window.alert(t('welcome.import_error'));
        }
      }
      setImporting(false);
    },
    [importSession, router, t]
  );

  const handlePickFile = async () => {
    try {
      setImporting(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        if (Platform.OS === 'web' && asset.file) {
          const content = await asset.file.text();
          processJsonContent(content);
        } else {
          const content = await FileSystem.readAsStringAsync(asset.uri);
          processJsonContent(content);
        }
      } else {
        setImporting(false);
      }
    } catch {
      if (Platform.OS === 'web') {
        window.alert(t('welcome.pick_error'));
      }
      setImporting(false);
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          setImporting(true);
          const content = await file.text();
          processJsonContent(content);
        } else {
          window.alert(t('welcome.drop_json_only'));
        }
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [processJsonContent, t]);

  return (
    <View className="flex-1 bg-background selection:bg-primary/30 overflow-x-hidden">
      {/* Editorial Architectural Vertical Lines */}
      <ArchitecturalGrid />

      {/* Fullscreen Drag & Drop Overlay */}
      {isDragging && (
        <View className="absolute inset-0 z-50 bg-background/95 border-4 border-dashed border-primary items-center justify-center backdrop-blur-2xl p-4">
          <Upload size={64} color="var(--primary)" className="mb-4 animate-bounce" />
          <Text className="text-text text-2xl sm:text-4xl font-black text-center mb-2">
            {t('welcome.drop_here')}
          </Text>
          <Text className="text-text-secondary text-sm text-center">
            JSON format session configuration
          </Text>
        </View>
      )}

      {/* Top Glass Navigation Bar (Mobile-First) */}
      <View className="w-full border-b border-border bg-surface/80 backdrop-blur-xl z-40 sticky top-0 px-4 sm:px-6 md:px-12 py-3 flex-row items-center justify-between">
        {/* Brand Logo */}
        <Pressable
          onPress={() => router.push('/')}
          className="flex-row items-center gap-2.5 active:opacity-80"
        >
          <View className="w-8 h-8 rounded-xl bg-primary items-center justify-center shadow-lg shadow-primary/25">
            <Sparkles size={16} color="var(--primary-foreground)" />
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-text font-black text-lg tracking-tight uppercase">Portfolium</Text>
            <View className="hidden sm:flex px-2 py-0.5 rounded-full bg-primary/10 border border-primary/25">
              <Text className="text-primary font-bold text-[10px]">v1.0</Text>
            </View>
          </View>
        </Pressable>

        {/* Desktop Links */}
        <View className="hidden lg:flex flex-row items-center gap-8">
          <Pressable onPress={() => router.push('/about' as any)} className="active:opacity-70">
            <Text className="text-text-secondary hover:text-text font-bold text-xs uppercase tracking-widest transition-colors">
              {t('landing.nav_about')}
            </Text>
          </Pressable>
          <Pressable onPress={() => router.push('/terms' as any)} className="active:opacity-70">
            <Text className="text-text-secondary hover:text-text font-bold text-xs uppercase tracking-widest transition-colors">
              {t('terms.title')}
            </Text>
          </Pressable>
          <Pressable onPress={() => router.push('/privacy' as any)} className="active:opacity-70">
            <Text className="text-text-secondary hover:text-text font-bold text-xs uppercase tracking-widest transition-colors">
              {t('privacy.title')}
            </Text>
          </Pressable>
        </View>

        {/* Right Controls */}
        <View className="flex-row items-center gap-2">
          <ThemeSelector />
          <LanguageSelector />
          
          {/* Mobile Menu Toggle Button */}
          <Pressable
            onPress={() => setMobileMenuOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl bg-surface border border-border items-center justify-center active:opacity-70"
          >
            <Menu size={18} color="var(--text)" />
          </Pressable>

          {/* Desktop CTA */}
          <Button
            onPress={() => router.push('/(wizard)/profile')}
            className="hidden sm:flex h-9 px-4 bg-primary rounded-full shadow-md shadow-primary/20 active:scale-95 transition-transform"
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-primary-foreground font-black text-xs uppercase tracking-wider">
                {t('landing.nav_start')}
              </Text>
              <ArrowRight size={13} color="var(--primary-foreground)" />
            </View>
          </Button>
        </View>
      </View>

      {/* Mobile Navigation Drawer Modal */}
      <Modal
        visible={mobileMenuOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setMobileMenuOpen(false)}
      >
        <View className="flex-1 bg-background/95 backdrop-blur-xl p-6 justify-between">
          <View>
            <View className="flex-row items-center justify-between pb-6 border-b border-border">
              <View className="flex-row items-center gap-2">
                <View className="w-8 h-8 rounded-xl bg-primary items-center justify-center">
                  <Sparkles size={16} color="var(--primary-foreground)" />
                </View>
                <Text className="text-text font-black text-xl uppercase">Portfolium</Text>
              </View>
              <Pressable
                onPress={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-xl bg-surface border border-border items-center justify-center"
              >
                <X size={20} color="var(--text)" />
              </Pressable>
            </View>

            <View className="flex-col gap-5 pt-8">
              <Pressable
                onPress={() => {
                  setMobileMenuOpen(false);
                  router.push('/(wizard)/profile');
                }}
                className="p-4 rounded-2xl bg-primary flex-row items-center justify-between"
              >
                <Text className="text-primary-foreground font-black text-base uppercase">
                  {t('landing.nav_start')}
                </Text>
                <ArrowRight size={18} color="var(--primary-foreground)" />
              </Pressable>

              <Pressable
                onPress={() => {
                  setMobileMenuOpen(false);
                  router.push('/about' as any);
                }}
                className="p-4 rounded-2xl bg-surface border border-border"
              >
                <Text className="text-text font-bold text-base">{t('about.title')}</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setMobileMenuOpen(false);
                  router.push('/terms' as any);
                }}
                className="p-4 rounded-2xl bg-surface border border-border"
              >
                <Text className="text-text font-bold text-base">{t('terms.title')}</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setMobileMenuOpen(false);
                  router.push('/privacy' as any);
                }}
                className="p-4 rounded-2xl bg-surface border border-border"
              >
                <Text className="text-text font-bold text-base">{t('privacy.title')}</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setMobileMenuOpen(false);
                  router.push('/cookies' as any);
                }}
                className="p-4 rounded-2xl bg-surface border border-border"
              >
                <Text className="text-text font-bold text-base">{t('cookies.title')}</Text>
              </Pressable>
            </View>
          </View>

          <View className="pt-6 border-t border-border items-center">
            <Text className="text-text-muted text-xs font-mono">100% Local-First • Open Source MIT</Text>
          </View>
        </View>
      </Modal>

      {/* Main Continuous Flow */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* =========================================================================
            ACT 1: THE EDITORIAL HERO (Mobile-First Layout)
           ========================================================================= */}
        <View
          ref={heroContainerRef}
          className="w-full justify-center items-center px-4 sm:px-6 md:px-12 pt-8 sm:pt-14 md:pt-20 pb-16 relative overflow-hidden"
        >
          <View className="w-full max-w-6xl items-center z-10">
            {/* Top Micro Services Text */}
            <View className="gsap-hero-badge flex-col items-center mb-6 sm:mb-8 text-center px-2">
              <Text className="text-primary font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-1 text-center">
                {t('landing.editorial_service_label')}
              </Text>
              <Text className="text-text-muted font-mono text-[11px] sm:text-xs tracking-wider uppercase max-w-lg text-center leading-relaxed">
                {t('landing.editorial_service_1')}
              </Text>
            </View>

            {/* Headline Editorial Monumental (Fluid Mobile Sizes) */}
            <View className="gsap-hero-title items-center justify-center mb-6 text-center w-full">
              <Text className="text-text text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-center tracking-tight uppercase leading-[1.02]">
                PORTFOLIO
              </Text>
              <View className="flex-row items-center justify-center flex-wrap gap-1.5 sm:gap-3 my-0.5 sm:my-1.5">
                <Text className="text-primary font-serif italic text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal lowercase tracking-normal">
                  identity
                </Text>
                <Text className="text-text text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-[1.02]">
                  ENGINE
                </Text>
              </View>
              <Text className="text-text-secondary text-xl sm:text-3xl md:text-4xl font-black text-center tracking-tight uppercase mt-1">
                FOR DEVELOPERS
              </Text>
            </View>

            {/* Subtitle Description */}
            <Text className="gsap-hero-desc text-text-secondary text-sm sm:text-base md:text-lg text-center mb-8 sm:mb-10 max-w-2xl font-normal leading-relaxed px-2">
              {t('landing.hero_description')}
            </Text>

            {/* Action Buttons & Rotating Seal (Mobile-First Stack) */}
            <View className="gsap-hero-cta flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md sm:max-w-none mb-12 sm:mb-16">
              <View className="flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <Button
                  onPress={() => router.push('/(wizard)/profile')}
                  className="w-full sm:w-auto h-13 sm:h-14 px-8 sm:px-10 bg-primary rounded-full shadow-2xl shadow-primary/30 active:scale-[0.98] transition-transform"
                >
                  <View className="flex-row items-center justify-center gap-2">
                    <Text className="text-primary-foreground font-black text-sm sm:text-base uppercase tracking-wider">
                      {t('landing.cta_create')}
                    </Text>
                    <ArrowRight size={18} color="var(--primary-foreground)" />
                  </View>
                </Button>

                <Button
                  onPress={handlePickFile}
                  isLoading={importing}
                  variant="outline"
                  className="w-full sm:w-auto h-13 sm:h-14 px-7 sm:px-8 rounded-full border-border-strong bg-surface/80 backdrop-blur-md active:scale-[0.98] transition-transform"
                >
                  <View className="flex-row items-center justify-center gap-2">
                    <Upload size={16} color="var(--text)" />
                    <Text className="text-text font-bold text-sm sm:text-base">
                      {t('landing.cta_import')}
                    </Text>
                  </View>
                </Button>
              </View>

              {/* Rotating Circular Seal */}
              <View className="hidden sm:flex">
                <CircularBadgeText
                  text="100% LOCAL-FIRST • ZERO SERVER LEAK • "
                  size={100}
                  icon="sparkles"
                />
              </View>
            </View>

            {/* Mobile-First Native Interactive Showcase */}
            <MobileFirstHeroShowcase />
          </View>
        </View>

        {/* =========================================================================
            INFINITE MARQUEE STRIP
           ========================================================================= */}
        <InfiniteMarquee />

        {/* =========================================================================
            EDITORIAL PHILOSOPHY & MANIFESTO
           ========================================================================= */}
        <View className="w-full px-4 sm:px-6 md:px-12 py-16 sm:py-24 bg-background border-b border-border items-center">
          <View className="w-full max-w-5xl">
            <View className="flex-row items-center gap-2.5 mb-4 sm:mb-6">
              <View className="w-2.5 h-2.5 rounded-full bg-primary" />
              <Text className="text-primary font-mono text-xs font-black uppercase tracking-[0.2em]">
                {t('landing.manifesto_label')}
              </Text>
            </View>
            <Text className="text-text text-xl sm:text-3xl md:text-5xl font-black uppercase leading-snug sm:leading-tight tracking-tight mb-6 sm:mb-8">
              {t('landing.manifesto_text')}
            </Text>
            <View className="flex-row flex-wrap gap-2 sm:gap-3">
              {['100% Client-Side', 'No Cloud Database', 'Zero Monthly Fees', 'Static Zip Download'].map(
                (pill) => (
                  <View
                    key={pill}
                    className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-surface border border-border flex-row items-center gap-1.5 sm:gap-2"
                  >
                    <CheckCircle2 size={13} color="var(--primary)" />
                    <Text className="text-text text-[11px] sm:text-xs font-mono font-bold uppercase">{pill}</Text>
                  </View>
                )
              )}
            </View>
          </View>
        </View>

        {/* =========================================================================
            ACT 2: SCROLLYTELLING JOURNEY (Stages Mobile-First)
           ========================================================================= */}
        <View className="w-full px-4 sm:px-6 md:px-12 py-16 sm:py-24 bg-surface border-b border-border items-center">
          <View className="w-full max-w-6xl">
            {/* Section Header */}
            <View className="flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 pb-5 border-b border-border/80 gap-3">
              <View>
                <Text className="text-primary font-serif italic text-xl sm:text-3xl font-normal lowercase tracking-normal mb-1">
                  selected
                </Text>
                <Text className="text-text text-2xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight">
                  STAGES // JOURNEY
                </Text>
              </View>
              <View className="hidden sm:flex flex-row items-center gap-3">
                <CircularBadgeText
                  text="SCROLL TO EXPLORE • SCROLL TO EXPLORE • "
                  size={85}
                  icon="arrow"
                />
              </View>
            </View>

            {/* Stages Container */}
            <View className="flex-col gap-8 sm:gap-10">
              {/* STAGE 01: Data Ingestion */}
              <View className="gsap-bento-card w-full bg-background border border-border rounded-3xl overflow-hidden shadow-xl hover:border-primary/40 transition-colors">
                <View className="p-3.5 sm:p-4 bg-surface-elevated border-b border-border flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2.5">
                    <View className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-cyan-500/20 items-center justify-center">
                      <Text className="text-cyan-400 font-mono font-bold text-xs">01</Text>
                    </View>
                    <Text className="text-text font-bold text-xs sm:text-sm uppercase tracking-wider">
                      {t('landing.stage_1_badge')}
                    </Text>
                  </View>
                  <View className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                    <Text className="text-cyan-400 font-mono text-[10px] sm:text-xs font-semibold">
                      GitHub Manifests
                    </Text>
                  </View>
                </View>

                <View className="flex-col md:flex-row items-center">
                  <View className="flex-1 p-6 sm:p-8 md:p-12">
                    <Text className="text-text text-xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4">
                      {t('landing.bento_github_title')}
                    </Text>
                    <Text className="text-text-secondary text-sm sm:text-base md:text-lg leading-relaxed mb-6">
                      {t('landing.bento_github_desc')}
                    </Text>
                    <View className="flex-row flex-wrap gap-2 mb-6">
                      {['package.json', 'pom.xml', 'requirements.txt', 'Cargo.toml', 'go.mod'].map(
                        (manifest) => (
                          <View
                            key={manifest}
                            className="px-3 py-1.5 rounded-full bg-surface border border-border flex-row items-center gap-1.5"
                          >
                            <CheckCircle2 size={12} color="var(--primary)" />
                            <Text className="text-text font-mono text-xs font-semibold">
                              {manifest}
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                    <View className="p-3 rounded-2xl bg-surface border border-border flex-row items-center gap-2">
                      <Code size={15} color="var(--primary)" />
                      <Text className="text-text-secondary text-xs font-mono">
                        {t('landing.terminal_found')}
                      </Text>
                    </View>
                  </View>
                  <View className="w-full md:w-1/2 h-64 sm:h-80 md:h-96 overflow-hidden">
                    <Image
                      source={GITHUB_SYNC_IMG}
                      contentFit="cover"
                      transition={300}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </View>
                </View>
              </View>

              {/* STAGE 02 & STAGE 03 */}
              <View className="flex-col md:flex-row gap-6 sm:gap-8">
                {/* STAGE 02: Visual Themes */}
                <View className="gsap-bento-card flex-1 bg-background border border-border rounded-3xl overflow-hidden shadow-xl hover:border-primary/40 transition-colors">
                  <View className="p-3.5 sm:p-4 bg-surface-elevated border-b border-border flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2.5">
                      <View className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-purple-500/20 items-center justify-center">
                        <Text className="text-purple-400 font-mono font-bold text-xs">02</Text>
                      </View>
                      <Text className="text-text font-bold text-xs sm:text-sm uppercase tracking-wider">
                        {t('landing.stage_2_badge')}
                      </Text>
                    </View>
                  </View>

                  <View className="w-full h-56 sm:h-64 overflow-hidden">
                    <Image
                      source={THEMES_PRESETS_IMG}
                      contentFit="cover"
                      transition={300}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </View>
                  <View className="p-6 sm:p-8">
                    <Text className="text-text text-xl sm:text-2xl font-black mb-2 sm:mb-3">
                      {t('landing.bento_themes_title')}
                    </Text>
                    <Text className="text-text-secondary text-sm sm:text-base leading-relaxed mb-5">
                      {t('landing.bento_themes_desc')}
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {['AMOLED Black', 'Lava Red', 'Cosmic Glow', 'Orbit Layout', 'Clean Light'].map(
                        (preset) => (
                          <View
                            key={preset}
                            className="px-3 py-1 rounded-full bg-surface border border-border"
                          >
                            <Text className="text-text text-xs font-semibold">{preset}</Text>
                          </View>
                        )
                      )}
                    </View>
                  </View>
                </View>

                {/* STAGE 03: Local-First Sovereignty */}
                <View className="gsap-bento-card flex-1 bg-background border border-border rounded-3xl overflow-hidden shadow-xl hover:border-primary/40 transition-colors justify-between flex-col">
                  <View className="p-3.5 sm:p-4 bg-surface-elevated border-b border-border flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2.5">
                      <View className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-500/20 items-center justify-center">
                        <Text className="text-emerald-400 font-mono font-bold text-xs">03</Text>
                      </View>
                      <Text className="text-text font-bold text-xs sm:text-sm uppercase tracking-wider">
                        {t('landing.stage_3_badge')}
                      </Text>
                    </View>
                    <View className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <Text className="text-emerald-400 font-mono text-[10px] sm:text-xs font-semibold">
                        Soberania
                      </Text>
                    </View>
                  </View>

                  <View className="p-6 sm:p-8">
                    <Text className="text-text text-xl sm:text-2xl font-black mb-2 sm:mb-3">
                      {t('landing.bento_local_title')}
                    </Text>
                    <Text className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6">
                      {t('landing.bento_local_desc')}
                    </Text>

                    <View className="flex-col gap-3">
                      <View className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex-row items-start gap-2.5">
                        <CheckCircle2 size={16} color="#10b981" className="mt-0.5" />
                        <View className="flex-1">
                          <Text className="text-text font-bold text-xs sm:text-sm">
                            Portfolium: 100% no navegador
                          </Text>
                          <Text className="text-text-muted text-[11px] mt-0.5">
                            Sem banco de dados remoto, zero rastreadores, licença livre MIT.
                          </Text>
                        </View>
                      </View>

                      <View className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 flex-row items-start gap-2.5 opacity-80">
                        <XCircle size={16} color="#ef4444" className="mt-0.5" />
                        <View className="flex-1">
                          <Text className="text-text font-bold text-xs sm:text-sm">
                            Builders Tradicionais na Nuvem
                          </Text>
                          <Text className="text-text-muted text-[11px] mt-0.5">
                            Retêm seus dados e exigem pagamento de mensalidade.
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View className="p-3.5 sm:p-4 border-t border-border bg-surface flex-row items-center justify-between">
                    <Text className="text-text-muted text-xs font-mono">AsyncStorage</Text>
                    <Text className="text-emerald-400 text-xs font-mono font-bold">0 bytes vazados</Text>
                  </View>
                </View>
              </View>

              {/* STAGE 04: Decoupled Launch */}
              <View className="gsap-bento-card w-full bg-background border border-border rounded-3xl p-6 sm:p-8 md:p-12 flex-col md:flex-row items-center justify-between gap-6 shadow-xl hover:border-primary/40 transition-colors">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-2 sm:mb-3">
                    <View className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-primary/20 items-center justify-center">
                      <Text className="text-primary font-mono font-bold text-xs">04</Text>
                    </View>
                    <Text className="text-primary font-mono text-xs font-bold uppercase tracking-wider">
                      {t('landing.stage_4_badge')}
                    </Text>
                  </View>
                  <Text className="text-text text-xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3">
                    {t('landing.bento_export_title')}
                  </Text>
                  <Text className="text-text-secondary text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mb-3">
                    {t('landing.bento_export_desc')}
                  </Text>
                  <Text className="text-text-muted text-xs font-mono">
                    {t('landing.terminal_optimized')}
                  </Text>
                </View>

                <View className="flex-row flex-wrap gap-2.5 w-full md:w-auto">
                  <View className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-surface border border-border shadow-sm flex-row items-center justify-center gap-1.5">
                    <ExternalLink size={14} color="var(--primary)" />
                    <Text className="text-primary font-bold text-xs font-mono">GitHub Pages</Text>
                  </View>
                  <View className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-surface border border-border shadow-sm flex-row items-center justify-center gap-1.5">
                    <ExternalLink size={14} color="var(--primary)" />
                    <Text className="text-primary font-bold text-xs font-mono">Vercel</Text>
                  </View>
                  <View className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-surface border border-border shadow-sm flex-row items-center justify-center gap-1.5">
                    <Download size={14} color="var(--primary)" />
                    <Text className="text-primary font-bold text-xs font-mono">ZIP</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* =========================================================================
            ACT 3: THE TRINITY OUTPUTS (Web, README, ATS)
           ========================================================================= */}
        <View className="w-full px-4 sm:px-6 md:px-12 py-16 sm:py-24 bg-background items-center">
          <View className="w-full max-w-6xl">
            <View className="flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 pb-5 border-b border-border/80 gap-3">
              <View>
                <Text className="text-primary font-serif italic text-xl sm:text-3xl font-normal lowercase tracking-normal mb-1">
                  {t('landing.selected_works_label')}
                </Text>
                <Text className="text-text text-2xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight">
                  {t('landing.selected_works_title')}
                </Text>
              </View>
            </View>

            {/* Rich 3-Output Cards (Mobile-First Grid) */}
            <View className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Output 1: Web Portfolio */}
              <View className="gsap-format-card bg-surface border border-border rounded-3xl p-6 sm:p-8 hover:border-primary/50 transition-all shadow-xl flex-col justify-between">
                <View>
                  <View className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 items-center justify-center mb-5 shadow-sm">
                    <Globe size={24} color="var(--primary)" />
                  </View>
                  <Text className="text-text text-xl sm:text-2xl font-black mb-2 sm:mb-3">
                    {t('landing.format_web_title')}
                  </Text>
                  <Text className="text-text-secondary text-sm sm:text-base leading-relaxed mb-5">
                    {t('landing.format_web_desc')}
                  </Text>
                </View>

                {/* Preview Box */}
                <View className="p-3.5 sm:p-4 rounded-2xl bg-background border border-border mb-5">
                  <View className="flex-row items-center gap-1.5 mb-2">
                    <View className="w-2 h-2 rounded-full bg-red-400" />
                    <View className="w-2 h-2 rounded-full bg-yellow-400" />
                    <View className="w-2 h-2 rounded-full bg-green-400" />
                  </View>
                  <Text className="text-text font-bold text-xs mb-0.5">index.html + styles.css</Text>
                  <Text className="text-text-muted text-[11px] font-mono">
                    Zero bundlers • Responsivo • 9 temas
                  </Text>
                </View>

                <View className="flex-row items-center gap-2 pt-2 border-t border-border/80">
                  <CheckCircle2 size={15} color="var(--primary)" />
                  <Text className="text-primary font-bold text-[11px] sm:text-xs uppercase tracking-wider">
                    Hospedagem Instantânea Grátis
                  </Text>
                </View>
              </View>

              {/* Output 2: Profile README */}
              <View className="gsap-format-card bg-surface border border-border rounded-3xl p-6 sm:p-8 hover:border-primary/50 transition-all shadow-xl flex-col justify-between">
                <View>
                  <View className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-cyan-500/10 items-center justify-center mb-5 shadow-sm">
                    <FileCode2 size={24} color="#06b6d4" />
                  </View>
                  <Text className="text-text text-xl sm:text-2xl font-black mb-2 sm:mb-3">
                    {t('landing.format_readme_title')}
                  </Text>
                  <Text className="text-text-secondary text-sm sm:text-base leading-relaxed mb-5">
                    {t('landing.format_readme_desc')}
                  </Text>
                </View>

                {/* Preview Box */}
                <View className="p-3.5 sm:p-4 rounded-2xl bg-background border border-border mb-5 font-mono">
                  <Text className="text-cyan-400 text-xs font-mono mb-1"># Hi there, I'm a Dev 👋</Text>
                  <Text className="text-text-muted text-[10px] sm:text-[11px] font-mono mb-1.5">
                    [![Skills](https://img.shields.io/badge/Stack-React_19-blue)]
                  </Text>
                  <Text className="text-emerald-400 text-[10px] sm:text-[11px] font-mono">
                    ✔ Auto-sync com repositórios GitHub
                  </Text>
                </View>

                <View className="flex-row items-center gap-2 pt-2 border-t border-border/80">
                  <CheckCircle2 size={15} color="#06b6d4" />
                  <Text className="text-cyan-400 font-bold text-[11px] sm:text-xs uppercase tracking-wider">
                    Destaque no GitHub Profile
                  </Text>
                </View>
              </View>

              {/* Output 3: ATS Resume */}
              <View className="gsap-format-card bg-surface border border-border rounded-3xl p-6 sm:p-8 hover:border-primary/50 transition-all shadow-xl flex-col justify-between">
                <View>
                  <View className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/10 items-center justify-center mb-5 shadow-sm">
                    <FileText size={24} color="#10b981" />
                  </View>
                  <Text className="text-text text-xl sm:text-2xl font-black mb-2 sm:mb-3">
                    {t('landing.format_cv_title')}
                  </Text>
                  <Text className="text-text-secondary text-sm sm:text-base leading-relaxed mb-5">
                    {t('landing.format_cv_desc')}
                  </Text>
                </View>

                {/* Preview Box */}
                <View className="p-3.5 sm:p-4 rounded-2xl bg-background border border-border mb-5">
                  <View className="flex-row items-center justify-between mb-1.5">
                    <Text className="text-text font-bold text-xs">ATS Parsing Score</Text>
                    <Text className="text-emerald-400 font-bold font-mono text-xs">99/100</Text>
                  </View>
                  <View className="w-full h-1.5 rounded-full bg-surface overflow-hidden mb-1.5">
                    <View className="w-[99%] h-full bg-emerald-400 rounded-full" />
                  </View>
                  <Text className="text-text-muted text-[10px] sm:text-[11px]">
                    Greenhouse, Workday & Lever
                  </Text>
                </View>

                <View className="flex-row items-center gap-2 pt-2 border-t border-border/80">
                  <CheckCircle2 size={15} color="#10b981" />
                  <Text className="text-emerald-400 font-bold text-[11px] sm:text-xs uppercase tracking-wider">
                    Aprovado para Triagem Global
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* =========================================================================
            ACT 4: REAL DEVELOPER REVIEWS (Community Proof)
           ========================================================================= */}
        <View className="w-full px-4 sm:px-6 md:px-12 py-16 sm:py-24 bg-surface border-t border-border items-center">
          <View className="w-full max-w-6xl items-center">
            <View className="text-center items-center mb-12 sm:mb-16">
              <Text className="text-primary font-serif italic text-xl sm:text-3xl font-normal lowercase tracking-normal mb-1">
                community
              </Text>
              <Text className="text-text text-2xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-3">
                {t('landing.testimonials_title')}
              </Text>
              <Text className="text-text-secondary text-sm sm:text-base md:text-lg text-center max-w-2xl leading-relaxed">
                {t('landing.testimonials_subtitle')}
              </Text>
            </View>

            {/* Real Reviews Grid */}
            <DeveloperReviews />
          </View>
        </View>

        {/* =========================================================================
            ACT 5: THE FINAL CALL TO ACTION (Aurora Glow)
           ========================================================================= */}
        <View className="w-full px-4 sm:px-6 md:px-12 py-16 sm:py-24 bg-background items-center relative overflow-hidden">
          <View className="w-full max-w-4xl bg-surface-elevated border border-border rounded-3xl p-8 sm:p-12 md:p-16 items-center text-center shadow-2xl relative overflow-hidden">
            <View className="absolute -top-10 -right-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
            <View className="absolute -bottom-10 -left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <View className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-primary/10 items-center justify-center mb-5 shadow-sm">
              <Sparkles size={28} color="var(--primary)" />
            </View>
            <Text className="text-text text-2xl sm:text-4xl md:text-5xl font-black mb-3 text-center uppercase tracking-tight">
              {t('landing.cta_banner_title')}
            </Text>
            <Text className="text-text-secondary text-sm sm:text-base md:text-lg mb-8 max-w-lg text-center leading-relaxed">
              {t('landing.cta_banner_subtitle')}
            </Text>
            <Button
              onPress={() => router.push('/(wizard)/profile')}
              className="w-full sm:w-auto h-13 sm:h-14 px-10 sm:px-12 bg-primary rounded-full shadow-2xl shadow-primary/30 active:scale-[0.98] transition-transform"
            >
              <View className="flex-row items-center justify-center gap-2.5">
                <Text className="text-primary-foreground font-black text-base uppercase tracking-wider">
                  {t('welcome.start')}
                </Text>
                <ArrowRight size={20} color="var(--primary-foreground)" />
              </View>
            </Button>
          </View>
        </View>

        {/* =========================================================================
            FOOTER: SEMANTIC COMPLIANCE & LEGAL LINKS
           ========================================================================= */}
        <View className="w-full bg-surface border-t border-border px-4 sm:px-6 md:px-12 py-12 sm:py-16">
          <View className="max-w-6xl mx-auto flex-col md:flex-row justify-between gap-10 mb-10">
            {/* Brand Column */}
            <View className="max-w-sm">
              <View className="flex-row items-center gap-2.5 mb-3">
                <View className="w-7 h-7 rounded-xl bg-primary items-center justify-center">
                  <Sparkles size={14} color="var(--primary-foreground)" />
                </View>
                <Text className="text-text font-black text-lg uppercase">Portfolium</Text>
              </View>
              <Text className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-4">
                {t('landing.hero_description')}
              </Text>
              <View className="flex-row items-center gap-1.5 text-text-muted text-xs">
                <Heart size={13} color="var(--primary)" />
                <Text className="text-text-muted text-xs">{t('landing.footer_source_code')}</Text>
              </View>
            </View>

            {/* Links Columns */}
            <View className="flex-row flex-wrap gap-8 sm:gap-14 md:gap-20">
              {/* Product */}
              <View>
                <Text className="text-text font-bold text-xs uppercase tracking-wider mb-3">
                  {t('landing.footer_product')}
                </Text>
                <View className="flex-col gap-2">
                  <Pressable onPress={() => router.push('/(wizard)/profile')}>
                    <Text className="text-text-secondary hover:text-text text-xs sm:text-sm font-medium">
                      {t('landing.nav_start')}
                    </Text>
                  </Pressable>
                  <Pressable onPress={handlePickFile}>
                    <Text className="text-text-secondary hover:text-text text-xs sm:text-sm font-medium">
                      {t('welcome.import_session')}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Legal */}
              <View>
                <Text className="text-text font-bold text-xs uppercase tracking-wider mb-3">
                  {t('landing.footer_legal')}
                </Text>
                <View className="flex-col gap-2">
                  <Pressable onPress={() => router.push('/terms' as any)}>
                    <Text className="text-text-secondary hover:text-text text-xs sm:text-sm font-medium">
                      {t('terms.title')}
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => router.push('/privacy' as any)}>
                    <Text className="text-text-secondary hover:text-text text-xs sm:text-sm font-medium">
                      {t('privacy.title')}
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => router.push('/cookies' as any)}>
                    <Text className="text-text-secondary hover:text-text text-xs sm:text-sm font-medium">
                      {t('cookies.title')}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Company */}
              <View>
                <Text className="text-text font-bold text-xs uppercase tracking-wider mb-3">
                  {t('landing.footer_community')}
                </Text>
                <View className="flex-col gap-2">
                  <Pressable onPress={() => router.push('/about' as any)}>
                    <Text className="text-text-secondary hover:text-text text-xs sm:text-sm font-medium">
                      {t('about.title')}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          {/* Bottom Bar */}
          <View className="max-w-6xl mx-auto border-t border-border pt-5 flex-col sm:flex-row items-center justify-between gap-3">
            <Text className="text-text-muted text-[11px]">
              © {new Date().getFullYear()} Portfolium. {t('landing.footer_rights')}
            </Text>
            <Text className="text-text-muted text-[11px] font-mono">MIT Licensed • Universal First</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
