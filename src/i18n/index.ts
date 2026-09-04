import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import ptBR from './locales/pt-BR.json';

const resources = {
  en: { translation: en.translation },
  'pt-BR': { translation: ptBR.translation },
};

const systemLocale = Localization.getLocales()[0]?.languageCode;
let defaultLang = 'en';

if (systemLocale === 'pt') {
  defaultLang = 'pt-BR';
}

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources,
    lng: defaultLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

if (Platform.OS !== 'web' || typeof window !== 'undefined') {
  AsyncStorage.getItem('app_language').then((savedLang) => {
    if (savedLang && (savedLang === 'en' || savedLang === 'pt-BR')) {
      if (i18n.language !== savedLang) {
        i18n.changeLanguage(savedLang);
      }
    }
  }).catch(() => {});
}

export default i18n;
