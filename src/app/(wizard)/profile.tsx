import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { WizardHeader } from '@/components/layout/wizard-header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { getNextWizardStep, getWizardRoute } from '@/utils/wizard';

import { FormField } from '@/components/ui/form-field';
import { ImagePickerField } from '@/components/ui/image-picker-field';
import { Code2, Briefcase, Globe } from 'lucide-react-native';
import { usePortfolioStore } from '@/store';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { session, updateProfile, updateSocialLinks } = usePortfolioStore();
  const profile = session.profile;
  const socialLinks = session.socialLinks;

  const [errors, setErrors] = React.useState<{ name?: string, headline?: string, bio?: string }>({});

  const getSocialLink = (type: string) => socialLinks.find(l => l.type === type)?.url || '';

  const setSocialLink = (type: 'github' | 'linkedin' | 'website', url: string) => {
    const existing = [...socialLinks];
    const index = existing.findIndex(l => l.type === type);
    if (index >= 0) {
      if (!url) {
        existing.splice(index, 1);
      } else {
        existing[index].url = url;
      }
    } else if (url) {
      existing.push({ type, label: type.charAt(0).toUpperCase() + type.slice(1), url });
    }
    updateSocialLinks(existing);
  };

  const handleNext = () => {
    const newErrors: typeof errors = {};
    if (!profile.name.trim()) newErrors.name = 'Informe seu nome para continuar.';
    if (!profile.headline.trim()) newErrors.headline = 'Adicione um título profissional.';
    if (!profile.bio.trim()) newErrors.bio = 'Escreva uma breve apresentação.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (returnTo === 'editor') {
      router.push('/(wizard)/editor');
    } else {
      router.push(getWizardRoute(getNextWizardStep('profile')!));
    }
  };

  return (
    <View className="flex-1 bg-background">
      <WizardHeader 
        step={1} 
        title={t('profile.title')} 
        subtitle={t('profile.subtitle')}
      />
      
      <ScrollView className="flex-1 px-6">
        <View className="max-w-2xl w-full self-center pb-12">
          
          <View className="mb-10">
            <FormField 
              label={t('profile.name_label')}
              placeholder={t('profile.name_placeholder')}
              value={profile.name}
              onChangeText={(text) => {
                updateProfile({ name: text });
                if (errors.name) setErrors(e => ({ ...e, name: undefined }));
              }}
              error={errors.name}
            />
            
            <FormField 
              label={t('profile.headline_label')}
              placeholder={t('profile.headline_placeholder')}
              value={profile.headline}
              onChangeText={(text) => {
                updateProfile({ headline: text });
                if (errors.headline) setErrors(e => ({ ...e, headline: undefined }));
              }}
              error={errors.headline}
            />
            
            <FormField 
              variant="textarea"
              label={t('profile.about_label')}
              placeholder={t('profile.about_placeholder')}
              value={profile.bio}
              onChangeText={(text) => {
                updateProfile({ bio: text });
                if (errors.bio) setErrors(e => ({ ...e, bio: undefined }));
              }}
              error={errors.bio}
              maxLength={500}
              showCounter
            />
          </View>
          
          <View className="mb-10">
            <ImagePickerField 
              label={t('profile.avatar_label')}
              value={profile.avatar?.value}
              isUrl={profile.avatar?.type === 'url'}
              onChange={(value, isUrl) => {
                if (value) {
                  updateProfile({ avatar: { type: isUrl ? 'url' : 'embedded', value } });
                } else {
                  updateProfile({ avatar: undefined });
                }
              }}
            />
          </View>
          
          <View className="mb-8">
            <Text className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-4">
              {t('profile.links_label')}
            </Text>
            
            <FormField 
              placeholder={t('profile.github_placeholder')} 
              value={getSocialLink('github')}
              onChangeText={(text) => setSocialLink('github', text)}
              leadingIcon={<Code2 color="var(--text-secondary)" size={18} />}
            />
            
            <FormField 
              placeholder={t('profile.linkedin_placeholder')} 
              value={getSocialLink('linkedin')}
              onChangeText={(text) => setSocialLink('linkedin', text)}
              leadingIcon={<Briefcase color="var(--text-secondary)" size={18} />}
            />
            
            <FormField 
              placeholder={t('profile.website_placeholder')} 
              value={getSocialLink('website')}
              onChangeText={(text) => setSocialLink('website', text)}
              leadingIcon={<Globe color="var(--text-secondary)" size={18} />}
            />
          </View>
          
        </View>
      </ScrollView>

      <BottomNav 
        onNext={handleNext} 
        nextLabel={returnTo === 'editor' ? 'Salvar e Voltar' : 'Continuar'} 
      />
    </View>
  );
}
