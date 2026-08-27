import React from 'react';
import { View, StyleSheet } from 'react-native';

const stars = Array.from({ length: 40 }).map((_, i) => ({
  id: i,
  size: Math.random() * 2 + 1,
  opacity: Math.random() * 0.5 + 0.1,
  top: `${Math.random() * 100}%` as any,
  left: `${Math.random() * 100}%` as any,
}));

export default function HeroAscii() {
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000000', overflow: 'hidden', opacity: 0.8 }]} pointerEvents="none">
      {/* Fallback pattern for Native Mobile App to emulate the stars/universe without heavy Web DOM */}
      {stars.map((star) => (
        <View
          key={star.id}
          style={{
            position: 'absolute',
            width: star.size,
            height: star.size,
            backgroundColor: '#FFFFFF',
            borderRadius: star.size,
            top: star.top,
            left: star.left,
            opacity: star.opacity,
          }}
        />
      ))}
    </View>
  );
}
