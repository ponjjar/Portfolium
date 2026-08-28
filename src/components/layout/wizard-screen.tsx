import React from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler, interpolate, Extrapolation, useAnimatedStyle } from 'react-native-reanimated';
import { WizardHeader } from './wizard-header';
import { WizardContent } from './wizard-content';

interface WizardScreenProps {
  step: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  bottomNav: React.ReactNode;
}

export function WizardScreen({ step, totalSteps = 5, title, subtitle, children, bottomNav }: WizardScreenProps) {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View className="flex-1 bg-background">
      <WizardHeader 
        step={step} 
        totalSteps={totalSteps} 
        title={title} 
        subtitle={subtitle} 
        scrollY={scrollY}
      />
      
      <Animated.ScrollView 
        className="flex-1 w-full"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: 16 }}
      >
        <WizardContent>
          {children}
        </WizardContent>
      </Animated.ScrollView>

      {bottomNav}
    </View>
  );
}
