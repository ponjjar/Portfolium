import React, { useEffect } from 'react';
import { View, Text, Modal as RNModal, TouchableOpacity, ScrollView, Platform } from 'react-native';
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
  
  const getWidthClass = () => {
    switch (size) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-2xl';
      case 'xl': return 'max-w-4xl';
      default: return 'max-w-md';
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
        className={`flex-1 bg-[#000000cc] justify-center items-center p-4 theme-${theme}`}
      >
        {/* Modal Container */}
        <Animated.View 
          entering={SlideInDown.duration(300).springify().damping(18).stiffness(150)}
          exiting={SlideOutDown.duration(200)}
          className={`w-full ${getWidthClass()} bg-surface border border-border rounded-xl shadow-lg overflow-hidden max-h-[90%]`}
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
            className="w-full" 
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
          
        </Animated.View>
      </Animated.View>
    </RNModal>
  );
}
