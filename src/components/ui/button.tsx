import React from 'react';
import { Pressable, Text, PressableProps } from 'react-native';
import { Loader2 } from 'lucide-react-native';

interface ButtonProps extends PressableProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
}

export function Button({ variant = 'default', size = 'default', children, isLoading, className, disabled, ...props }: ButtonProps) {
  
  const getBaseClasses = () => {
    let classes = 'flex-row items-center justify-center flex-nowrap gap-2 rounded-md ';
    
    // Variants
    if (variant === 'default') classes += 'bg-primary hover:bg-primary/90 active:bg-primary/80 ';
    if (variant === 'outline') classes += 'border border-border bg-transparent hover:bg-surface active:bg-surface-elevated ';
    if (variant === 'ghost') classes += 'bg-transparent hover:bg-surface active:bg-surface-elevated ';
    
    // Sizes
    if (size === 'default') classes += 'h-11 px-5 py-2 ';
    if (size === 'sm') classes += 'h-9 px-3 ';
    if (size === 'lg') classes += 'h-14 px-8 ';

    if (disabled || isLoading) classes += 'opacity-50 ';

    return classes;
  };

  const getTextClasses = () => {
    let classes = 'font-medium shrink whitespace-nowrap ';
    if (variant === 'default') classes += 'text-primary-foreground ';
    else classes += 'text-text ';
    
    if (size === 'sm') classes += 'text-sm ';
    else classes += 'text-base ';
    
    return classes;
  };

  return (
    <Pressable
      className={`${getBaseClasses()} ${className || ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-5 h-5 text-current animate-spin" />
      )}
      {React.Children.map(children, (child) => {
        if (typeof child === 'string' || typeof child === 'number') {
          return (
            <Text numberOfLines={1} className={getTextClasses()}>
              {child}
            </Text>
          );
        }
        return child;
      })}
    </Pressable>
  );
}
