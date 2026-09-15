import { useRouter } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Modal,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/ui/language-selector';
import { ThemeSelector } from '@/components/ui/ThemeSelector';
import { ArchitecturalGrid } from '@/components/ui/ArchitecturalGrid';
import { InfiniteMarquee } from '@/components/ui/InfiniteMarquee';
import { DeveloperReviews } from '@/components/ui/DeveloperReviews';
import { SessionDropzone } from '@/components/ui/SessionDropzone';
import { useThemeColors } from '@/theme/ThemeContext';
import {
  ArrowRight,
  Sparkles,
  Globe,
  FileCode2,
  FileText,
  CheckCircle2,
  Heart,
  XCircle,
  Menu,
  X,
  ShieldCheck,
  Zap,
  Activity,
  ChevronDown,
  Layers,
  Cpu,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const router = useRouter();

  const scrollRef = useRef<ScrollView>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Reanimated scroll position shared value
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const scrollToSection = (yOffset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: yOffset, animated: true });
    }
  };

  // Universal Desktop Keyboard Navigation (Safeguards: Web-only, input guard, modifier key safety)
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const WAYPOINTS = [0, 1000, 2150, 3600];

    const handleKeyDown = (e: KeyboardEvent) => {
      // Modifier key safety: ignore if Ctrl, Alt, Meta is held
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // Input guard: ignore if active element is an input, textarea, select or contentEditable
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl.tagName) ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      if (e.key === '1') {
        scrollToSection(WAYPOINTS[0]);
      } else if (e.key === '2') {
        scrollToSection(WAYPOINTS[1]);
      } else if (e.key === '3') {
        scrollToSection(WAYPOINTS[2]);
      } else if (e.key === '4') {
        scrollToSection(WAYPOINTS[3]);
      } else if (e.key === 'j' || e.key === 'J') {
        const currentY = scrollY.value;
        const next = WAYPOINTS.find((y) => y > currentY + 120);
        if (next !== undefined) {
          scrollToSection(next);
        }
      } else if (e.key === 'k' || e.key === 'K') {
        const currentY = scrollY.value;
        const prev = [...WAYPOINTS].reverse().find((y) => y < currentY - 120);
        if (prev !== undefined) {
          scrollToSection(prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [scrollY]);

  // =========================================================================
  // RECALIBRATED SCROLL INTERPOLATION RANGES (Expanded Spatial Rhythm)
  // =========================================================================

  // Floating Scroll Hint Fade-Out & slide down upon initial scroll (P3 fix)
  const scrollHintAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 180],
      [1, 0],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, 180],
      [0, 12],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // Telemetry Progress Bar Style: smooth 0% -> 100% over total scroll distance
  const progressBarStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollY.value,
      [0, 4200],
      [0, 100],
      Extrapolation.CLAMP
    );
    return {
      width: `${progress}%`,
    };
  });

  // Act I Style: Dilemma Collapse
  const act1AnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 400, 850],
      [1, 0.85, 0.2],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [0, 600],
      [1, 0.95],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, 600],
      [0, -40],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ scale }, { translateY }],
    };
  });

  // Act II Style: Singularity Core Ignition
  const act2AnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [400, 850, 1700, 2150],
      [0.2, 1, 1, 0.25],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [400, 850, 1700],
      [0.92, 1, 0.98],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  // Act III Style: The Metamorphosis Trinity Expansion
  const act3AnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [1600, 2100, 3000, 3450],
      [0.2, 1, 1, 0.3],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [1600, 2100],
      [50, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // Act IV Style: The Launchpad Surge
  const act4AnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [2900, 3500],
      [0.25, 1],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [2900, 3500],
      [0.93, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <View className="flex-1 bg-background selection:bg-primary/30 overflow-x-hidden">
      {/* Architectural Background Grid */}
      <ArchitecturalGrid />

      {/* Narrative Telemetry Top Progress Line */}
      <View className="w-full h-1 bg-border/40 fixed top-0 left-0 right-0 z-50">
        <Animated.View className="h-full bg-primary" style={progressBarStyle} />
      </View>

      {/* Floating Toast Notification */}
      {toast && (
        <View className="absolute top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-surface border border-border shadow-2xl flex-row items-center gap-3">
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} color={colors.primary} />
          ) : (
            <XCircle size={18} color={colors.textMuted} />
          )}
          <Text className="text-text text-sm font-medium">{toast.message}</Text>
        </View>
      )}

      {/* Universal Sticky Navigation Header */}
      <View className="w-full border-b border-border bg-surface/85 backdrop-blur-xl z-40 sticky top-0 px-4 sm:px-8 md:px-16 py-4 flex-row items-center justify-between">
        {/* Brand Mark */}
        <Pressable
          onPress={() => scrollToSection(0)}
          className="flex-row items-center gap-2.5 active:opacity-80"
          accessibilityRole="link"
          accessibilityLabel="Portfolium Scrollytelling"
        >
          <View className="w-8 h-8 rounded-xl bg-primary items-center justify-center shadow-lg shadow-primary/25">
            <Sparkles size={16} color={colors.primaryForeground} />
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-text font-black text-lg tracking-tight uppercase">Portfolium</Text>
            <View className="hidden sm:flex px-2 py-0.5 rounded-full bg-primary/10 border border-primary/25">
              <Text className="text-primary font-bold text-xs font-mono">v1.0</Text>
            </View>
          </View>
        </Pressable>

        {/* Desktop Telemetry Chapter Waypoints */}
        <View className="hidden md:flex flex-row items-center gap-7">
          <Pressable onPress={() => scrollToSection(0)} className="active:opacity-70">
            <Text className="text-text-secondary hover:text-text font-mono text-xs font-bold uppercase tracking-wider transition-colors">
              {t('landing.telemetry_nav_act1')}
            </Text>
          </Pressable>
          <Pressable onPress={() => scrollToSection(1000)} className="active:opacity-70">
            <Text className="text-text-secondary hover:text-text font-mono text-xs font-bold uppercase tracking-wider transition-colors">
              {t('landing.telemetry_nav_act2')}
            </Text>
          </Pressable>
          <Pressable onPress={() => scrollToSection(2150)} className="active:opacity-70">
            <Text className="text-text-secondary hover:text-text font-mono text-xs font-bold uppercase tracking-wider transition-colors">
              {t('landing.telemetry_nav_act3')}
            </Text>
          </Pressable>
          <Pressable onPress={() => scrollToSection(3600)} className="active:opacity-70">
            <Text className="text-text-secondary hover:text-text font-mono text-xs font-bold uppercase tracking-wider transition-colors">
              {t('landing.telemetry_nav_act4')}
            </Text>
          </Pressable>
          <View className="hidden lg:flex px-2 py-0.5 rounded-full bg-surface-elevated border border-border">
            <Text className="text-text-muted font-mono text-xs">
              {t('landing.keyboard_shortcuts_hint')}
            </Text>
          </View>
        </View>

        {/* Global Controls */}
        <View className="flex-row items-center gap-2.5">
          <ThemeSelector />
          <LanguageSelector />

          <Pressable
            onPress={() => setMobileMenuOpen(true)}
            className="md:hidden w-9 h-9 rounded-xl bg-surface border border-border items-center justify-center active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="Navigation Menu"
          >
            <Menu size={18} color={colors.text} />
          </Pressable>

          <Button
            onPress={() => router.push('/(wizard)/profile')}
            className="hidden sm:flex h-9 px-4 bg-primary rounded-full shadow-md shadow-primary/20 active:scale-95 transition-transform"
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-primary-foreground font-black text-xs uppercase tracking-wider">
                {t('landing.nav_start')}
              </Text>
              <ArrowRight size={13} color={colors.primaryForeground} />
            </View>
          </Button>
        </View>
      </View>

      {/* Mobile Drawer Menu Modal */}
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
                  <Sparkles size={16} color={colors.primaryForeground} />
                </View>
                <Text className="text-text font-black text-xl uppercase">Portfolium</Text>
              </View>
              <Pressable
                onPress={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-xl bg-surface border border-border items-center justify-center"
              >
                <X size={20} color={colors.text} />
              </Pressable>
            </View>

            <View className="flex-col gap-3.5 pt-6">
              <Pressable
                onPress={() => {
                  setMobileMenuOpen(false);
                  router.push('/(wizard)/profile');
                }}
                className="p-4 rounded-2xl bg-primary flex-row items-center justify-between shadow-lg shadow-primary/20"
              >
                <Text className="text-primary-foreground font-black text-base uppercase">
                  {t('landing.nav_start')}
                </Text>
                <ArrowRight size={18} color={colors.primaryForeground} />
              </Pressable>

              <Pressable
                onPress={() => {
                  setMobileMenuOpen(false);
                  scrollToSection(1000);
                }}
                className="p-4 rounded-2xl bg-surface border border-border"
              >
                <Text className="text-text font-bold text-base">{t('landing.act2_title')}</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setMobileMenuOpen(false);
                  scrollToSection(2150);
                }}
                className="p-4 rounded-2xl bg-surface border border-border"
              >
                <Text className="text-text font-bold text-base">{t('landing.act3_title')}</Text>
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
            </View>
          </View>

          <View className="pt-6 border-t border-border items-center">
            <Text className="text-text-muted text-xs font-mono">100% Local-First • Open Source MIT</Text>
          </View>
        </View>
      </Modal>

      {/* Continuous Scrollytelling Flow */}
      <Animated.ScrollView
        ref={scrollRef as any}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, width: '100%', alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        {/* =========================================================================
            ACT I: THE DILEMMA (The Broken Cycle of Developer Identity)
           ========================================================================= */}
        <Animated.View
          style={[act1AnimatedStyle, { width: '100%', alignItems: 'center', justifyContent: 'center' }]}
          className="w-full justify-center items-center px-4 sm:px-8 md:px-16 pt-16 sm:pt-24 lg:pt-36 pb-28 sm:pb-36 lg:pb-44 min-h-[90vh] relative overflow-hidden"
        >
          <View
            className="w-full max-w-5xl items-center z-10 text-center mx-auto"
            style={{ width: '100%', maxWidth: 1080, alignItems: 'center' }}
          >
            {/* Act I Telemetry Indicator */}
            <View className="px-4 py-2 rounded-full bg-surface-elevated border border-border flex-row items-center gap-2.5 mb-8 sm:mb-10 shadow-sm">
              <Activity size={14} color={colors.primary} />
              <Text className="text-text-secondary font-mono text-xs font-semibold uppercase tracking-wider">
                {t('landing.act1_badge')}
              </Text>
            </View>

            {/* Monumental Headline */}
            <Text className="text-text text-3xl sm:text-5xl md:text-7xl font-black text-center tracking-tight uppercase leading-[1.05] max-w-4xl mb-6 sm:mb-8">
              {t('landing.act1_title')}
            </Text>

            {/* Narrative Microcopy */}
            <Text className="text-text-secondary text-base sm:text-lg md:text-xl text-center mb-14 sm:mb-18 max-w-2xl font-normal leading-relaxed px-2">
              {t('landing.act1_subtitle')}
            </Text>

            {/* 3 Telemetry Diagnostic Signals (The Dilemma Breakdown) */}
            <View className="w-full max-w-4xl flex-col md:flex-row gap-6 sm:gap-8 mb-16 sm:mb-20">
              <View className="flex-1 p-6 sm:p-7 lg:p-8 rounded-3xl bg-surface/90 border border-border shadow-sm flex-col justify-between">
                <View className="flex-row items-center gap-2.5 mb-3">
                  <View className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                  <Text className="text-text font-bold text-sm uppercase tracking-wide">
                    {t('landing.act1_stat1_label')}
                  </Text>
                </View>
                <Text className="text-text-muted text-xs sm:text-sm leading-relaxed">
                  {t('landing.act1_stat1_desc')}
                </Text>
              </View>

              <View className="flex-1 p-6 sm:p-7 lg:p-8 rounded-3xl bg-surface/90 border border-border shadow-sm flex-col justify-between">
                <View className="flex-row items-center gap-2.5 mb-3">
                  <View className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                  <Text className="text-text font-bold text-sm uppercase tracking-wide">
                    {t('landing.act1_stat2_label')}
                  </Text>
                </View>
                <Text className="text-text-muted text-xs sm:text-sm leading-relaxed">
                  {t('landing.act1_stat2_desc')}
                </Text>
              </View>

              <View className="flex-1 p-6 sm:p-7 lg:p-8 rounded-3xl bg-primary/10 border border-primary/30 shadow-sm flex-col justify-between">
                <View className="flex-row items-center gap-2.5 mb-3">
                  <Zap size={15} color={colors.primary} />
                  <Text className="text-primary font-bold text-sm uppercase tracking-wide">
                    {t('landing.act1_stat3_label')}
                  </Text>
                </View>
                <Text className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                  {t('landing.act1_stat3_desc')}
                </Text>
              </View>
            </View>

            {/* Action Triggers */}
            <View className="flex-col sm:flex-row items-center gap-5 sm:gap-6">
              <Button
                onPress={() => router.push('/(wizard)/profile')}
                className="w-full sm:w-auto h-15 px-10 sm:px-12 bg-primary rounded-full shadow-2xl shadow-primary/30 active:scale-95 transition-transform"
              >
                <View className="flex-row items-center justify-center gap-2.5">
                  <Text className="text-primary-foreground font-black text-sm sm:text-base uppercase tracking-wider">
                    {t('landing.act4_cta_launch')}
                  </Text>
                  <ArrowRight size={18} color={colors.primaryForeground} />
                </View>
              </Button>

              <Animated.View style={scrollHintAnimatedStyle}>
                <Pressable
                  onPress={() => scrollToSection(1000)}
                  className="px-7 py-4 rounded-full bg-surface border border-border flex-row items-center gap-2.5 active:opacity-80"
                >
                  <Text className="text-text-secondary font-mono text-xs font-bold uppercase tracking-wider">
                    {t('landing.telemetry_scroll_hint')}
                  </Text>
                  <ChevronDown size={14} color={colors.textSecondary} />
                </Pressable>
              </Animated.View>
            </View>
          </View>
        </Animated.View>

        {/* Continuous Transition Marquee */}
        <View className="w-full my-6 sm:my-10">
          <InfiniteMarquee />
        </View>

        {/* =========================================================================
            ACT II: THE SINGULARITY (The Sovereign Local-First Core)
           ========================================================================= */}
        <Animated.View
          style={[act2AnimatedStyle, { width: '100%', alignItems: 'center', justifyContent: 'center' }]}
          className="w-full justify-center items-center px-4 sm:px-8 md:px-16 py-28 sm:py-36 lg:py-44 min-h-screen bg-surface/50 border-b border-border relative overflow-hidden"
        >
          <View
            className="w-full max-w-5xl items-center z-10 text-center mx-auto"
            style={{ width: '100%', maxWidth: 1080, alignItems: 'center' }}
          >
            {/* Act II Badge */}
            <View className="px-4 py-2 rounded-full bg-surface-elevated border border-border flex-row items-center gap-2.5 mb-8 sm:mb-10 shadow-sm">
              <ShieldCheck size={14} color={colors.primary} />
              <Text className="text-primary font-mono text-xs font-semibold uppercase tracking-wider">
                {t('landing.act2_badge')}
              </Text>
            </View>

            {/* Headline */}
            <Text className="text-text text-3xl sm:text-5xl md:text-6xl font-black text-center tracking-tight uppercase leading-tight mb-5 sm:mb-7">
              {t('landing.act2_title')}
            </Text>

            <Text className="text-text-secondary text-base sm:text-lg md:text-xl text-center max-w-2xl font-normal leading-relaxed mb-16 sm:mb-20">
              {t('landing.act2_subtitle')}
            </Text>

            {/* Reactor Core Visual Chamber */}
            <View
              className="w-full max-w-3xl mx-auto relative"
              style={{ width: '100%', maxWidth: 840 }}
            >
              {/* Radial Energy Halo */}
              <View className="absolute -inset-6 rounded-3xl bg-primary/8 blur-3xl pointer-events-none" />

              {/* Reactor HUD Telemetry Header */}
              <View className="p-5 sm:p-6 rounded-t-3xl bg-surface-elevated border-t border-x border-border flex-row items-center justify-between">
                <View className="flex-row items-center gap-2.5">
                  <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <Text className="text-text font-mono font-bold text-xs uppercase tracking-wider">
                    {t('landing.act2_reactor_label')}
                  </Text>
                </View>
                <View className="px-3.5 py-1 rounded-full bg-background border border-border">
                  <Text className="text-primary font-mono text-xs font-bold">
                    {t('landing.act2_reactor_status')}
                  </Text>
                </View>
              </View>

              {/* Organic Reactor Chamber containing the Dropzone */}
              <View className="p-8 sm:p-12 lg:p-14 bg-background border-x border-b border-border rounded-b-3xl shadow-2xl">
                <SessionDropzone
                  onSuccess={() => {
                    showToast(t('welcome.import_success'), 'success');
                    setTimeout(() => {
                      router.push('/(wizard)/profile');
                    }, 600);
                  }}
                />

                {/* First-Timer Onboarding Bridge */}
                <View className="mt-8 pt-7 border-t border-border/60 w-full flex-col sm:flex-row items-center justify-center gap-3.5">
                  <Text className="text-text-muted text-xs sm:text-sm font-mono text-center">
                    {t('landing.act2_first_time_prompt')}
                  </Text>
                  <Pressable
                    onPress={() => router.push('/(wizard)/profile')}
                    className="flex-row items-center gap-2 py-2 px-5 rounded-full bg-primary/10 border border-primary/25 hover:bg-primary/20 active:scale-95 transition-all"
                    accessibilityRole="button"
                    accessibilityLabel={t('landing.act2_first_time_action')}
                  >
                    <Sparkles size={13} color={colors.primary} />
                    <Text className="text-primary font-bold text-xs font-mono uppercase tracking-wider">
                      {t('landing.act2_first_time_action')}
                    </Text>
                    <ArrowRight size={13} color={colors.primary} />
                  </Pressable>
                </View>

                {/* Reactor Telemetry Sub-Guarantees */}
                <View className="mt-10 pt-8 border-t border-border flex-col sm:flex-row items-center justify-between gap-5">
                  <View className="flex-row items-center gap-2.5">
                    <CheckCircle2 size={16} color={colors.primary} />
                    <Text className="text-text font-mono text-xs">
                      100% Client-Side Ingestion
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2.5">
                    <Cpu size={16} color={colors.primary} />
                    <Text className="text-text font-mono text-xs">
                      Zero External Server Calls
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2.5">
                    <Layers size={16} color={colors.primary} />
                    <Text className="text-text font-mono text-xs">
                      AsyncStorage Protected
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* =========================================================================
            ACT III: THE METAMORPHOSIS (The Trinity Unfolds)
           ========================================================================= */}
        <Animated.View
          style={[act3AnimatedStyle, { width: '100%', alignItems: 'center', justifyContent: 'center' }]}
          className="w-full justify-center items-center px-4 sm:px-8 md:px-16 py-28 sm:py-36 lg:py-44 min-h-screen bg-background border-b border-border relative overflow-hidden"
        >
          <View
            className="w-full max-w-6xl z-10 mx-auto"
            style={{ width: '100%', maxWidth: 1200, alignItems: 'center' }}
          >
            {/* Act III Badge */}
            <View className="items-center mb-8">
              <View className="px-4 py-2 rounded-full bg-surface-elevated border border-border flex-row items-center gap-2.5 shadow-sm">
                <Layers size={14} color={colors.primary} />
                <Text className="text-primary font-mono text-xs font-semibold uppercase tracking-wider">
                  {t('landing.act3_badge')}
                </Text>
              </View>
            </View>

            {/* Headline */}
            <Text className="text-text text-3xl sm:text-5xl md:text-6xl font-black text-center uppercase tracking-tight mb-5 sm:mb-7">
              {t('landing.act3_title')}
            </Text>

            <Text className="text-text-secondary text-base sm:text-lg md:text-xl text-center max-w-3xl mx-auto leading-relaxed mb-18 sm:mb-24">
              {t('landing.act3_subtitle')}
            </Text>

            {/* The 3 Metamorphosis Conduits */}
            <View className="w-full flex-col md:flex-row gap-8 lg:gap-10" style={{ width: '100%' }}>
              {/* Conduit 01: Zero-Bundle Web Portfolio */}
              <View className="flex-1 bg-surface border border-border rounded-3xl p-8 lg:p-10 shadow-xl flex-col justify-between hover:border-primary/40 transition-colors">
                <View>
                  <View className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 items-center justify-center mb-6 shadow-sm">
                    <Globe size={26} color={colors.primary} />
                  </View>
                  <Text className="text-text text-xl sm:text-2xl font-black mb-3.5">
                    {t('landing.act3_artifact1_title')}
                  </Text>
                  <Text className="text-text-secondary text-sm sm:text-base leading-relaxed mb-8">
                    {t('landing.act3_artifact1_desc')}
                  </Text>
                </View>

                {/* Viewport Frame */}
                <View className="p-5 lg:p-6 rounded-2xl bg-background border border-border mb-8">
                  <View className="flex-row items-center justify-between mb-3.5 pb-2.5 border-b border-border">
                    <View className="flex-row items-center gap-1.5">
                      <View className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                      <View className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                      <View className="w-2.5 h-2.5 rounded-full bg-border-strong" />
                    </View>
                    <View className="px-2.5 py-0.5 rounded-full bg-surface border border-border">
                      <Text className="text-text-muted text-xs font-mono opacity-80">portfolio.dev</Text>
                    </View>
                    <Text className="text-primary font-mono text-xs font-bold">100/100</Text>
                  </View>
                  <Text className="text-text font-mono font-bold text-xs mb-1.5">
                    index.html • style.css
                  </Text>
                  <Text className="text-text-muted text-xs font-mono">
                    Zero external JavaScript dependencies
                  </Text>
                </View>

                <View className="flex-row items-center gap-2.5 pt-4 border-t border-border">
                  <CheckCircle2 size={15} color={colors.primary} />
                  <Text className="text-primary font-mono text-xs font-bold uppercase">
                    GitHub Pages & Vercel Native
                  </Text>
                </View>
              </View>

              {/* Conduit 02: Dynamic GitHub Profile README */}
              <View className="flex-1 bg-surface border border-border rounded-3xl p-8 lg:p-10 shadow-xl flex-col justify-between hover:border-primary/40 transition-colors">
                <View>
                  <View className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 items-center justify-center mb-6 shadow-sm">
                    <FileCode2 size={26} color={colors.primary} />
                  </View>
                  <Text className="text-text text-xl sm:text-2xl font-black mb-3.5">
                    {t('landing.act3_artifact2_title')}
                  </Text>
                  <Text className="text-text-secondary text-sm sm:text-base leading-relaxed mb-8">
                    {t('landing.act3_artifact2_desc')}
                  </Text>
                </View>

                {/* Markdown Terminal Preview */}
                <View className="p-5 lg:p-6 rounded-2xl bg-background border border-border mb-8 font-mono">
                  <View className="flex-row items-center justify-between mb-2.5">
                    <Text className="text-text-muted text-xs font-mono opacity-80">README.md</Text>
                    <Text className="text-primary text-xs font-mono font-bold">Markdown</Text>
                  </View>
                  <Text className="text-primary text-xs font-mono mb-1.5">
                    # Software Engineer & Builder
                  </Text>
                  <Text className="text-text-muted text-xs font-mono mb-2.5">
                    [React 19 • TypeScript • Node • Rust]
                  </Text>
                  <Text className="text-text text-xs font-mono">
                    ✔ Auto-detected from package.json & Cargo.toml
                  </Text>
                </View>

                <View className="flex-row items-center gap-2.5 pt-4 border-t border-border">
                  <CheckCircle2 size={15} color={colors.primary} />
                  <Text className="text-primary font-mono text-xs font-bold uppercase">
                    Repository Manifest Parser
                  </Text>
                </View>
              </View>

              {/* Conduit 03: ATS-Bypassing Technical Resume */}
              <View className="flex-1 bg-surface border border-border rounded-3xl p-8 lg:p-10 shadow-xl flex-col justify-between hover:border-primary/40 transition-colors">
                <View>
                  <View className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 items-center justify-center mb-6 shadow-sm">
                    <FileText size={26} color={colors.primary} />
                  </View>
                  <Text className="text-text text-xl sm:text-2xl font-black mb-3.5">
                    {t('landing.act3_artifact3_title')}
                  </Text>
                  <Text className="text-text-secondary text-sm sm:text-base leading-relaxed mb-8">
                    {t('landing.act3_artifact3_desc')}
                  </Text>
                </View>

                {/* ATS Parser Gauge */}
                <View className="p-5 lg:p-6 rounded-2xl bg-background border border-border mb-8">
                  <View className="flex-row items-center justify-between mb-2.5">
                    <Text className="text-text font-bold text-xs">ATS Parser Benchmark</Text>
                    <Text className="text-primary font-bold font-mono text-xs">99 / 100</Text>
                  </View>
                  <View className="w-full h-2 rounded-full bg-surface-elevated overflow-hidden mb-2.5 border border-border">
                    <View className="w-[99%] h-full bg-primary rounded-full" />
                  </View>
                  <Text className="text-text-muted text-xs font-mono">
                    Validated for Greenhouse, Workday & Lever
                  </Text>
                </View>

                <View className="flex-row items-center gap-2.5 pt-4 border-t border-border">
                  <CheckCircle2 size={15} color={colors.primary} />
                  <Text className="text-primary font-mono text-xs font-bold uppercase">
                    Machine Readable Semantic Schema
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* =========================================================================
            COMMUNITY PROOF & REAL VALIDATION
           ========================================================================= */}
        <View
          className="w-full px-4 sm:px-8 md:px-16 py-24 sm:py-32 lg:py-40 bg-surface border-b border-border items-center"
          style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}
        >
          <View
            className="w-full max-w-6xl items-center mx-auto"
            style={{ width: '100%', maxWidth: 1200, alignItems: 'center' }}
          >
            <View className="text-center items-center mb-16 sm:mb-20">
              <Text className="text-text text-2xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-4">
                {t('landing.testimonials_title')}
              </Text>
              <Text className="text-text-secondary text-base sm:text-lg md:text-xl text-center max-w-2xl leading-relaxed">
                {t('landing.testimonials_subtitle')}
              </Text>
            </View>

            <DeveloperReviews />
          </View>
        </View>

        {/* =========================================================================
            ACT IV: THE IGNITION (Launchpad CTA)
           ========================================================================= */}
        <Animated.View
          style={[act4AnimatedStyle, { width: '100%', alignItems: 'center', justifyContent: 'center' }]}
          className="w-full px-4 sm:px-8 md:px-16 py-28 sm:py-36 lg:py-44 min-h-[85vh] bg-background items-center relative overflow-hidden"
        >
          <View
            className="w-full max-w-4xl bg-surface-elevated border border-border rounded-3xl p-10 sm:p-16 md:p-20 lg:p-24 items-center text-center shadow-2xl relative overflow-hidden mx-auto"
            style={{ width: '100%', maxWidth: 960, alignItems: 'center' }}
          >
            {/* Ambient Aurora Radiation Halo */}
            <View className="absolute -top-16 -right-16 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
            <View className="absolute -bottom-16 -left-16 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

            <View className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-primary/10 border border-primary/20 items-center justify-center mb-8 shadow-sm">
              <Zap size={36} color={colors.primary} />
            </View>

            <View className="px-4 py-2 rounded-full bg-surface border border-border flex-row items-center gap-2 mb-6">
              <Sparkles size={13} color={colors.primary} />
              <Text className="text-primary font-mono text-xs font-semibold uppercase tracking-wider">
                {t('landing.act4_badge')}
              </Text>
            </View>

            <Text className="text-text text-3xl sm:text-5xl md:text-6xl font-black mb-5 text-center uppercase tracking-tight max-w-2xl">
              {t('landing.act4_title')}
            </Text>

            <Text className="text-text-secondary text-base sm:text-lg md:text-xl mb-12 sm:mb-16 max-w-lg text-center leading-relaxed">
              {t('landing.act4_subtitle')}
            </Text>

            {/* Launch Actions */}
            <View className="flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
              <Button
                onPress={() => router.push('/(wizard)/profile')}
                className="w-full sm:w-auto h-16 px-12 sm:px-14 bg-primary rounded-full shadow-2xl shadow-primary/30 active:scale-95 transition-transform"
              >
                <View className="flex-row items-center justify-center gap-3">
                  <Text className="text-primary-foreground font-black text-base sm:text-lg uppercase tracking-wider">
                    {t('landing.act4_cta_launch')}
                  </Text>
                  <ArrowRight size={22} color={colors.primaryForeground} />
                </View>
              </Button>

              <Pressable
                onPress={() => scrollToSection(1000)}
                className="w-full sm:w-auto px-8 py-5 rounded-full bg-surface border border-border flex-row items-center justify-center gap-2.5 active:opacity-80"
              >
                <Layers size={16} color={colors.text} />
                <Text className="text-text font-bold text-sm sm:text-base">
                  {t('landing.act4_cta_restore')}
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>

        {/* =========================================================================
            SEMANTIC FOOTER
           ========================================================================= */}
        <View className="w-full bg-surface border-t border-border px-4 sm:px-8 md:px-16 py-16 sm:py-20">
          <View className="max-w-6xl mx-auto flex-col md:flex-row justify-between gap-12 mb-12">
            {/* Brand Column */}
            <View className="max-w-sm">
              <View className="flex-row items-center gap-2.5 mb-4">
                <View className="w-7 h-7 rounded-xl bg-primary items-center justify-center">
                  <Sparkles size={14} color={colors.primaryForeground} />
                </View>
                <Text className="text-text font-black text-lg uppercase">Portfolium</Text>
              </View>
              <Text className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-5">
                {t('landing.hero_description')}
              </Text>
              <View className="flex-row items-center gap-2 text-text-muted text-xs">
                <Heart size={13} color={colors.primary} />
                <Text className="text-text-muted text-xs">{t('landing.footer_source_code')}</Text>
              </View>
            </View>

            {/* Links Columns */}
            <View className="flex-row flex-wrap gap-10 sm:gap-16 md:gap-24">
              {/* Narrative Chapters */}
              <View>
                <Text className="text-text font-bold text-xs uppercase tracking-wider mb-4">
                  Narrativa
                </Text>
                <View className="flex-col gap-2.5">
                  <Pressable onPress={() => scrollToSection(0)}>
                    <Text className="text-text-secondary hover:text-text text-xs sm:text-sm font-medium">
                      {t('landing.telemetry_nav_act1')}
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => scrollToSection(1000)}>
                    <Text className="text-text-secondary hover:text-text text-xs sm:text-sm font-medium">
                      {t('landing.telemetry_nav_act2')}
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => scrollToSection(2150)}>
                    <Text className="text-text-secondary hover:text-text text-xs sm:text-sm font-medium">
                      {t('landing.telemetry_nav_act3')}
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => scrollToSection(3600)}>
                    <Text className="text-text-secondary hover:text-text text-xs sm:text-sm font-medium">
                      {t('landing.telemetry_nav_act4')}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Legal */}
              <View>
                <Text className="text-text font-bold text-xs uppercase tracking-wider mb-4">
                  {t('landing.footer_legal')}
                </Text>
                <View className="flex-col gap-2.5">
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

              {/* Community */}
              <View>
                <Text className="text-text font-bold text-xs uppercase tracking-wider mb-4">
                  {t('landing.footer_community')}
                </Text>
                <View className="flex-col gap-2.5">
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
          <View className="max-w-6xl mx-auto border-t border-border pt-6 flex-col sm:flex-row items-center justify-between gap-4">
            <Text className="text-text-muted text-xs">
              © {new Date().getFullYear()} Portfolium. {t('landing.footer_rights')}
            </Text>
            <Text className="text-text-muted text-xs font-mono">MIT Licensed • Universal First</Text>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
