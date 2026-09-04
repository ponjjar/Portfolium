import { Project, Profile, PortfolioLanguageSettings } from '@/domain/portfolio/types';
import i18next from 'i18next';

/**
 * Normalizes a locale string to either 'pt-BR' or 'en',
 * removing legacy 'pt' representations.
 */
export function normalizeLocale(locale: string): 'pt-BR' | 'en' {
  if (!locale) return 'en';
  const normalized = locale.trim().toLowerCase().replace('_', '-');
  if (normalized === 'pt' || normalized === 'pt-br') {
    return 'pt-BR';
  }
  return 'en';
}

/**
 * Gets the translated label for a given language code based on the current interface locale.
 * Uses i18next to fetch the localized string.
 */
export function getLanguageLabel(locale: string): string {
  const norm = normalizeLocale(locale);
  // Default fallbacks in case i18n is not loaded yet
  const fallbackEn = norm === 'pt-BR' ? 'Portuguese' : 'English';
  const fallbackPt = norm === 'pt-BR' ? 'Português' : 'Inglês';
  
  if (i18next.language?.startsWith('pt')) {
    return i18next.t(`languages.${norm}`, fallbackPt);
  }
  return i18next.t(`languages.${norm}`, fallbackEn);
}

/**
 * Resolves the appropriate translation for a project based on the current locale
 * and the available AI translations. Falls back to the original description if none exists
 * or if the translation wasn't approved.
 */
export function resolveProjectTranslation(
  project: Project,
  currentLocale: string,
  settings: PortfolioLanguageSettings
): { title: string; shortDescription: string; description: string; isTranslated: boolean } {
  const { defaultLanguage } = settings;
  const isOriginalLanguage = currentLocale === defaultLanguage;
  
  // Attempt to use the AI translation for the current locale if it exists and is approved
  const aiReview = project.aiReviewsByLocale?.[currentLocale];
  if (aiReview && aiReview.status === 'approved') {
    return {
      title: project.title, // Title is not translated by AI
      shortDescription: project.shortDescription, // Currently we only translate full desc, but we could expand this
      description: aiReview.generatedDescription,
      isTranslated: !isOriginalLanguage,
    };
  }

  // Fallback to original
  return {
    title: project.title,
    shortDescription: project.shortDescription,
    description: project.description,
    isTranslated: false,
  };
}

/**
 * Resolves the appropriate translation for the profile bio based on the current locale.
 */
export function resolveProfileBio(
  profile: Profile,
  currentLocale: string,
  settings: PortfolioLanguageSettings
): { bio: string; isTranslated: boolean } {
  const { defaultLanguage } = settings;
  const isOriginalLanguage = currentLocale === defaultLanguage;

  const aiDesc = profile.aiDescriptionsByLocale?.[currentLocale];
  if (aiDesc && aiDesc.status === 'approved') {
    return {
      bio: aiDesc.generatedText,
      isTranslated: !isOriginalLanguage,
    };
  }

  return {
    bio: profile.bio,
    isTranslated: false,
  };
}
