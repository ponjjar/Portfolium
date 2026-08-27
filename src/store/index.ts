import { create } from 'zustand';
import { PortfolioSession, Project, Skill, Profile, Theme } from '../domain/portfolio/types';
import { PortfolioSessionSchema } from '../domain/portfolio/schema';
import { saveSession } from '../storage';

interface PortfolioState {
  session: PortfolioSession;
  
  // Actions
  updateProfile: (profile: Partial<Profile>) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (projects: Project[]) => void;
  setSkills: (skills: Skill[]) => void;
  toggleSkill: (id: string) => void;
  setTheme: (theme: Partial<Theme>) => void;
  importSession: (sessionJson: unknown) => boolean;
  resetSession: () => void;
}

const defaultSession: PortfolioSession = PortfolioSessionSchema.parse({});

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  session: defaultSession,

  updateProfile: (profileUpdate) => {
    set((state) => {
      const newSession = {
        ...state.session,
        profile: { ...state.session.profile, ...profileUpdate },
      };
      saveSession(newSession);
      return { session: newSession };
    });
  },

  addProject: (project) => {
    set((state) => {
      const newSession = {
        ...state.session,
        projects: [...state.session.projects, project],
      };
      saveSession(newSession);
      return { session: newSession };
    });
  },

  updateProject: (id, projectUpdate) => {
    set((state) => {
      const newSession = {
        ...state.session,
        projects: state.session.projects.map((p) =>
          p.id === id ? { ...p, ...projectUpdate } : p
        ),
      };
      saveSession(newSession);
      return { session: newSession };
    });
  },

  removeProject: (id) => {
    set((state) => {
      const newSession = {
        ...state.session,
        projects: state.session.projects.filter((p) => p.id !== id),
      };
      saveSession(newSession);
      return { session: newSession };
    });
  },

  reorderProjects: (projects) => {
    set((state) => {
      const newSession = {
        ...state.session,
        projects,
      };
      saveSession(newSession);
      return { session: newSession };
    });
  },

  setSkills: (skills) => {
    set((state) => {
      const newSession = {
        ...state.session,
        skills,
      };
      saveSession(newSession);
      return { session: newSession };
    });
  },

  toggleSkill: (id) => {
    set((state) => {
      const newSession = {
        ...state.session,
        skills: state.session.skills.map((s) =>
          s.id === id ? { ...s, selected: !s.selected } : s
        ),
      };
      saveSession(newSession);
      return { session: newSession };
    });
  },

  setTheme: (themeUpdate) => {
    set((state) => {
      const newSession = {
        ...state.session,
        theme: { ...state.session.theme, ...themeUpdate },
      };
      saveSession(newSession);
      return { session: newSession };
    });
  },

  importSession: (sessionJson: unknown) => {
    const result = PortfolioSessionSchema.safeParse(sessionJson);
    if (result.success) {
      set({ session: result.data });
      saveSession(result.data);
      return true;
    }
    return false;
  },

  resetSession: () => {
    set({ session: defaultSession });
    saveSession(defaultSession);
  },
}));
