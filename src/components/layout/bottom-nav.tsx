import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '../ui/button';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

interface BottomNavProps {
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  isNextDisabled?: boolean;
  isNextLoading?: boolean;
}

export function BottomNav({ 
  onNext, 
  onBack, 
  nextLabel = "Continuar", 
  backLabel = "Voltar",
  isNextDisabled = false,
  isNextLoading = false
}: BottomNavProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleBack = () => {
    if (onBack) onBack();
    else router.replace('/');
  };

  return (
    <View className="flex-row items-center justify-between px-6 pt-4 pb-10 md:pb-4 border-t border-border bg-surface-elevated">
      <Text className="text-text-secondary text-[10px] uppercase tracking-widest hidden md:flex">
        {t('common.saved_automatically')}
      </Text>
      
      {/* Em telas muito pequenas o texto "Salvo" some */}
      <View className="flex-row justify-end flex-1 md:flex-none gap-4">
        {onBack && (
          <Button variant="ghost" onPress={handleBack}>
            {backLabel === 'Voltar' ? t('common.back') : backLabel}
          </Button>
        )}
        <Button 
          variant="default" 
          onPress={onNext} 
          disabled={isNextDisabled}
          isLoading={isNextLoading}
        >
          {nextLabel === 'Continuar' ? t('common.continue') : nextLabel}
        </Button>
      </View>
    </View>
  );
}
