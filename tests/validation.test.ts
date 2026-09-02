import { 
  isProfileComplete, 
  isProjectsComplete, 
  isSkillsComplete, 
  getFirstIncompleteStep 
} from '../src/domain/portfolio/validation';
import { PortfolioSession } from '../src/domain/portfolio/types';
import { PortfolioConfigSchema } from '../src/domain/portfolio/schema';

describe('Validation', () => {
  let session: PortfolioSession;

  beforeEach(() => {
    // Basic valid session scaffold
    session = {
      schemaVersion: 1,
      app: { name: 'Portfolio Builder', version: '1.0.0' },
      profile: {
        name: 'Test Name',
        headline: 'Test Headline',
        bio: 'Test Bio'
      },
      socialLinks: [],
      customSkillCategories: [],
      projects: [
        {
          id: 'p1',
          title: 'Project 1',
          description: 'Desc 1',
          shortDescription: '',
          source: { type: 'manual' },
          links: {},
          technologies: [],
          selected: true,
          featured: false,
          order: 0,
        }
      ],
      skills: [
        { id: 's1', name: 'Skill 1', category: 'Other', selected: true, sources: [] }
      ],
      skillGroups: [],
      portfolio: PortfolioConfigSchema.parse({
        template: 'minimal',
        theme: { mode: 'dark', accent: '#fff' },
        sections: [],
        settings: {
          showAvatar: true,
          showProjectImages: true,
          showGitHubLinks: true,
          showSkillCategories: true,
        }
      }),
      ai: { used: false, provider: null, mode: null, changes: { profileBio: false, projectDescriptions: [] } },
      metadata: { createdAt: '', updatedAt: '', language: 'en', generator: '' }
    };
  });

  describe('isProfileComplete', () => {
    it('returns true when profile is complete', () => {
      expect(isProfileComplete(session)).toBe(true);
    });

    it('returns false when name is missing', () => {
      session.profile.name = '';
      expect(isProfileComplete(session)).toBe(false);
    });
  });

  describe('isProjectsComplete', () => {
    it('returns true when at least one selected project is valid', () => {
      expect(isProjectsComplete(session)).toBe(true);
    });

    it('returns false when no projects are selected', () => {
      session.projects[0].selected = false;
      expect(isProjectsComplete(session)).toBe(false);
    });

    it('returns false when selected project is missing title', () => {
      session.projects[0].title = '';
      expect(isProjectsComplete(session)).toBe(false);
    });
  });

  describe('isSkillsComplete', () => {
    it('returns true when at least one skill is selected', () => {
      expect(isSkillsComplete(session)).toBe(true);
    });

    it('returns false when no skills are selected', () => {
      session.skills[0].selected = false;
      expect(isSkillsComplete(session)).toBe(false);
    });
  });

  describe('getFirstIncompleteStep', () => {
    it('returns null when all steps are complete', () => {
      expect(getFirstIncompleteStep(session)).toBeNull();
    });

    it('returns profile if profile is incomplete', () => {
      session.profile.name = '';
      expect(getFirstIncompleteStep(session)).toBe('profile');
    });

    it('returns projects if projects are incomplete', () => {
      session.projects[0].selected = false;
      expect(getFirstIncompleteStep(session)).toBe('projects');
    });

    it('returns skills if skills are incomplete', () => {
      session.skills[0].selected = false;
      expect(getFirstIncompleteStep(session)).toBe('skills');
    });
  });
});
