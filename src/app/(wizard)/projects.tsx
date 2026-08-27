import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { WizardHeader } from '@/components/layout/wizard-header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Button } from '@/components/ui/button';
import { Folder, Code2, Plus } from 'lucide-react-native';
import { usePortfolioStore } from '@/store';
import { useTranslation } from 'react-i18next';

export default function ProjectsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { session } = usePortfolioStore();
  const projects = session.projects;

  const handleNext = () => {
    router.push('/(wizard)/skills');
  };

  return (
    <View className="flex-1 bg-black">
      <WizardHeader 
        step={2} 
        title={t('projects.title')} 
        subtitle={t('projects.subtitle')}
      />
      
      <ScrollView className="flex-1 px-6">
        <View className="max-w-3xl w-full self-center pb-8">
          
          <View className="flex-row gap-4 mb-10">
            <Button variant="default">
              <View className="flex-row items-center">
                <Code2 color="#000" size={18} className="mr-2" />
                <Text className="text-black font-bold">{t('projects.import_github')}</Text>
              </View>
            </Button>
            
            <Button variant="outline">
              <View className="flex-row items-center">
                <Plus color="#fff" size={18} className="mr-2" />
                <Text className="text-white font-bold">{t('projects.add_project')}</Text>
              </View>
            </Button>
          </View>
          
          <Text className="text-white text-xl font-bold mb-4">
            {t('projects.your_projects')}
          </Text>
          
          <View className="w-full h-[1px] bg-border mb-6" />

          {projects.length === 0 ? (
            <View className="border border-border border-dashed rounded-lg p-10 items-center justify-center bg-[#0a0a0a]">
              <Folder color="#666" size={48} className="mb-4" />
              <Text className="text-text-secondary text-center mb-6 max-w-sm leading-relaxed">
                {t('projects.empty_state')}
              </Text>
              <Button variant="outline">
                {t('projects.add_project')}
              </Button>
            </View>
          ) : (
            <View>
              {projects.map((p: any) => (
                <View key={p.id} className="border border-border rounded p-6 mb-4 bg-surface">
                  <Text className="text-white font-bold text-lg mb-2">{p.title}</Text>
                  <Text className="text-text-secondary text-sm mb-4">{p.description}</Text>
                  <View className="flex-row gap-2">
                    {p.technologies.map((t: any) => (
                      <View key={t} className="border border-border rounded px-2 py-1">
                        <Text className="text-text-secondary text-xs">{t}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
          
        </View>
      </ScrollView>

      <BottomNav onNext={handleNext} />
    </View>
  );
}
