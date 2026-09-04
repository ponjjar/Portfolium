import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { usePortfolioStore } from '@/store';
import { getLanguageLabel } from '@/utils/localization';

const AVAILABLE_LANGUAGES = [
  { code: 'pt-BR', flag: '🇧🇷' },
  { code: 'en', flag: '🇺🇸' },
];

export function AiLanguageSelector() {
  const { t } = useTranslation();
  const { session, updateLanguageSettings } = usePortfolioStore();
  const { supportedLanguages } = session.languageSettings;

  const toggleLanguage = (code: string) => {
    let newLanguages = [...supportedLanguages];
    if (newLanguages.includes(code)) {
      if (newLanguages.length === 1) return; // Prevent deselecting the last language
      newLanguages = newLanguages.filter(l => l !== code);
    } else {
      newLanguages.push(code);
    }
    updateLanguageSettings({ supportedLanguages: newLanguages });
  };

  return (
    <View className="mb-6">
      <Text className="text-text font-bold text-lg mb-2">
        {t('ai.select_languages', 'Idiomas do Portfólio')}
      </Text>
      <Text className="text-text-secondary text-sm mb-4">
        {t('ai.select_languages_desc', 'A IA gerará resumos e descrições para cada idioma selecionado. A cota consumida será multiplicada pelos idiomas.')}
      </Text>
      
      <View className="flex-row gap-4">
        {AVAILABLE_LANGUAGES.map((lang) => {
          const isSelected = supportedLanguages.includes(lang.code);
          return (
            <TouchableOpacity
              key={lang.code}
              onPress={() => toggleLanguage(lang.code)}
              className={`flex-1 border rounded-xl p-4 flex-row items-center justify-between ${
                isSelected 
                  ? 'bg-primary/10 border-primary' 
                  : 'bg-surface border-border opacity-60'
              }`}
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">{lang.flag}</Text>
                <Text className={`font-bold ${isSelected ? 'text-primary' : 'text-text'}`}>
                  {getLanguageLabel(lang.code)}
                </Text>
              </View>
              {isSelected && (
                <View className="bg-primary rounded-full p-1">
                  <Check size={14} color="#000" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
