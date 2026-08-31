import { create } from 'zustand';
import { PortfolioSession, Project, Skill, Profile, Theme, PortfolioConfig, SocialLink } from '../domain/portfolio/types';
import { PortfolioSessionSchema } from '../domain/portfolio/schema';
import { saveSession } from '../storage';

interface PortfolioState {
  session: PortfolioSession;
  
  // Actions
  updateProfile: (profile: Partial<Profile>) => void;
  updateSocialLinks: (links: SocialLink[]) => void;
  addCustomSkillCategory: (category: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (projects: Project[]) => void;
  setSkills: (skills: Skill[]) => void;
  toggleSkill: (id: string) => void;
  updateConfig: (config: Partial<PortfolioConfig>) => void;
  updateTheme: (theme: Partial<Theme>) => void;
  importSession: (sessionJson: unknown) => boolean;
  resetSession: () => void;
  aggregateSkills: () => void;
  updateAiConfig: (updates: any) => void;
  saveProjectAiReview: (projectId: any, locale: any, review: any) => void;
  saveProfileAiDescription: (locale: any, description: any) => void;
  approveProjectAiReview: (projectId: any, locale: any) => void;
  rejectProjectAiReview: (projectId: any, locale: any) => void;
  deleteProjectAiReview: (projectId: any, locale: any) => void;
  approveProfileAiDescription: (locale: any) => void;
  rejectProfileAiDescription: (locale: any) => void;
  finalizeAiChanges: () => void;
  updateLanguageSettings: (settings: any) => void;
}

export const getInitialSession = (): PortfolioSession => {
  const session = PortfolioSessionSchema.parse({});
  session.metadata.createdAt = new Date().toISOString();
  session.metadata.updatedAt = new Date().toISOString();
  return session;
};

const defaultSession = getInitialSession();

function normalizeLocale(locale: string): 'pt-BR' | 'en' {
  const normalized = locale.trim().toLowerCase().replace('_', '-');
  if (normalized === 'pt' || normalized === 'pt-br') {
    return 'pt-BR';
  }
  return 'en';
}

export const usePortfolioStore = create<PortfolioState>((set, get) => {
  const updateSession = (updater: (session: PortfolioSession) => PortfolioSession) => {
    set((state) => {
      const updated = updater(state.session);
      updated.metadata.updatedAt = new Date().toISOString();
      return { session: updated };
    });
  };

  return {
    session: defaultSession,

    updateProfile: (profileUpdate) => {
      updateSession((session) => ({
        ...session,
        profile: { ...session.profile, ...profileUpdate },
      }));
    },

    updateLanguageSettings: (settingsUpdate: any) => {
      updateSession((session) => ({
        ...session,
        languageSettings: { ...session.languageSettings, ...settingsUpdate },
      }));
    },

    updateSocialLinks: (links) => {
      updateSession((session) => ({
        ...session,
        socialLinks: links,
      }));
    },

    addCustomSkillCategory: (category) => {
      updateSession((session) => {
        // Prevent duplicates case-insensitively
        const exists = session.customSkillCategories.some(
          c => c.toLowerCase() === category.toLowerCase()
        );
        if (exists) return session;
        
        return {
          ...session,
          customSkillCategories: [...session.customSkillCategories, category],
        };
      });
    },

    addProject: (project) => {
      updateSession((session) => ({
        ...session,
        projects: [...session.projects, project],
      }));
    },

    updateProject: (id, projectUpdate) => {
      updateSession((session) => ({
        ...session,
        projects: session.projects.map((p) =>
          p.id === id ? { ...p, ...projectUpdate } : p
        ),
      }));
    },

    removeProject: (id) => {
      updateSession((session) => ({
        ...session,
        projects: session.projects.filter((p) => p.id !== id),
      }));
    },

    reorderProjects: (projects) => {
      updateSession((session) => ({
        ...session,
        projects,
      }));
    },

    setSkills: (skills) => {
      updateSession((session) => ({
        ...session,
        skills,
      }));
    },

    toggleSkill: (id) => {
      updateSession((session) => ({
        ...session,
        skills: session.skills.map((s) =>
          s.id === id ? { ...s, selected: !s.selected } : s
        ),
      }));
    },

    updateConfig: (configUpdate) => {
      updateSession((session) => ({
        ...session,
        portfolio: { ...session.portfolio, ...configUpdate },
      }));
    },

    updateTheme: (themeUpdate) => {
      updateSession((session) => ({
        ...session,
        portfolio: {
          ...session.portfolio,
          theme: { ...session.portfolio.theme, ...themeUpdate },
        },
      }));
    },

    importSession: (sessionJson: unknown) => {
      // Basic migration for old aiReview to aiReviewsByLocale
      const asAny = sessionJson as any;
      if (asAny?.projects && Array.isArray(asAny.projects)) {
        asAny.projects.forEach((p: any) => {
          if (p.aiReview && !p.aiReviewsByLocale) {
            const l = normalizeLocale(p.aiReview.locale || 'pt-BR');
            p.aiReviewsByLocale = {
              [l]: p.aiReview
            };
            delete p.aiReview;
          }
          if (p.aiReviewsByLocale) {
            const newReviews: any = {};
            for (const [key, value] of Object.entries(p.aiReviewsByLocale)) {
              const normKey = normalizeLocale(key);
              if (!newReviews[normKey]) {
                newReviews[normKey] = value;
                newReviews[normKey].locale = normKey;
              } else if (key === 'pt-BR') {
                // pt-BR takes precedence over pt
                newReviews[normKey] = value;
                newReviews[normKey].locale = normKey;
              }
            }
            p.aiReviewsByLocale = newReviews;
          }
        });
      }
      
      if (asAny?.profile?.aiDescriptionsByLocale) {
        const newDescs: any = {};
        for (const [key, value] of Object.entries(asAny.profile.aiDescriptionsByLocale)) {
          const normKey = normalizeLocale(key);
          if (!newDescs[normKey]) {
            newDescs[normKey] = value;
            newDescs[normKey].locale = normKey;
          } else if (key === 'pt-BR') {
            newDescs[normKey] = value;
            newDescs[normKey].locale = normKey;
          }
        }
        asAny.profile.aiDescriptionsByLocale = newDescs;
      }
      
      if (asAny?.languageSettings) {
        asAny.languageSettings.defaultLanguage = normalizeLocale(asAny.languageSettings.defaultLanguage);
        if (Array.isArray(asAny.languageSettings.supportedLanguages)) {
          const unique = new Set(asAny.languageSettings.supportedLanguages.map(normalizeLocale));
          asAny.languageSettings.supportedLanguages = Array.from(unique);
        }
      }

      const result = PortfolioSessionSchema.safeParse(sessionJson);
      if (result.success) {
        set({ session: result.data });
        saveSession(result.data); // Immediate save on import
        return true;
      }
      return false;
    },

    resetSession: () => {
      const newSession = getInitialSession();
      set({ session: newSession });
      saveSession(newSession); // Immediate save on reset
    },

    aggregateSkills: () => {
      updateSession((session) => {
        const skillsMap = new Map<string, { id: string; name: string; category: string; sources: Set<string>; selected: boolean }>();

        // Pre-populate with existing skills to preserve user edits (like selected state or category changes)
        session.skills.forEach(skill => {
          skillsMap.set(skill.name.toLowerCase(), {
            ...skill,
            sources: new Set(skill.sources) // Convert back to set for easy adding
          });
        });

        // Loop through all projects and technologies
        session.projects.forEach(project => {
          project.technologies.forEach(tech => {
            const key = tech.toLowerCase();
            if (skillsMap.has(key)) {
              const existing = skillsMap.get(key)!;
              existing.sources.add(project.id);
            } else {
              skillsMap.set(key, {
                id: `skill_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                name: tech,
                category: 'other' as any,
                sources: new Set([project.id]),
                selected: true,
              });
            }
          });
        });

        // Convert map back to array
        const aggregatedSkills: Skill[] = (Array.from(skillsMap.values()) as any[]).map(s => ({
          ...s,
          sources: Array.from(s.sources),
        }));

        return { ...session, skills: aggregatedSkills };
      });
    },

    updateAiConfig: (updates) => {
      updateSession((session) => {
        return { ...session, aiConfig: { ...(session as any).aiConfig, ...updates } as any };
      });
    },

    saveProjectAiReview: (projectId: any, locale: any, aiReview: any) => {
      updateSession((session) => ({
        ...session,
        projects: session.projects.map((p) => {
          if (p.id === projectId) {
            return {
              ...p,
              aiReviewsByLocale: {
                ...(p.aiReviewsByLocale || {}),
                [locale]: aiReview
              }
            };
          }
          return p;
        }),
      }));
    },

    deleteProjectAiReview: (projectId: any, locale: any) => {
      updateSession((session) => ({
        ...session,
        projects: session.projects.map((p) => {
          if (p.id === projectId && p.aiReviewsByLocale && p.aiReviewsByLocale[locale]) {
            const originalDesc = p.aiReviewsByLocale[locale].originalDescription;
            const newP = { ...p, description: originalDesc };
            const newReviews = { ...newP.aiReviewsByLocale };
            delete newReviews[locale];
            newP.aiReviewsByLocale = newReviews;
            return newP;
          }
          return p;
        }),
      }));
    },

    approveProjectAiReview: (projectId: any, locale: any) => {
      updateSession((session) => ({
        ...session,
        projects: session.projects.map((p) => {
          if (p.id === projectId && p.aiReviewsByLocale && p.aiReviewsByLocale[locale]) {
            return {
              ...p,
              aiReviewsByLocale: {
                ...p.aiReviewsByLocale,
                [locale]: { ...p.aiReviewsByLocale[locale], status: 'approved' }
              }
            };
          }
          return p;
        }),
      }));
    },

    rejectProjectAiReview: (projectId: any, locale: any) => {
      updateSession((session) => ({
        ...session,
        projects: session.projects.map((p) => {
          if (p.id === projectId && p.aiReviewsByLocale && p.aiReviewsByLocale[locale]) {
            return {
              ...p,
              aiReviewsByLocale: {
                ...p.aiReviewsByLocale,
                [locale]: { ...p.aiReviewsByLocale[locale], status: 'rejected' }
              }
            };
          }
          return p;
        }),
      }));
    },

    saveProfileAiDescription: (locale: any, description: any) => {
      updateSession((session) => ({
        ...session,
        profile: {
          ...session.profile,
          aiDescriptionsByLocale: {
            ...(session.profile.aiDescriptionsByLocale || {}),
            [locale]: description
          }
        }
      }));
    },

    approveProfileAiDescription: (locale: any) => {
      updateSession((session) => {
        if (!session.profile.aiDescriptionsByLocale || !session.profile.aiDescriptionsByLocale[locale]) {
          return session;
        }
        return {
          ...session,
          profile: {
            ...session.profile,
            bio: session.profile.aiDescriptionsByLocale[locale].generatedText,
            aiDescriptionsByLocale: {
              ...session.profile.aiDescriptionsByLocale,
              [locale]: {
                ...session.profile.aiDescriptionsByLocale[locale],
                status: 'approved'
              }
            }
          }
        };
      });
    },

    rejectProfileAiDescription: (locale: any) => {
      updateSession((session) => {
        if (!session.profile.aiDescriptionsByLocale || !session.profile.aiDescriptionsByLocale[locale]) {
          return session;
        }
        return {
          ...session,
          profile: {
            ...session.profile,
            bio: session.profile.aiDescriptionsByLocale[locale].originalText,
            aiDescriptionsByLocale: {
              ...session.profile.aiDescriptionsByLocale,
              [locale]: {
                ...session.profile.aiDescriptionsByLocale[locale],
                status: 'rejected'
              }
            }
          }
        };
      });
    },

    finalizeAiChanges: () => {
      updateSession((session) => {
        const defaultLang = session.languageSettings.defaultLanguage;
        
        // 1. Update project descriptions
        const newProjects = session.projects.map(p => {
          if (p.aiReviewsByLocale && p.aiReviewsByLocale[defaultLang] && p.aiReviewsByLocale[defaultLang].status === 'approved') {
            return {
              ...p,
              description: p.aiReviewsByLocale[defaultLang].generatedDescription,
            };
          }
          return p;
        });

        // 2. Update profile bio
        let newBio = session.profile.bio;
        if (session.profile.aiDescriptionsByLocale && session.profile.aiDescriptionsByLocale[defaultLang] && session.profile.aiDescriptionsByLocale[defaultLang].status === 'approved') {
          newBio = session.profile.aiDescriptionsByLocale[defaultLang].generatedText;
        }

        return {
          ...session,
          projects: newProjects,
          profile: {
            ...session.profile,
            bio: newBio
          }
        }
        return { ...session, projects: newProjects, profile: { ...session.profile, bio: newBio } };
      });
    },
  };
});



export const getManagedAiUsage = (session: PortfolioSession) => {
  const managedUsed = session.projects.reduce(
    (total, project) =>
      total +
      Object.values(project.aiReviewsByLocale ?? {}).filter(
        (review) => review.source === 'managed'
      ).length,
    0
  );
  const managedRemaining = Math.max(0, 10 - managedUsed);
  return { managedUsed, managedRemaining };
};

// Implement autosave with debounce
let saveTimeout: ReturnType<typeof setTimeout> | null = null;
usePortfolioStore.subscribe((state, prevState) => {
  if (state.session !== prevState.session) {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    saveTimeout = setTimeout(() => {
      saveSession(state.session);
    }, 500);
  }
});
