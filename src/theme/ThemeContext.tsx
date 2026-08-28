import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { AmbientBackground } from '@/components/ui/ambient-background';

export type ThemeId = 'light' | 'lava' | 'dark' | 'amoled';

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (id: ThemeId, x?: number, y?: number) => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  isTransitioning: false,
});

export const useTheme = () => useContext(ThemeContext);

const THEME_STORAGE_KEY = 'portfolio-builder:theme:v1';

const getThemeBackground = (id: ThemeId) => {
  switch (id) {
    case 'light': return '#F7F7F5';
    case 'lava': return '#090303';
    case 'amoled': return '#000000';
    case 'dark':
    default: return '#101010';
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeId>('dark');
  const [nextTheme, setNextTheme] = useState<ThemeId | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Transition state
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const radius = useSharedValue(0);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ['light', 'lava', 'dark', 'amoled'].includes(savedTheme)) {
          setThemeState(savedTheme as ThemeId);
        }
      } catch (e) {
        // Fallback to dark
      } finally {
        setIsReady(true);
      }
    };
    loadTheme();
  }, []);

  const setTheme = (id: ThemeId, x = 0, y = 0) => {
    if (isTransitioning || id === theme) return;
    
    // Check for reduced motion in a real app, here we assume full animation or we could check Platform
    // Actually Expo/Reanimated doesn't have a simple synchronous prefers-reduced-motion hook yet without an async listener, 
    // but we can skip animation if x and y are 0 (no coordinates provided)
    if (x === 0 && y === 0) {
      setThemeState(id);
      AsyncStorage.setItem(THEME_STORAGE_KEY, id).catch(() => {});
      return;
    }

    setIsTransitioning(true);
    setNextTheme(id);
    setOrigin({ x, y });
    
    const { width, height } = Dimensions.get('window');
    // Calculate maximum distance to the 4 corners from (x,y)
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

    // Start with scale 0
    radius.value = 0;
    
    // Animate to cover the screen
    radius.value = withTiming(
      maxDist, 
      { duration: 600, easing: Easing.inOut(Easing.ease) }, 
      (finished) => {
        if (finished) {
          runOnJS(completeTransition)(id);
        }
      }
    );
  };

  const completeTransition = (id: ThemeId) => {
    setThemeState(id);
    AsyncStorage.setItem(THEME_STORAGE_KEY, id).catch(() => {});
    
    // Allow React to commit the new theme tokens
    setTimeout(() => {
      radius.value = 0; // reset overlay instantly because the background underneath is now the same color
      setNextTheme(null);
      setIsTransitioning(false);
    }, 50);
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
        
        {nextTheme && (
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  left: origin.x,
                  top: origin.y,
                  backgroundColor: getThemeBackground(nextTheme),
                },
                animatedStyle,
              ]}
            />
          </View>
        )}
        
        <View className="flex-1 z-10" style={{ elevation: 1, zIndex: 10 }}>
          {children}
        </View>
      </View>
    </ThemeContext.Provider>
  );
};
