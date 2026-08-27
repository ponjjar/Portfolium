import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { WizardHeader } from '@/components/layout/wizard-header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Info, Check, Plus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

const Badge = ({ label, selected = true }: { label: string, selected?: boolean }) => (
  <View className={`flex-row items-center rounded-full px-4 py-2 border ${selected ? 'bg-white border-white' : 'bg-transparent border-border'}`}>
    <Text className={`${selected ? 'text-black' : 'text-white'} font-bold mr-2`}>{label}</Text>
    {selected && <Check color="#000" size={14} />}
  </View>
);

export default function SkillsScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleNext = () => {
    router.push('/(wizard)/ai');
  };

  return (
    <View className="flex-1 bg-black">
      <WizardHeader 
        step={3} 
        title={t('skills.title')} 
        subtitle={t('skills.subtitle')}
      />
      
      <ScrollView className="flex-1 px-6">
        <View className="max-w-3xl w-full self-center pb-8">
          
          <View className="flex-row items-center mb-6">
            <View className="border border-border bg-[#111] px-4 py-2 rounded flex-row items-center">
              <Text className="text-text-secondary text-xs">
                {t('skills.found_message', { count: 0, projects: 0 })}
              </Text>
            </View>
          </View>
          
          <View className="bg-surface border border-border p-4 rounded mb-10 flex-row items-center">
            <Info color="#888" size={18} className="mr-3" />
            <Text className="text-text-secondary text-sm flex-1">
              {t('skills.info_message')}
            </Text>
          </View>

          {/* Frontend Category */}
          <View className="mb-8">
            <Text className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-4">
              {t('skills.frontend')}
            </Text>
            <View className="flex-row flex-wrap gap-3">
              <Badge label="React" />
              <Badge label="Next.js" />
              <Badge label="TypeScript" />
              <Badge label="Redux" />
              <Badge label="Tailwind CSS" selected={false} />
              
              <View className="flex-row items-center rounded-full px-4 py-2 border border-border border-dashed">
                <Plus color="#888" size={14} className="mr-2" />
                <Text className="text-text-secondary font-bold text-xs">{t('skills.add_technology')}</Text>
              </View>
            </View>
            <View className="w-full h-[1px] bg-border mt-6" />
          </View>
          
          {/* Backend Category */}
          <View className="mb-8">
            <Text className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-4">
              {t('skills.backend')}
            </Text>
            <View className="flex-row flex-wrap gap-3">
              <Badge label="Node.js" />
              <Badge label="PostgreSQL" />
              <Badge label="Prisma" selected={false} />
              
              <View className="flex-row items-center rounded-full px-4 py-2 border border-border border-dashed">
                <Plus color="#888" size={14} className="mr-2" />
                <Text className="text-text-secondary font-bold text-xs">{t('skills.add_technology')}</Text>
              </View>
            </View>
            <View className="w-full h-[1px] bg-border mt-6" />
          </View>

        </View>
      </ScrollView>

      <BottomNav onNext={handleNext} />
    </View>
  );
}
