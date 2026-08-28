import React, { useState } from 'react';
import { Platform, Pressable, Text, TextInput, TextInputProps, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

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
  ({ label, error, helperText, variant = 'text', leadingIcon, maxLength, showCounter, className, value, onFocus, onBlur, placeholder, ...props }, ref) => {
    const isFocused = useSharedValue(0);
    const [localFocus, setLocalFocus] = useState(false);

    const innerRef = React.useRef<TextInput>(null);
    React.useImperativeHandle(ref, () => innerRef.current as TextInput);

    const handleFocus = (e: any) => {
      isFocused.value = withTiming(1, { duration: 100, easing: Easing.out(Easing.cubic) });
      setLocalFocus(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      isFocused.value = withTiming(0, { duration: 50, easing: Easing.out(Easing.cubic) });
      setLocalFocus(false);
      onBlur?.(e);
    };

    const isTextarea = variant === 'textarea';
    // Single line: 58px. Textarea: 120px.
    const height = isTextarea ? 120 : 58;
    const hasIcon = !!leadingIcon;
    const hasValue = value !== undefined && value !== null && value.toString().length > 0;
    const isActive = localFocus || hasValue;

    // Label Animation
    const animatedLabelStyle = useAnimatedStyle(() => {
      const active = isFocused.value === 1 || hasValue;

      // Resting top is 18px (centered vertically in 58px field).
      // Active top moves up by -10px to sit at 8px from the top.
      const translateY = withTiming(active ? -10 : 0, { duration: 200, easing: Easing.out(Easing.cubic) });
      // Font size scale down from 16px to 12px (0.75)
      const scale = withTiming(active ? 0.75 : 1, { duration: 200, easing: Easing.out(Easing.cubic) });

      return {
        transformOrigin: '0% 0%', // Left Top anchor so it shrinks upwards and leftwards naturally
        transform: [{ translateY }, { scale }],
      };
    }, [hasValue]);

    // Border Animation (Smooth Fade for Focused Border)
    const animatedFocusBorderOpacity = useAnimatedStyle(() => {
      return {
        opacity: isFocused.value * 0.4
      };
    });

    // Placeholder Animation
    const animatedPlaceholderOpacity = useAnimatedStyle(() => {
      const opacity = (isFocused.value === 1 && !hasValue)
        ? withDelay(120, withTiming(1, { duration: 50 }))
        : withTiming(0, { duration: 100 });
      return { opacity };
    }, [hasValue]);

    return (
      <View className={`flex flex-col w-full mb-5 ${className || ''}`}>

        {/* Field Container */}
        <Pressable
          className="w-full rounded-[12px]"
          style={[{ height, position: 'relative' }, Platform.OS === 'web' ? { outline: 'none', cursor: 'text' } as any : {}]}
          onPress={() => innerRef.current?.focus()}
        >

          {/* Base Idle Border (Continuous) */}
          <View
            className={`rounded-[12px] border ${error ? 'border-red-500' : 'border-text'}`}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderWidth: 1, borderRadius: 12, opacity: error ? 1 : 0.3 }}
          />

          {/* Focused Animated Border (Continuous) */}
          {!error && (
            <Animated.View
              className="rounded-[12px] border border-text pointer-events-none"
              style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderWidth: 1.5, borderRadius: 12 }, animatedFocusBorderOpacity]}
            />
          )}

          {/* Animated Label (NEVER leaves the field) */}
          {label && (
            <Animated.View
              className="absolute pointer-events-none z-20 flex-row"
              style={[
                {
                  left: hasIcon ? 42 : 14,
                  top: 18,
                },
                Platform.OS === 'web' ? { transformOrigin: 'left top' } as any : {},
                animatedLabelStyle
              ]}
            >
              <Text className={`text-[16px] font-medium ${error ? 'text-red-500' : (localFocus ? 'text-primary' : 'text-text-secondary')
                }`} style={{ letterSpacing: isActive ? 0.5 : 0, lineHeight: 22 }}>
                {label}
              </Text>
            </Animated.View>
          )}

          {/* Value Row */}
          <View
            className={`absolute left-[14px] right-[14px] flex-row ${isTextarea ? 'items-start' : 'items-center'}`}
            style={{
              top: isTextarea ? 32 : 24,
              bottom: isTextarea ? 14 : undefined,
              height: isTextarea ? undefined : 24
            }}
          >
            {hasIcon && (
              <View className="w-5 items-center justify-center mr-2" style={{ height: 24 }}>
                {leadingIcon}
              </View>
            )}

            <View className="flex-1 h-full" style={{ position: 'relative' }}>

              {/* Animated Placeholder (Delayed) */}
              {!hasValue && placeholder && (
                <Animated.View
                  className="pointer-events-none z-10"
                  style={[
                    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
                    !isTextarea && { justifyContent: 'center' },
                    animatedPlaceholderOpacity
                  ]}
                >
                  <Text
                    className="text-[16px] text-text-secondary opacity-50"
                    style={{
                      includeFontPadding: false,
                      textAlignVertical: isTextarea ? 'top' : 'center'
                    }}
                  >
                    {placeholder}
                  </Text>
                </Animated.View>
              )}

              {/* TextInput */}
              <TextInput
                ref={innerRef}
                className="w-full text-[16px] text-text z-20"
                style={[
                  {
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingVertical: 0,
                    margin: 0,
                    borderWidth: 0,
                    includeFontPadding: false,
                    textAlignVertical: isTextarea ? 'top' : 'center',
                    ...(Platform.OS === 'web' ? {
                      outline: 'none',
                      resize: 'none',
                      boxShadow: 'none',
                      backgroundColor: 'transparent',
                    } : {})
                  } as any
                ]}
                placeholder="" // Native placeholder disabled in favor of animated custom
                multiline={isTextarea}
                numberOfLines={isTextarea ? 4 : 1}
                textAlignVertical={isTextarea ? 'top' : 'center'}
                value={value}
                onFocus={handleFocus}
                onBlur={handleBlur}
                maxLength={maxLength}
                {...props}
              />
            </View>
          </View>
        </Pressable>

        {/* Footer info (Error, Helper, Counter) */}
        {(error || helperText || (showCounter && maxLength)) && (
          <View className="flex-row justify-between items-start mt-1.5 px-1">
            <View className="flex-1">
              {error ? (
                <Text className="text-red-500 text-[13px] font-medium">{error}</Text>
              ) : helperText ? (
                <Text className="text-text-secondary text-[13px]">{helperText}</Text>
              ) : null}
            </View>

            {showCounter && maxLength && (
              <Text className="text-text-secondary text-[12px] ml-4 font-mono">
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
