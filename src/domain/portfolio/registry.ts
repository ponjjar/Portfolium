import { User, Briefcase, Code } from 'lucide-react-native';

export type SectionId = 'hero' | 'projects' | 'skills' | 'career' | 'contact';

export interface SectionRegistryEntry {
  id: SectionId;
  labelKey: string;
  icon: any;
  defaultVisible: boolean;
  defaultOrder: number;
  wizardRoute: string;
  hasLayoutModal: boolean;
}

export const SECTION_REGISTRY: Record<SectionId, SectionRegistryEntry> = {
  hero: {
    id: 'hero',
    labelKey: 'portfolio.sections.about',
    icon: User,
    defaultVisible: true,
    defaultOrder: 0,
    wizardRoute: '/(wizard)/profile',
    hasLayoutModal: true,
  },
  projects: {
    id: 'projects',
    labelKey: 'portfolio.sections.projects',
    icon: Briefcase,
    defaultVisible: true,
    defaultOrder: 1,
    wizardRoute: '/(wizard)/projects',
    hasLayoutModal: true,
  },
  skills: {
    id: 'skills',
    labelKey: 'portfolio.sections.skills',
    icon: Code,
    defaultVisible: true,
    defaultOrder: 2,
    wizardRoute: '/(wizard)/skills',
    hasLayoutModal: true,
  },
  career: {
    id: 'career',
    labelKey: 'editor.careerLayout.title',
    icon: Briefcase,
    defaultVisible: true,
    defaultOrder: 3,
    wizardRoute: '/(wizard)/experience',
    hasLayoutModal: true,
  },
  contact: {
    id: 'contact',
    labelKey: 'portfolio.sections.contact',
    icon: User,
    defaultVisible: true,
    defaultOrder: 4,
    wizardRoute: '/(wizard)/profile',
    hasLayoutModal: false,
  },
};

export const DEFAULT_SECTIONS = Object.values(SECTION_REGISTRY)
  .sort((a, b) => a.defaultOrder - b.defaultOrder)
  .map(s => ({
    id: s.id as any,
    visible: s.defaultVisible,
    order: s.defaultOrder,
  }));
