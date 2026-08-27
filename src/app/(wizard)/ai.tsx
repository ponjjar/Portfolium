import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { WizardHeader } from '@/components/layout/wizard-header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Button } from '@/components/ui/button';
import { Sparkles, Brain, FastForward } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function AiScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleNext = () => {
    // Para onde ir depois? Presumo preview final.
    router.replace('/'); 
  };

  return (
    <View className="flex-1 bg-black">
      <WizardHeader 
        step={4} 
        title={t('ai.title')} 
        subtitle={t('ai.subtitle')}
      />
      
      <ScrollView className="flex-1 px-6">
        <View className="max-w-4xl w-full self-center pb-8 pt-4">
          
          <View className="flex-col md:flex-row gap-6">
            {/* Option 1 */}
            <View className="flex-1 border border-border rounded-xl p-6 bg-surface relative">
              <View className="absolute -top-3 left-6 bg-white px-3 py-1 rounded-full">
                <Text className="text-black text-[10px] font-bold tracking-widest uppercase">
                  {t('ai.recommended')}
                </Text>
              </View>
              
              <View className="flex-row items-center mb-4 mt-2">
                <Brain color="#fff" size={24} className="mr-3" />
                <Text className="text-white text-xl font-bold">{t('ai.use_my_ai')}</Text>
              </View>
              
              <Text className="text-text-secondary text-sm mb-6 leading-relaxed">
                {t('ai.use_my_ai_desc')}
              </Text>
              
              <View className="border-l-2 border-[#333] pl-4 mb-8">
                <Text className="text-text-secondary text-xs leading-relaxed">
                  {t('ai.use_my_ai_info')}
                </Text>
              </View>
              
              <View className="mt-auto">
                <Button className="w-full">
                  {t('ai.start_btn')}
                </Button>
              </View>
            </View>

            {/* Option 2 */}
            <View className="flex-1 border border-border rounded-xl p-6 bg-transparent">
              <View className="flex-row items-center mb-4">
                <Sparkles color="#fff" size={24} className="mr-3" />
                <Text className="text-white text-xl font-bold">{t('ai.free_ai')}</Text>
              </View>
              
              <Text className="text-text-secondary text-sm mb-6 leading-relaxed">
                {t('ai.free_ai_desc')}
              </Text>
              
              <Text className="text-text-secondary text-xs mb-8">
                {t('ai.free_ai_info')}
              </Text>
              
              <View className="mt-auto">
                <Button variant="outline" className="w-full border-[#333]">
                  {t('ai.generate_ai_btn')}
                </Button>
              </View>
            </View>

            {/* Option 3 */}
            <View className="flex-1 border border-border rounded-xl p-6 bg-transparent">
              <View className="flex-row items-center mb-4">
                <FastForward color="#fff" size={24} className="mr-3" />
                <Text className="text-white text-xl font-bold">{t('ai.no_ai')}</Text>
              </View>
              
              <Text className="text-text-secondary text-sm mb-8 leading-relaxed">
                {t('ai.no_ai_desc')}
              </Text>
              
              <View className="mt-auto">
                <Button variant="outline" className="w-full border-[#333]">
                  {t('ai.no_ai_btn')}
                </Button>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>

      <BottomNav onNext={handleNext} nextLabel={t('ai.finish')} />
    </View>
  );
}
