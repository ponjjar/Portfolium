import React, { useEffect } from 'react';
import { View, Text, Modal as RNModal, TouchableOpacity, ScrollView, Platform, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { X } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeContext';

export interface ModalProps {
  visible: boolean;
  onClose?: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
  hideCloseButton?: boolean;
}

export function Modal({ 
  visible, 
  onClose, 
  title, 
  size = 'md', 
  children, 
  footer,
  hideCloseButton = false 
}: ModalProps) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  
  const getMaxWidthValue = () => {
    switch (size) {
      case 'sm': return 512;
      case 'md': return 672;
      case 'lg': return 896;
      case 'xl': return 1024;
      default: return 672;
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none" // We use Reanimated instead
      onRequestClose={onClose}
    >
      {/* Overlay background */}
      <Animated.View 
        entering={FadeIn.duration(250)}
        exiting={FadeOut.duration(200)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: Platform.OS === 'web' ? '100vh' as any : '100%',
          width: Platform.OS === 'web' ? '100vw' as any : '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: isSmallScreen ? 0 : 16,
          backgroundColor: isSmallScreen 
            ? (theme === 'light' ? '#ffffff' : '#121212') // Solid background on small screens
            : (theme === 'light' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.7)'),
          ...(Platform.OS === 'web' && !isSmallScreen ? { backdropFilter: 'blur(8px)' } : {}) as any,
          zIndex: 9999, // Ensure it sits on top
        }}
      >
        {/* Modal Container */}
        <Animated.View 
          entering={SlideInDown.duration(300).springify().damping(18).stiffness(150)}
          exiting={SlideOutDown.duration(200)}
          style={{
            width: '100%',
            maxWidth: isSmallScreen ? '100%' : getMaxWidthValue(),
            height: isSmallScreen ? '100%' : '85%',
          }}
        >
          <View 
            className={`w-full h-full bg-surface border-border overflow-hidden flex-col theme-${theme}`}
            style={{ 
              borderWidth: isSmallScreen ? 0 : 1, 
              borderRadius: isSmallScreen ? 0 : 12 
            }}
          >
            {/* Header */}
            {(title || (!hideCloseButton && onClose)) && (
              <View className="flex-row items-center justify-between p-4 border-b border-border bg-surface-elevated">
                <Text className="text-text font-bold text-lg">{title}</Text>
                {!hideCloseButton && onClose && (
                  <TouchableOpacity onPress={onClose} className="p-2">
                    <X color="var(--text)" size={20} />
                  </TouchableOpacity>
                )}
              </View>
            )}
            
            {/* Body */}
            <ScrollView 
              style={{ flex: 1, width: '100%' }} 
              contentContainerStyle={{ padding: 16 }}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>
            
            {/* Footer */}
            {footer && (
              <View className="p-4 border-t border-border bg-surface-elevated flex-row justify-end items-center gap-3">
                {footer}
              </View>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </RNModal>
  );
}
