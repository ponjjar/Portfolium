import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { AvatarStyleSchema } from '@/domain/portfolio/schema';
import { z } from 'zod';

type AvatarStyle = z.infer<typeof AvatarStyleSchema>;

interface ProfileLayoutModalProps {
  visible: boolean;
  onClose: () => void;
  currentVariant: string;
  avatarStyle: AvatarStyle;
  onSelectVariant: (variant: 'stacked-center' | 'avatar-side' | 'center-orbit' | 'custom-orbit-builder') => void;
  onUpdateAvatarStyle: (style: AvatarStyle) => void;
  onOpenOrbitSettings: () => void;
  onOpenCustomOrbitBuilder: () => void;
}

export function ProfileLayoutModal({ 
  visible, 
  onClose, 
  currentVariant, 
  avatarStyle,
  onSelectVariant, 
  onUpdateAvatarStyle,
  onOpenOrbitSettings,
  onOpenCustomOrbitBuilder
}: ProfileLayoutModalProps) {
  const { t } = useTranslation();

  const getShapeLabel = (shape: 'circle' | 'square' | 'rounded-square') => {
    switch (shape) {
      case 'circle': return t('profile_layout.shape_circle');
      case 'square': return t('profile_layout.shape_square');
      case 'rounded-square': return t('profile_layout.shape_rounded');
    }
  };

  const getBorderLabel = (border: 'none' | 'subtle' | 'strong') => {
    switch (border) {
      case 'none': return t('profile_layout.border_none');
      case 'subtle': return t('profile_layout.border_subtle');
      case 'strong': return t('profile_layout.border_strong');
    }
  };

  const getEffectLabel = (effect: 'none' | 'fade-in' | 'soft-shadow' | 'glow') => {
    switch (effect) {
      case 'none': return t('profile_layout.effect_none');
      case 'fade-in': return t('profile_layout.effect_fade_in');
      case 'soft-shadow': return t('profile_layout.effect_shadow');
      case 'glow': return t('profile_layout.effect_glow');
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={t('profile_layout.modal_title')}
      size="md"
      footer={
        <Button variant="default" className="w-full" onPress={onClose}>
          <Text className="text-primary-foreground font-bold">{t('common.done')}</Text>
        </Button>
      }
    >
      <ScrollView className="py-2">
        <Text className="text-text font-bold text-sm mb-3">{t('profile_layout.layout_variant')}</Text>

        <View className="gap-3 mb-6">
          {/* Stacked Center */}
          <TouchableOpacity 
            onPress={() => onSelectVariant('stacked-center')}
            className={`border rounded-xl p-3 ${currentVariant === 'stacked-center' ? 'border-primary bg-primary/10' : 'border-border bg-surface'}`}
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 mr-3 bg-input-background border border-border rounded-lg items-center justify-center flex-col p-1">
                <View className="w-4 h-4 rounded-full bg-border mb-1" />
                <View className="w-8 h-1 bg-border mb-1 rounded" />
                <View className="w-6 h-1 bg-border rounded" />
              </View>
              <View className="flex-1">
                <Text className={`font-bold text-sm ${currentVariant === 'stacked-center' ? 'text-primary' : 'text-text'}`}>
                  {t('profile_layout.variant_stacked')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Avatar Side */}
          <TouchableOpacity 
            onPress={() => onSelectVariant('avatar-side')}
            className={`border rounded-xl p-3 ${currentVariant === 'avatar-side' ? 'border-primary bg-primary/10' : 'border-border bg-surface'}`}
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 mr-3 bg-input-background border border-border rounded-lg items-center justify-center flex-row p-1">
                <View className="w-4 h-4 rounded-full bg-border mr-1" />
                <View className="flex-col items-start flex-1">
                  <View className="w-full h-1 bg-border mb-0.5 rounded" />
                  <View className="w-4/5 h-1 bg-border mb-0.5 rounded" />
                  <View className="w-full h-1 bg-border rounded" />
                </View>
              </View>
              <View className="flex-1">
                <Text className={`font-bold text-sm ${currentVariant === 'avatar-side' ? 'text-primary' : 'text-text'}`}>
                  {t('profile_layout.variant_side')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Center Orbit */}
          <View className={`border rounded-xl p-3 ${currentVariant === 'center-orbit' ? 'border-primary bg-primary/10' : 'border-border bg-surface'}`}>
            <TouchableOpacity onPress={() => onSelectVariant('center-orbit')} className="flex-row items-center mb-2">
              <View className="w-12 h-12 mr-3 bg-input-background border border-border rounded-lg items-center justify-center relative">
                <View className="w-2 h-0.5 bg-border absolute top-1 right-1 rounded" />
                <View className="w-2 h-0.5 bg-border absolute top-1 left-1 rounded" />
                <View className="w-5 h-5 rounded-full bg-border" />
                <View className="w-3 h-0.5 bg-border absolute bottom-1 rounded" />
              </View>
              <View className="flex-1">
                <Text className={`font-bold text-sm ${currentVariant === 'center-orbit' ? 'text-primary' : 'text-text'}`}>
                  {t('profile_layout.variant_orbit')}
                </Text>
              </View>
            </TouchableOpacity>
            {currentVariant === 'center-orbit' && (
              <View className="ml-14 mt-1">
                <Button variant="outline" size="sm" onPress={onOpenOrbitSettings}>
                  <Text className="text-text font-bold text-xs">{t('profile_layout.btn_organize_orbit')}</Text>
                </Button>
              </View>
            )}
          </View>

          {/* Custom Orbit Builder */}
          <View className={`border rounded-xl p-3 ${currentVariant === 'custom-orbit-builder' ? 'border-primary bg-primary/10' : 'border-border bg-surface'}`}>
            <TouchableOpacity onPress={() => onSelectVariant('custom-orbit-builder')} className="flex-row items-center mb-2">
              <View className="w-12 h-12 mr-3 bg-input-background border border-border rounded-lg items-center justify-center relative flex-wrap gap-0.5 p-1">
                <View className="w-full h-full border border-dashed border-border rounded items-center justify-center relative">
                  <View className="w-4 h-4 rounded-full bg-border" />
                </View>
              </View>
              <View className="flex-1">
                <Text className={`font-bold text-sm ${currentVariant === 'custom-orbit-builder' ? 'text-primary' : 'text-text'}`}>
                  {t('profile_layout.variant_custom_orbit')}
                </Text>
              </View>
            </TouchableOpacity>
            {currentVariant === 'custom-orbit-builder' && (
              <View className="ml-14 mt-1">
                <Button variant="outline" size="sm" onPress={onOpenCustomOrbitBuilder}>
                  <Text className="text-text font-bold text-xs">{t('profile_layout.btn_open_builder')}</Text>
                </Button>
              </View>
            )}
          </View>
        </View>

        <View className="border-t border-border pt-4 mt-2">
          <Text className="text-text font-bold text-sm mb-3">{t('profile_layout.avatar_style')}</Text>
          
          <Text className="text-text-secondary text-xs mb-2">{t('profile_layout.shape_label')}</Text>
          <View className="flex-row gap-2 mb-4">
            {(['circle', 'square', 'rounded-square'] as const).map(shape => (
              <TouchableOpacity 
                key={shape}
                onPress={() => onUpdateAvatarStyle({ ...avatarStyle, shape })}
                className={`flex-1 py-1.5 rounded items-center border ${avatarStyle.shape === shape ? 'border-primary bg-primary/20' : 'border-border bg-surface'}`}
              >
                <Text className={avatarStyle.shape === shape ? 'text-primary font-bold text-xs' : 'text-text text-xs'}>
                  {getShapeLabel(shape)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-text-secondary text-xs mb-2">{t('profile_layout.border_label')}</Text>
          <View className="flex-row gap-2 mb-4">
            {(['none', 'subtle', 'strong'] as const).map(border => (
              <TouchableOpacity 
                key={border}
                onPress={() => onUpdateAvatarStyle({ ...avatarStyle, border })}
                className={`flex-1 py-1.5 rounded items-center border ${avatarStyle.border === border ? 'border-primary bg-primary/20' : 'border-border bg-surface'}`}
              >
                <Text className={avatarStyle.border === border ? 'text-primary font-bold text-xs' : 'text-text text-xs'}>
                  {getBorderLabel(border)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-text-secondary text-xs mb-2">{t('profile_layout.effect_label')}</Text>
          <View className="flex-row gap-2 mb-4 flex-wrap">
            {(['none', 'fade-in', 'soft-shadow', 'glow'] as const).map(effect => (
              <TouchableOpacity 
                key={effect}
                onPress={() => onUpdateAvatarStyle({ ...avatarStyle, effect })}
                className={`px-3 py-1.5 rounded items-center border ${avatarStyle.effect === effect ? 'border-primary bg-primary/20' : 'border-border bg-surface'}`}
              >
                <Text className={avatarStyle.effect === effect ? 'text-primary font-bold text-xs' : 'text-text text-xs'}>
                  {getEffectLabel(effect)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </Modal>
  );
}
