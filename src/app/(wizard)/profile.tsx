import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { WizardHeader } from '@/components/layout/wizard-header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Code2, Briefcase, Globe } from 'lucide-react-native';
import { usePortfolioStore } from '@/store';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { session, updateProfile } = usePortfolioStore();
  const profile = session.profile;

  const [name, setName] = useState(profile.name);
  const [headline, setHeadline] = useState(profile.headline);
  const [bio, setBio] = useState(profile.bio);
  const [github, setGithub] = useState(profile.github || '');
  const [linkedin, setLinkedin] = useState(profile.linkedin || '');
  const [website, setWebsite] = useState(profile.website || '');

  const handleNext = () => {
    updateProfile({ name, headline, bio, github, linkedin, website });
    router.push('/(wizard)/projects');
  };

  return (
    <View className="flex-1 bg-black">
      <WizardHeader 
        step={1} 
        title={t('profile.title')} 
        subtitle={t('profile.subtitle')}
      />
      
      <ScrollView className="flex-1 px-6">
        <View className="max-w-2xl w-full self-center pb-8">
          
          <Input 
            label={t('profile.name_label')}
            placeholder={t('profile.name_placeholder')}
            value={name}
            onChangeText={setName}
          />
          
          <Input 
            label={t('profile.headline_label')}
            placeholder={t('profile.headline_placeholder')}
            value={headline}
            onChangeText={setHeadline}
          />
          
          <View className="mb-8">
            <Text className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-2">
              {t('profile.about_label')}
            </Text>
            <Input 
              placeholder={t('profile.about_placeholder')}
              multiline
              numberOfLines={4}
              value={bio}
              onChangeText={setBio}
              className="h-32 text-left"
              style={{ textAlignVertical: 'top' }}
            />
            <Text className="text-text-secondary text-[10px] text-right mt-1">
              {bio.length} / 500
            </Text>
          </View>
          
          <View className="mb-8">
            <Text className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-2">
              {t('profile.avatar_label')}
            </Text>
            <View className="flex-row items-center">
              <View className="w-20 h-20 bg-surface rounded items-center justify-center mr-4">
                <User color="#666" size={32} />
              </View>
              <View className="flex-row gap-4">
                <Button variant="ghost" size="sm">
                  <Text className="text-xs text-white">{t('profile.upload_image')}</Text>
                </Button>
                <Button variant="ghost" size="sm">
                  <Text className="text-xs text-white">{t('profile.use_url')}</Text>
                </Button>
              </View>
            </View>
          </View>
          
          <View className="mb-8">
            <Text className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-2">
              {t('profile.links_label')}
            </Text>
            <View className="flex-row items-center mb-2">
              <Code2 color="#666" size={20} className="mr-3" />
              <Input 
                className="flex-1 mb-0" 
                placeholder={t('profile.github_placeholder')} 
                value={github}
                onChangeText={setGithub}
              />
            </View>
            <View className="flex-row items-center mb-2">
              <Briefcase color="#666" size={20} className="mr-3" />
              <Input 
                className="flex-1 mb-0" 
                placeholder={t('profile.linkedin_placeholder')} 
                value={linkedin}
                onChangeText={setLinkedin}
              />
            </View>
            <View className="flex-row items-center mb-2">
              <Globe color="#666" size={20} className="mr-3" />
              <Input 
                className="flex-1 mb-0" 
                placeholder={t('profile.website_placeholder')} 
                value={website}
                onChangeText={setWebsite}
              />
            </View>
          </View>
          
        </View>
      </ScrollView>

      <BottomNav onNext={handleNext} />
    </View>
  );
}
