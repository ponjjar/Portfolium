import { create } from 'zustand';
import { PortfolioSession, Project, Skill, Profile, Theme, PortfolioConfig, SocialLink } from '../domain/portfolio/types';
import { PortfolioSessionSchema } from '../domain/portfolio/schema';
import { saveSession } from '../storage';

interface PortfolioState {
  session: PortfolioSession;
  
  // Actions
  updateProfile: (profile: Partial<Profile>) => void;
  updateSocialLinks: (links: SocialLink[]) => void;
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
}

const getInitialSession = (): PortfolioSession => {
  const session = PortfolioSessionSchema.parse({});
  session.metadata.createdAt = new Date().toISOString();
  session.metadata.updatedAt = new Date().toISOString();
  return session;
};

const defaultSession = getInitialSession();

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

    updateSocialLinks: (links) => {
      updateSession((session) => ({
        ...session,
        socialLinks: links,
      }));
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
                category: 'Other',
                sources: new Set([project.id]),
                selected: true,
              });
            }
          });
        });

        // Convert map back to array
        const aggregatedSkills: Skill[] = Array.from(skillsMap.values()).map(s => ({
          ...s,
          sources: Array.from(s.sources),
        }));

        return { ...session, skills: aggregatedSkills };
      });
    },
  };
});

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
