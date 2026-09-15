import { AmbientBackground } from '@/components/ui/ambient-background';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type ThemeId = 'light' | 'lava' | 'dark' | 'amoled' | 'terminal' | 'ocean';

export interface ThemeColorTokens {
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderStrong: string;
  primary: string;
  primaryForeground: string;
  inputBackground: string;
  overlay: string;
}

export const THEME_TOKENS: Record<ThemeId, ThemeColorTokens> = {
  dark: {
    background: '#202124',
    surface: '#292A2D',
    surfaceElevated: '#303134',
    text: '#F1F3F4',
    textSecondary: '#BDC1C6',
    textMuted: '#9AA0A6',
    border: '#3C4043',
    borderStrong: '#5F6368',
    primary: '#F1F3F4',
    primaryForeground: '#202124',
    inputBackground: '#303134',
    overlay: 'rgba(0, 0, 0, 0.60)',
  },
  light: {
    background: '#F7F7F5',
    surface: '#FFFFFF',
    surfaceElevated: '#FAFAF8',
    text: '#111111',
    textSecondary: '#686868',
    textMuted: '#8A8A8A',
    border: '#E2E2DF',
    borderStrong: '#CBCBC7',
    primary: '#111111',
    primaryForeground: '#FFFFFF',
    inputBackground: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.40)',
  },
  lava: {
    background: '#160D05',
    surface: '#211308',
    surfaceElevated: '#2D1B0B',
    text: '#FFF7E8',
    textSecondary: '#E8C99A',
    textMuted: '#AD8A5F',
    border: '#4A2D12',
    borderStrong: '#724719',
    primary: '#FFB020',
    primaryForeground: '#1A0D00',
    inputBackground: '#1D1107',
    overlay: 'rgba(12, 6, 0, 0.72)',
  },
  terminal: {
    background: '#071009',
    surface: '#0A170D',
    surfaceElevated: '#102116',
    text: '#9CFF9C',
    textSecondary: '#70CC76',
    textMuted: '#4D9254',
    border: '#285D31',
    borderStrong: '#3D8648',
    primary: '#6CFF75',
    primaryForeground: '#061008',
    inputBackground: '#08130B',
    overlay: 'rgba(0, 8, 2, 0.78)',
  },
  ocean: {
    background: '#111315',
    surface: '#181A1D',
    surfaceElevated: '#202328',
    text: '#F1F3F5',
    textSecondary: '#B5BAC1',
    textMuted: '#7E858E',
    border: '#2A2E34',
    borderStrong: '#3B424B',
    primary: '#3478D4',
    primaryForeground: '#FFFFFF',
    inputBackground: '#191C20',
    overlay: 'rgba(0, 0, 0, 0.68)',
  },
  amoled: {
    background: '#000000',
    surface: '#0A0A0A',
    surfaceElevated: '#141414',
    text: '#F5F5F5',
    textSecondary: '#B8B8B8',
    textMuted: '#858585',
    border: '#242424',
    borderStrong: '#3A3A3A',
    primary: '#FFFFFF',
    primaryForeground: '#000000',
    inputBackground: '#0A0A0A',
    overlay: 'rgba(0, 0, 0, 0.80)',
  },
};

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (id: ThemeId, x?: number, y?: number) => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => { },
  isTransitioning: false,
});

export const useTheme = () => useContext(ThemeContext);

export const useThemeColors = (): ThemeColorTokens => {
  const { theme } = useTheme();
  return THEME_TOKENS[theme] || THEME_TOKENS.dark;
};

const THEME_STORAGE_KEY = 'portfolio-builder:theme:v1';

export const getThemeBackground = (id: ThemeId) => {
  switch (id) {
    case 'light': return '#F7F7F5';
    case 'lava': return '#211515';
    case 'amoled': return '#000000';
    case 'dark':
    default: return '#222222';
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeId>('dark');
  const [nextTheme, setNextTheme] = useState<ThemeId | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Transition state for fallback / mobile
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const radius = useSharedValue(0);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ['light', 'lava', 'dark', 'amoled'].includes(savedTheme)) {
          setThemeState(savedTheme as ThemeId);
        }
      } catch {
        // Fallback to dark
      } finally {
        setIsReady(true);
      }
    };
    loadTheme();
  }, []);

  const setTheme = (id: ThemeId, x = 0, y = 0) => {
    if (isTransitioning || id === theme) return;

    // Direct change if no coordinates provided
    if (x === 0 && y === 0) {
      setThemeState(id);
      AsyncStorage.setItem(THEME_STORAGE_KEY, id).catch(() => { });
      return;
    }

    // Modern Web: Native GPU View Transition API with radial circle clipPath
    if (
      Platform.OS === 'web' &&
      typeof document !== 'undefined' &&
      typeof (document as any).startViewTransition === 'function'
    ) {
      try {
        const right = window.innerWidth - x;
        const bottom = window.innerHeight - y;
        const maxRadius = Math.hypot(Math.max(x, right), Math.max(y, bottom));


        // Set background to current theme to prevent white flash during snapshot
        document.documentElement.style.backgroundColor = getThemeBackground(theme);


        setIsTransitioning(true);
        const transition = (document as any).startViewTransition(() => {
          // Set background to new theme for the new state
          document.documentElement.style.backgroundColor = getThemeBackground(id);

          setThemeState(id);
          AsyncStorage.setItem(THEME_STORAGE_KEY, id).catch(() => { });
        });

        transition.ready
          .then(() => {
            document.documentElement.animate(
              {
                clipPath: [
                  `circle(0px at ${x}px ${y}px)`,
                  `circle(${maxRadius}px at ${x}px ${y}px)`,
                ],


              },
              {
                duration: 900,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                pseudoElement: '::view-transition-new(root)',
              }
            );
          })
          .catch(() => {
            setThemeState(id);
            AsyncStorage.setItem(THEME_STORAGE_KEY, id).catch(() => { });
          })
          .finally(() => {
            setIsTransitioning(false);
          });
        return;
      } catch {
        // Fallback to reanimated overlay if browser errors
      }
    }

    // Universal Fallback (Mobile Native & legacy Web)
    setIsTransitioning(true);
    setNextTheme(id);
    setOrigin({ x, y });

    const { width, height } = Dimensions.get('window');
    const corners = [
      { cx: 0, cy: 0 },
      { cx: width, cy: 0 },
      { cx: 0, cy: height },
      { cx: width, cy: height },
    ];
    let maxDist = 0;
    for (const corner of corners) {
      const dist = Math.sqrt(Math.pow(corner.cx - x, 2) + Math.pow(corner.cy - y, 2));
      if (dist > maxDist) maxDist = dist;
    }

    radius.value = 0;
    radius.value = withTiming(
      maxDist,
      { duration: 550, easing: Easing.bezier(0.22, 1, 0.36, 1) },
      (finished) => {
        if (finished) {
          runOnJS(completeTransition)(id);
        }
      }
    );
  };

  const completeTransition = (id: ThemeId) => {
    setThemeState(id);
    AsyncStorage.setItem(THEME_STORAGE_KEY, id).catch(() => { });

    setTimeout(() => {
      radius.value = 0;
      setNextTheme(null);
      setIsTransitioning(false);
    }, 40);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: radius.value * 2,
      height: radius.value * 2,
      borderRadius: radius.value,
      transform: [
        { translateX: -radius.value },
        { translateY: -radius.value },
      ],
    };
  });

  if (!isReady) return null;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isTransitioning }}>
      <View className={`flex-1 theme-${theme}`}>
        <AmbientBackground theme={theme} />

        <View className="flex-1 z-10" style={{ elevation: 1, zIndex: 10 }}>
          {children}
        </View>

        {/* Top-layer GPU overlay for circular reveal animation on native/fallback */}
        {nextTheme && (
          <View
            style={[
              StyleSheet.absoluteFill,
              { zIndex: 99999, elevation: 99999, pointerEvents: 'none' },
            ]}
          >
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  left: origin.x,
                  top: origin.y,
                  backgroundColor: getThemeBackground(nextTheme),
                  opacity: 0.96,
                },
                animatedStyle,
              ]}
            />
          </View>
        )}
      </View>
    </ThemeContext.Provider>
  );
};
