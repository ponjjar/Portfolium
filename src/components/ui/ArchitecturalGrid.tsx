import React from 'react';
import { View, StyleSheet } from 'react-native';

export function ArchitecturalGrid() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" className="overflow-hidden">
      {/* 6 Elegant vertical architectural lines spanning full height */}
      <View className="w-full h-full max-w-7xl mx-auto flex-row justify-between px-4 md:px-8 opacity-[0.08]">
        <View className="w-[1px] h-full bg-text" />
        <View className="w-[1px] h-full bg-text hidden sm:flex" />
        <View className="w-[1px] h-full bg-text hidden md:flex" />
        <View className="w-[1px] h-full bg-text" />
        <View className="w-[1px] h-full bg-text hidden sm:flex" />
        <View className="w-[1px] h-full bg-text" />
      </View>

      {/* Subtle Warm Atmospheric Glows */}
      <View
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] md:w-[1100px] h-[550px] rounded-full bg-primary/10 blur-[180px]"
        pointerEvents="none"
      />
      <View
        className="absolute top-[1200px] right-10 w-[450px] h-[450px] rounded-full bg-cyan-500/8 blur-[160px]"
        pointerEvents="none"
      />
    </View>
  );
}
