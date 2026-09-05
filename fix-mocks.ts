import fs from 'fs';
import path from 'path';

const mockReplacement = `const defaultMockPortfolio = {
    profile: {
      name: 'John Doe',
      headline: 'Frontend Developer',
      bio: 'A passionate developer.',
      avatar: { url: 'https://example.com/avatar.jpg' },
      location: 'New York, USA',
      email: 'john@example.com',
    },
    experiences: [],
    education: [],
    skills: [
      { id: '1', name: 'React', category: 'frontend', level: 'advanced' as any, icon: '' },
      { id: '2', name: 'Node.js', category: 'backend', level: 'intermediate' as any, icon: '' },
    ],
    projects: [
      {
        id: '1',
        title: 'Project 1',
        description: 'First project',
        shortDescription: 'First',
        technologies: ['React'],
        links: { demo: 'https://demo.com', repository: 'https://github.com/john/1' },
        featured: true,
        source: { type: 'manual' as any },
        selected: true,
        order: 0,
      },
    ],
    socialLinks: [
      { type: 'github' as any, label: 'GitHub', url: 'https://github.com/john' },
      { type: 'linkedin' as any, label: 'LinkedIn', url: 'https://linkedin.com/in/john' },
    ],
    layout: {
      profile: {
        variant: 'stacked-center' as any,
        cornerItemsOrder: ['name' as any, 'links' as any, 'headline' as any],
        embedsTechnologies: false,
        avatarStyle: { shape: 'circle' as any, border: 'subtle' as any, effect: 'none' as any },
        zones: {
          center: 'avatar',
          topLeft: 'name',
          topRight: 'headline',
          left: 'links',
          right: '',
          topCenter: '',
          bottomLeft: 'description',
          bottomRight: 'technologies',
        },
      },
      skills: { placement: 'separate-section' as any, grouping: 'none' as any, collapsedRows: 5 },
      projects: {
        columns: 2,
        cardStyle: 'banner-card' as any,
        carousel: {
          enabled: false,
          autoplay: true,
          intervalMs: 3000,
          paginationDots: true,
        },
      },
      career: { layout: 'stacked' as any, sharedEntryStyle: true, entryStyle: 'timeline' as any, experienceStyle: 'timeline' as any, educationStyle: 'timeline' as any, defaultTab: 'experience' as any },
      header: {
        enabled: false,
        showNavigation: true,
        showName: true,
        showAvatar: true,
        namePosition: 'left' as any,
      },
    },
    animations: {
      enabled: false,
      intensity: 'subtle' as any,
      sectionReveal: false,
      cardHover: true,
      chipStagger: true,
      backgroundParallax: false,
      parallax: false,
      parallaxIntensity: 'subtle' as any,
    },
    navigation: {
      enabled: false,
    },
    sections: [
      { id: 'hero' as any, visible: true, order: 0 },
    ],
    ...overrides,
  };`;

function fixFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/\{[\s\S]*?profile:\s*\{[\s\S]*?\.\.\.overrides,\s*\}/, mockReplacement);
  
  if (filePath.includes('htmlSecurity.test.ts')) {
    content = content.replace(/\{[\s\S]*?id: '1',[\s\S]*?title: 'Test Project',[\s\S]*?featured: true,[\s\S]*?\}/, `{
        id: '1', title: 'Test Project', description: 'desc', shortDescription: 'desc', technologies: [], links: { demo: '', repository: '' }, featured: true, source: { type: 'manual' as any }, selected: true, order: 0
    }`);
  }
  
  fs.writeFileSync(filePath, content);
}

['tests/templates/layoutVariants.test.ts', 'tests/templates/visualTheme.test.ts', 'tests/templates/htmlSecurity.test.ts'].forEach(fixFile);
