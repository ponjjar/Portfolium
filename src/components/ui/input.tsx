import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ label, error, helperText, className, style, ...props }, ref) => {
    return (
      <View className="flex flex-col mb-4">
        {label && (
          <Text className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-2">
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          className={`h-12 border border-border bg-black text-white px-4 rounded focus:border-white focus:bg-surface transition-colors ${
            error ? 'border-red-500' : ''
          } ${className || ''}`}
          placeholderTextColor="#666"
          {...props}
        />
        {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
        {helperText && !error && (
          <Text className="text-text-secondary text-xs mt-1">{helperText}</Text>
        )}
      </View>
    );
  }
);
Input.displayName = 'Input';
