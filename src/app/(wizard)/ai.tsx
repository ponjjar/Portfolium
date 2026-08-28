import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { WizardScreen } from '@/components/layout/wizard-screen';
import { BottomNav } from '@/components/layout/bottom-nav';
import { getNextWizardStep, getPreviousWizardStep, getWizardRoute } from '@/utils/wizard';
import { Button } from '@/components/ui/button';
import { Sparkles, Brain, FastForward } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function AiScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleNext = () => {
    router.push(getWizardRoute(getNextWizardStep('ai')!));
  };

  const handleBack = () => {
    router.push(getWizardRoute(getPreviousWizardStep('ai')!));
  };

  return (
    <WizardScreen 
      step={4} 
      title={t('ai.title')} 
      subtitle={t('ai.subtitle')}
      bottomNav={<BottomNav onNext={handleNext} onBack={handleBack} nextLabel="Continuar" />}
    >
      <View className="flex-col md:flex-row gap-6">
            {/* Option 1 */}
            <View className="flex-1 border border-border rounded-xl p-6 bg-surface relative">
              <View className="absolute -top-3 left-6 bg-primary px-3 py-1 rounded-full">
                <Text className="text-primary-foreground text-[10px] font-bold tracking-widest uppercase">
                  {t('ai.recommended')}
                </Text>
              </View>
              
              <View className="flex-row items-center mb-4 mt-2">
                <Brain color="var(--text)" size={24} className="mr-3" />
                <Text className="text-text text-xl font-bold">{t('ai.use_my_ai')}</Text>
              </View>
              
              <Text className="text-text-secondary text-sm mb-6 leading-relaxed">
                {t('ai.use_my_ai_desc')}
              </Text>
              
              <View className="border-l-2 border-border-strong pl-4 mb-8">
                <Text className="text-text-secondary text-xs leading-relaxed">
                  {t('ai.use_my_ai_info')}
                </Text>
              </View>
              
              <View className="mt-auto">
                <Button className="w-full" onPress={handleNext}>
                  {t('ai.start_btn')}
                </Button>
              </View>
            </View>

            {/* Option 2 */}
            <View className="flex-1 border border-border rounded-xl p-6 bg-transparent">
              <View className="flex-row items-center mb-4">
                <Sparkles color="var(--text)" size={24} className="mr-3" />
                <Text className="text-text text-xl font-bold">{t('ai.free_ai')}</Text>
              </View>
              
              <Text className="text-text-secondary text-sm mb-6 leading-relaxed">
                {t('ai.free_ai_desc')}
              </Text>
              
              <Text className="text-text-secondary text-xs mb-8">
                {t('ai.free_ai_info')}
              </Text>
              
              <View className="mt-auto">
                <Button variant="outline" className="w-full border-[#333]" onPress={handleNext}>
                  {t('ai.generate_ai_btn')}
                </Button>
              </View>
            </View>

            {/* Option 3 */}
            <View className="flex-1 border border-border rounded-xl p-6 bg-transparent">
              <View className="flex-row items-center mb-4">
                <FastForward color="var(--text)" size={24} className="mr-3" />
                <Text className="text-text text-xl font-bold">{t('ai.no_ai')}</Text>
              </View>
              
              <Text className="text-text-secondary text-sm mb-8 leading-relaxed">
                {t('ai.no_ai_desc')}
              </Text>
              
              <View className="mt-auto">
                <Button variant="outline" className="w-full border-border-strong" onPress={handleNext}>
                  <Text className="text-text text-center font-bold">{t('ai.no_ai_btn')}</Text>
                </Button>
              </View>
            </View>
          </View>
    </WizardScreen>
  );
}
