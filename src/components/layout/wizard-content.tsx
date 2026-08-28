import React from 'react';
import { View, ViewProps } from 'react-native';

export function WizardContent({ children, className = '', ...props }: ViewProps) {
  return (
    <View 
      className={`w-full max-w-5xl mx-auto px-6 pb-12 ${className}`} 
      {...props}
    >
      {children}
    </View>
  );
}
