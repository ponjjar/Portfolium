import { PortfolioSession } from './types';

export function isProfileComplete(session: PortfolioSession): boolean {
  if (!session.profile) return false;
  
  const { name, headline, bio } = session.profile;
  if (!name || name.trim() === '') return false;
  if (!headline || headline.trim() === '') return false;
  if (!bio || bio.trim() === '') return false;
  
  return true;
}

export function isProjectsComplete(session: PortfolioSession): boolean {
  if (!session.projects || session.projects.length === 0) return false;

  // Has at least one selected project
  const selectedProjects = session.projects.filter(p => p.selected);
  if (selectedProjects.length === 0) return false;

  // Check if at least one selected project is valid (has title and description)
  // Or check if all selected projects are valid? "Para continuar, deve existir pelo menos 1 projeto selecionado. Um projeto válido precisa possuir pelo menos título e descrição"
  // Let's enforce that ALL selected projects must be valid, or at least one is valid and the rest can be incomplete?
  // "Se existe projeto incompleto: mostrar claramente dentro daquele projeto. Não bloquear toda a aplicação por campos opcionais."
  // Wait, the instruction says: "Para continuar, deve existir pelo menos: 1 projeto selecionado. Um projeto válido precisa possuir pelo menos: título, descrição."
  
  return selectedProjects.some(p => p.title.trim() !== '' && p.description.trim() !== '');
}

export function getIncompleteProjects(session: PortfolioSession): string[] {
  // Returns IDs of selected projects that are missing title or description
  return session.projects
    .filter(p => p.selected && (p.title.trim() === '' || p.description.trim() === ''))
    .map(p => p.id);
}

export function isSkillsComplete(session: PortfolioSession): boolean {
  if (!session.skills || session.skills.length === 0) return false;
  
  return session.skills.some(s => s.selected);
}

export type WizardStep = 'profile' | 'projects' | 'skills' | 'ai' | 'editor';

export function getFirstIncompleteStep(session: PortfolioSession): WizardStep | null {
  if (!isProfileComplete(session)) return 'profile';
  if (!isProjectsComplete(session)) return 'projects';
  if (getIncompleteProjects(session).length > 0) return 'projects'; // Force them to fix incomplete selected projects
  if (!isSkillsComplete(session)) return 'skills';
  
  return null;
}
