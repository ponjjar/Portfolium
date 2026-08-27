import React from 'react';
import { Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react-native';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('en') ? 'pt' : 'en';
    i18n.changeLanguage(nextLang);
  };

  const label = i18n.language.startsWith('en') ? 'EN-US' : 'PT-BR';

  return (
    <Pressable 
      onPress={toggleLanguage}
      className="flex-row items-center bg-[#111] rounded-full px-3 py-1.5 border border-border"
    >
      <Globe color="#888" size={12} className="mr-2" />
      <Text className="text-text-secondary text-[10px] font-bold uppercase tracking-wider">
        {label}
      </Text>
    </Pressable>
  );
}
