import { PortfolioSession, Project, Skill, SkillGroup } from '../domain/portfolio/types';
import { PortfolioSectionSchema } from '../domain/portfolio/schema';
import { z } from 'zod';

export interface PortfolioViewModel {
  profile: PortfolioSession['profile'];
  socialLinks: PortfolioSession['socialLinks'];
  projects: Project[];
  skills: Skill[];
  skillGroups: SkillGroup[];
  theme: PortfolioSession['portfolio']['theme'];
  sections: PortfolioSession['portfolio']['sections'];
  settings: PortfolioSession['portfolio']['settings'];
}

export function buildPortfolioViewModel(session: PortfolioSession): PortfolioViewModel {
  // Sort and filter sections
  const validSections = [...session.portfolio.sections]
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order);

  // Filter and sort projects
  const validProjects = session.projects
    .filter(p => p.selected)
    .sort((a, b) => a.order - b.order);

  // Filter skills
  const validSkills = session.skills.filter(s => s.selected);

  return {
    profile: session.profile,
    socialLinks: session.socialLinks,
    projects: validProjects,
    skills: validSkills,
    skillGroups: session.skillGroups,
    theme: session.portfolio.theme,
    sections: validSections,
    settings: session.portfolio.settings,
  };
}
