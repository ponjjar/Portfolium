import { generateMarkdownResume } from '@/utils/export';
import { PortfolioSessionSchema } from '@/domain/portfolio/schema';

describe('Export Utilities & Markdown Generator', () => {
  const mockSession = PortfolioSessionSchema.parse({
    profile: {
      name: 'Ada Lovelace',
      headline: 'First Computer Programmer',
      bio: 'Pioneered computational algorithms and analytical engines.',
      location: 'London, UK',
      email: 'ada@computing.org',
    },
    socialLinks: [
      { type: 'github', label: 'GitHub', url: 'https://github.com/ada' },
      { type: 'website', label: 'Website', url: 'https://ada.io' },
    ],
    projects: [
      {
        id: 'p1',
        title: 'Analytical Engine Algorithms',
        description: 'First algorithm intended for execution by a machine.',
        shortDescription: 'The first algorithm in history.',
        source: { type: 'manual' },
        links: {
          repository: 'https://github.com/ada/engine',
          demo: 'https://ada.io/engine',
        },
        technologies: ['Punched Cards', 'Assembly', 'Mathematics'],
        selected: true,
        featured: true,
        order: 0,
      },
      {
        id: 'p2',
        title: 'Unselected Draft',
        description: 'Should not appear in export',
        shortDescription: 'Draft',
        source: { type: 'manual' },
        links: {},
        technologies: [],
        selected: false,
        featured: false,
        order: 1,
      },
    ],
    skills: [
      { id: 's1', name: 'Mathematics', category: 'Theory', selected: true, sources: [] },
      { id: 's2', name: 'Algorithm Design', category: 'Engineering', selected: true, sources: [] },
      { id: 's3', name: 'Ignored Skill', category: 'Misc', selected: false, sources: [] },
    ],
  });

  it('generates rich, valid markdown resume with profile and selected projects/skills', () => {
    const md = generateMarkdownResume(mockSession);

    // Profile Assertions
    expect(md).toContain('# Ada Lovelace');
    expect(md).toContain('**First Computer Programmer**');
    expect(md).toContain('ada@computing.org');
    expect(md).toContain('📍 London, UK');
    expect(md).toContain('[GitHub](https://github.com/ada)');
    expect(md).toContain('[Website](https://ada.io)');
    expect(md).toContain('Pioneered computational algorithms and analytical engines.');

    // Skills Assertions
    expect(md).toContain('## Technical Skills');
    expect(md).toContain('Mathematics');
    expect(md).toContain('Algorithm Design');
    expect(md).not.toContain('Ignored Skill');

    // Projects Assertions
    expect(md).toContain('## Featured Projects');
    expect(md).toContain('### Analytical Engine Algorithms');
    expect(md).toContain('[Live Demo](https://ada.io/engine)');
    expect(md).toContain('[Source Code](https://github.com/ada/engine)');
    expect(md).toContain('**Stack:** Punched Cards, Assembly, Mathematics');
    expect(md).not.toContain('Unselected Draft');
  });

  it('handles empty or minimal session gracefully without crashing or orphan delimiters', () => {
    const minimalSession = PortfolioSessionSchema.parse({});

    const md = generateMarkdownResume(minimalSession);
    expect(md).toContain('# Software Developer');
    expect(md).not.toContain('undefined');
    expect(md).not.toContain('null');
    expect(md).toContain('Portfolium');
  });
});
