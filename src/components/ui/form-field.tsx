import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export interface FormFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'text' | 'textarea' | 'url';
  leadingIcon?: React.ReactNode;
  maxLength?: number;
  showCounter?: boolean;
}

export const FormField = React.forwardRef<TextInput, FormFieldProps>(
  ({ label, error, helperText, variant = 'text', leadingIcon, maxLength, showCounter, className, value, onFocus, onBlur, ...props }, ref) => {
    const isFocused = useSharedValue(0);
    const [localFocus, setLocalFocus] = useState(false);

    const handleFocus = (e: any) => {
      isFocused.value = withTiming(1, { duration: 150 });
      setLocalFocus(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      isFocused.value = withTiming(0, { duration: 150 });
      setLocalFocus(false);
      onBlur?.(e);
    };

    const animatedStyle = useAnimatedStyle(() => {
      return {
        borderColor: isFocused.value === 1 ? 'var(--text)' : 'var(--border)',
        backgroundColor: isFocused.value === 1 ? 'var(--surface)' : 'var(--input-background)',
      };
    });

    const isTextarea = variant === 'textarea';
    const heightClass = isTextarea ? 'h-32' : 'h-12';
    const hasIcon = !!leadingIcon;

    return (
      <View className="flex flex-col mb-5">
        {label && (
          <Text className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-2">
            {label}
          </Text>
        )}
        
        <Animated.View 
          className={`flex-row border rounded items-center ${heightClass} ${
            error ? 'border-red-500' : ''
          }`}
          style={error ? undefined : animatedStyle}
        >
          {hasIcon && (
            <View className="pl-4 pr-2 opacity-50">
              {leadingIcon}
            </View>
          )}

          <TextInput
            ref={ref}
            className={`flex-1 text-text h-full ${hasIcon ? 'pr-4' : 'px-4'} ${
              isTextarea ? 'pt-3 pb-3' : ''
            } ${className || ''}`}
            placeholderTextColor="var(--placeholder, #888888)"
            multiline={isTextarea}
            numberOfLines={isTextarea ? 4 : 1}
            textAlignVertical={isTextarea ? 'top' : 'center'}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxLength={maxLength}
            style={Platform.OS === 'web' && isTextarea ? { outlineStyle: 'none', resize: 'none' } as any : { outlineStyle: 'none' } as any}
            {...props}
          />
        </Animated.View>

        {(error || helperText || (showCounter && maxLength)) && (
          <View className="flex-row justify-between items-start mt-2">
            <View className="flex-1">
              {error ? (
                <Text className="text-red-500 text-xs">{error}</Text>
              ) : helperText ? (
                <Text className="text-text-secondary text-xs">{helperText}</Text>
              ) : null}
            </View>
            
            {showCounter && maxLength && (
              <Text className="text-text-secondary text-[10px] ml-4 font-mono">
                {(value as string)?.length || 0} / {maxLength}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  }
);
FormField.displayName = 'FormField';
