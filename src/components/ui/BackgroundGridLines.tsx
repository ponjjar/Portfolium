import React from 'react';
import { View, StyleSheet } from 'react-native';

export function BackgroundGridLines() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" className="overflow-hidden">
      {/* Top perspective gradient grid */}
      <View
        className="w-full h-[600px] absolute -top-10 left-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--text) 1px, transparent 1px),
            linear-gradient(to bottom, var(--text) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)',
        } as any}
      />

      {/* Primary Radial Glow */}
      <View
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[500px] rounded-full bg-primary/15 blur-[160px]"
        pointerEvents="none"
      />

      {/* Secondary Accent Glow */}
      <View
        className="absolute top-96 left-1/4 w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[140px]"
        pointerEvents="none"
      />
    </View>
  );
}
