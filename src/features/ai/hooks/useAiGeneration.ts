import { useState, useCallback, useMemo } from 'react';
import { usePortfolioStore, getManagedAiUsage } from '@/store';
import { AiClient } from '../ai-client';
import { AiMode, AiGenerationStatus, ProjectAiDraft, ProfileAiDraft } from '../types';
import { ExternalAiConfig } from '@/components/ai/AiExternalConfigModal';
import { ProjectAiReview, ProfileAiDescription } from '@/domain/portfolio/types';

export type AiWizardStep = 
  | 'idle' 
  | 'project-limit' 
  | 'generating-projects' 
  | 'review-projects' 
  | 'generating-profile' 
  | 'review-profile' 
  | 'complete';

export interface ProjectLocalePair {
  projectId: string;
  locale: string;
}

export function useAiGeneration() {
  const { session, updateAiConfig, updateProfile, saveProjectAiReview, saveProfileAiDescription } = usePortfolioStore();
  
  const [step, setStep] = useState<AiWizardStep>('idle');
  const [selectedPairs, setSelectedPairs] = useState<ProjectLocalePair[]>([]);
  const [mode, setMode] = useState<AiMode | null>(null);
  const [activeGenerationDrafts, setActiveGenerationDrafts] = useState<ProjectAiDraft[]>([]);
  const [activeProfileDrafts, setActiveProfileDrafts] = useState<Record<string, ProfileAiDraft>>({});
  
  const selectedLocales = session.languageSettings.supportedLanguages;

  const missingPairs = useMemo(() => {
    const pairs: ProjectLocalePair[] = [];
    session.projects.forEach(p => {
      if (p.selected) {
        selectedLocales.forEach(locale => {
          if (!p.aiReviewsByLocale || !p.aiReviewsByLocale[locale]) {
            pairs.push({ projectId: p.id, locale });
          }
        });
      }
    });
    return pairs;
  }, [session.projects, selectedLocales]);

  // 1. Initial selection
  const selectMode = (selectedMode: AiMode) => {
    setMode(selectedMode);
    
    if (selectedMode === 'free') {
      const { managedRemaining } = getManagedAiUsage(session);
      if (missingPairs.length > managedRemaining) {
        setSelectedPairs(missingPairs.slice(0, managedRemaining));
        setStep('project-limit');
        return;
      }
    }
    
    setSelectedPairs(missingPairs);
    startProjectGeneration(missingPairs, selectedMode);
  };

  const confirmProjectLimit = () => {
    if (selectedPairs.length === 0) return;
    startProjectGeneration(selectedPairs, mode!);
  };

  const startExternalGeneration = (config: ExternalAiConfig) => {
    setMode('personal');
    setSelectedPairs(missingPairs);
    startProjectGeneration(missingPairs, 'personal', config);
  };

  // 3. Generate Project Summaries
  const startProjectGeneration = async (pairs: ProjectLocalePair[], currentMode: AiMode, externalConfig?: ExternalAiConfig) => {
    setStep('generating-projects');
    
    const initialDrafts: ProjectAiDraft[] = pairs.map(pair => {
      const proj = session.projects.find(p => p.id === pair.projectId)!;
      return {
        projectId: pair.projectId,
        locale: pair.locale,
        originalDescription: proj.description,
        useful: true,
        status: 'pending',
      };
    });
    
    setActiveGenerationDrafts(initialDrafts);

    const defaultLang = session.languageSettings.defaultLanguage;
    const basePairs = pairs.filter(p => p.locale === defaultLang);
    const translationPairs = pairs.filter(p => p.locale !== defaultLang);

    // 3.1 Generate Base Language
    if (basePairs.length > 0) {
      setActiveGenerationDrafts(prev => prev.map(d => 
        basePairs.some(b => b.projectId === d.projectId && b.locale === d.locale) ? { ...d, status: 'generating' } : d
      ));
      
      try {
        if (externalConfig) {
          for (const pair of basePairs) {
            const p = session.projects.find(proj => proj.id === pair.projectId)!;
            const prompt = `Project: ${p.title}\nDescription: ${p.description}\nTechnologies: ${p.technologies.join(', ')}\nREADME: ${p.githubMetadata?.rawReadme || ''}`;
            const languageName = pair.locale.startsWith('pt') ? 'Brazilian Portuguese (pt-BR)' : 'English (en-US)';
            const summary = await AiClient.fetchExternalSummary(externalConfig, prompt, languageName);
            
            const aiReview: ProjectAiReview = {
              generationId: `gen_${Date.now()}_${Math.random().toString(36).substring(2,9)}`,
              projectId: p.id,
              source: 'external',
              requestedProvider: externalConfig.provider,
              usedProvider: externalConfig.provider,
              model: externalConfig.model,
              locale: pair.locale,
              originalDescription: p.description,
              generatedDescription: summary,
              status: 'approved', // Auto-approve
              generatedAt: new Date().toISOString(),
            };
            saveProjectAiReview(p.id, pair.locale, aiReview);
            setActiveGenerationDrafts(prev => prev.map(d => 
              d.projectId === p.id && d.locale === pair.locale ? { ...d, status: 'completed', useful: true, suggestedDescription: summary } : d
            ));
          }
        } else {
          const projectsForRequest = basePairs.map(pair => session.projects.find(p => p.id === pair.projectId)!);
          const response = await AiClient.summarizeProjects({
            language: defaultLang, // mapped to target locale internally if needed
            locale: defaultLang,
            projects: projectsForRequest.map(p => ({
              id: p.id,
              title: p.title,
              description: p.description,
              technologies: p.technologies,
              rawReadme: p.githubMetadata?.rawReadme,
            }))
          } as any);

          response.results.forEach(result => {
            if (result.error) {
              setActiveGenerationDrafts(prev => prev.map(d => 
                d.projectId === result.projectId && d.locale === defaultLang ? { ...d, status: 'error', error: result.error, useful: false } : d
              ));
            } else if (result.summary) {
              const p = session.projects.find(p => p.id === result.projectId)!;
              const aiReview: ProjectAiReview = {
                generationId: `gen_${Date.now()}_${Math.random().toString(36).substring(2,9)}`,
                projectId: p.id,
                source: 'managed',
                requestedProvider: result.requestedProvider as any || 'cloudflare',
                usedProvider: result.usedProvider as any || 'cloudflare',
                model: 'llama3-8b-8192',
                locale: defaultLang,
                originalDescription: p.description,
                generatedDescription: result.summary,
                status: 'approved', // Auto approve
                generatedAt: new Date().toISOString(),
              };
              saveProjectAiReview(p.id, defaultLang, aiReview);
              setActiveGenerationDrafts(prev => prev.map(d => 
                d.projectId === result.projectId && d.locale === defaultLang ? { ...d, status: 'completed', useful: true, suggestedDescription: result.summary } : d
              ));
            }
          });
        }
      } catch (err: any) {
        setActiveGenerationDrafts(prev => prev.map(d => 
          basePairs.some(b => b.projectId === d.projectId && b.locale === d.locale) ? { ...d, status: 'error', error: err.message, useful: false } : d
        ));
      }
    }

    // 3.2 Translate to Other Languages
    if (translationPairs.length > 0) {
      setActiveGenerationDrafts(prev => prev.map(d => 
        translationPairs.some(b => b.projectId === d.projectId && b.locale === d.locale) ? { ...d, status: 'generating' } : d
      ));

      // Group by target locale
      const translationByLocale = translationPairs.reduce((acc, pair) => {
        acc[pair.locale] = acc[pair.locale] || [];
        acc[pair.locale].push(pair);
        return acc;
      }, {} as Record<string, ProjectLocalePair[]>);

      for (const locale of Object.keys(translationByLocale)) {
        const localePairs = translationByLocale[locale];
        
        // Grab the base text. It might be in session (if it just generated) or already existed.
        // Zustand store 'session' might be stale in this closure, so we read from activeGenerationDrafts or directly from store.
        const currentSession = usePortfolioStore.getState().session;
        
        const textsToTranslate = localePairs.map(pair => {
          const p = currentSession.projects.find(proj => proj.id === pair.projectId)!;
          const baseReview = p.aiReviewsByLocale?.[defaultLang];
          const text = baseReview?.status === 'approved' ? baseReview.generatedDescription : p.description;
          return { id: pair.projectId, text: text || '' };
        }).filter(t => t.text.length > 0);

        if (textsToTranslate.length === 0) continue;

        try {
          const response = await AiClient.translate({
            sourceLocale: defaultLang,
            targetLocale: locale,
            texts: textsToTranslate
          });

          response.results.forEach(result => {
            if (result.error) {
              setActiveGenerationDrafts(prev => prev.map(d => 
                d.projectId === result.id && d.locale === locale ? { ...d, status: 'error', error: result.error, useful: false } : d
              ));
            } else if (result.text) {
              const p = currentSession.projects.find(p => p.id === result.id)!;
              const aiReview: ProjectAiReview = {
                generationId: `gen_${Date.now()}_${Math.random().toString(36).substring(2,9)}`,
                projectId: p.id,
                source: externalConfig ? 'external' : 'managed',
                requestedProvider: result.provider || 'cloudflare',
                usedProvider: result.provider || 'cloudflare',
                model: 'translation',
                locale: locale,
                originalDescription: p.description,
                generatedDescription: result.text,
                status: 'approved',
                generatedAt: new Date().toISOString(),
              };
              saveProjectAiReview(p.id, locale, aiReview);
              setActiveGenerationDrafts(prev => prev.map(d => 
                d.projectId === result.id && d.locale === locale ? { ...d, status: 'completed', useful: true, suggestedDescription: result.text } : d
              ));
            }
          });
        } catch (err: any) {
          setActiveGenerationDrafts(prev => prev.map(d => 
            localePairs.some(b => b.projectId === d.projectId && b.locale === d.locale) ? { ...d, status: 'error', error: err.message, useful: false } : d
          ));
        }
      }
    }
    
    setStep('review-projects');
  };

  const generateProfileSuggestion = async () => {
    setStep('generating-profile');
    
    const initialProfileDrafts: Record<string, ProfileAiDraft> = {};
    selectedLocales.forEach(locale => {
      initialProfileDrafts[locale] = {
        originalDescription: session.profile.bio,
        status: 'generating',
        approved: false, // will auto approve on success
      };
    });
    setActiveProfileDrafts(initialProfileDrafts);

    const techNames = session.skills.filter(s => s.selected).map(s => s.name);
    const defaultLang = session.languageSettings.defaultLanguage as 'pt-BR' | 'en';

    const currentSession = usePortfolioStore.getState().session;
    
    // Only send the currently approved/selected project text
    const projectsToSend = currentSession.projects.filter(p => {
      // Must be selected and have an AI review in defaultLang
      return p.selected && p.aiReviewsByLocale && p.aiReviewsByLocale[defaultLang];
    }).map(p => {
      const review = p.aiReviewsByLocale![defaultLang];
      const textToUse = review.status === 'approved' ? review.generatedDescription : p.description;
      return {
        id: p.id,
        name: p.title,
        summary: textToUse || p.description,
        technologies: p.technologies
      };
    });

    try {
      const response = await AiClient.suggestProfile({
        sourceLocale: defaultLang,
        targetLocales: selectedLocales as Array<'pt-BR' | 'en'>,
        projects: projectsToSend,
        currentProfile: {
          descriptions: {
            [defaultLang]: currentSession.profile.bio
          }
        }
      });

      if (response.error) throw new Error(response.error);

      const suggestions = response.suggestions;
      
      const updatedDrafts: Record<string, ProfileAiDraft> = {};
      
      selectedLocales.forEach(locale => {
        const text = suggestions[locale as 'pt-BR' | 'en'];
        if (text) {
          const profileAiDesc: ProfileAiDescription = {
            locale,
            originalText: currentSession.profile.bio,
            generatedText: text,
            status: 'approved' // auto approve
          };
          saveProfileAiDescription(locale, profileAiDesc);
          updatedDrafts[locale] = {
            originalDescription: currentSession.profile.bio,
            suggestedDescription: text,
            status: 'completed',
            approved: true,
          };
        } else {
          updatedDrafts[locale] = {
            originalDescription: currentSession.profile.bio,
            status: 'error',
            approved: false,
          };
        }
      });
      
      setActiveProfileDrafts(updatedDrafts);

    } catch (err: any) {
      console.error('Error generating profile:', err);
      const failedDrafts: Record<string, ProfileAiDraft> = {};
      selectedLocales.forEach(locale => {
        failedDrafts[locale] = {
          originalDescription: currentSession.profile.bio,
          status: 'error',
          approved: false,
        };
      });
      setActiveProfileDrafts(failedDrafts);
    }

    setStep('review-profile');
  };

  const toggleProjectSelection = (projectId: string, locale: string) => {
    setSelectedPairs(prev => {
      const exists = prev.some(p => p.projectId === projectId && p.locale === locale);
      if (exists) {
        return prev.filter(p => !(p.projectId === projectId && p.locale === locale));
      }
      if (prev.length >= 10 && mode === 'free') return prev; 
      return [...prev, { projectId, locale }];
    });
  };

  const cancelFlow = () => {
    setStep('idle');
    setMode(null);
    setActiveGenerationDrafts([]);
    setActiveProfileDrafts({});
  };

  return {
    step,
    setStep,
    mode,
    missingPairs,
    selectedPairs,
    projectDrafts: activeGenerationDrafts,
    profileDrafts: activeProfileDrafts,
    
    selectMode,
    toggleProjectSelection,
    confirmProjectLimit,
    generateProfileSuggestion,
    cancelFlow,
    startExternalGeneration,
  };
}
