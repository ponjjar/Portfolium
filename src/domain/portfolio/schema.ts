import { z } from 'zod';

export const PortfolioImageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('url'),
    value: z.string(),
    source: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  }),
  z.object({
    type: z.literal('embedded'),
    value: z.string(), // base64 data URL
    source: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  }),
]);

export const SocialLinkSchema = z.object({
  type: z.string(),
  label: z.string(),
  url: z.string(),
});

export const ProfileSchema = z.object({
  name: z.string().default(''),
  headline: z.string().default(''),
  bio: z.string().default(''),
  avatar: PortfolioImageSchema.optional(),
  location: z.string().optional(),
  email: z.string().optional(),
});

export const ProjectSourceSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('manual'),
  }),
  z.object({
    type: z.literal('github'),
    repository: z.object({
      owner: z.string(),
      name: z.string(),
      url: z.string(),
      defaultBranch: z.string().optional(),
    }),
  }),
]);

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().default(''),
  description: z.string().default(''),
  shortDescription: z.string().default(''),
  source: ProjectSourceSchema,
  links: z.object({
    repository: z.string().optional(),
    demo: z.string().optional(),
  }).default({}),
  image: PortfolioImageSchema.optional(),
  technologies: z.array(z.string()).default([]),
  githubMetadata: z.object({
    primaryLanguage: z.string().optional(),
    topics: z.array(z.string()).default([]),
    stars: z.number().optional(),
    readmeFound: z.boolean().optional(),
    rawReadme: z.string().optional(),
  }).optional(),
  selected: z.boolean().default(true),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().default('Other'),
  selected: z.boolean().default(true),
  sources: z.array(z.string()).default([]), // Project IDs
});

export const SkillGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  skills: z.array(z.string()), // Skill IDs
  order: z.number().default(0),
});

export const ThemeSchema = z.object({
  mode: z.enum(['light', 'dark']).default('dark'),
  accent: z.string().default('#FFFFFF'),
});

export const PortfolioSectionSchema = z.object({
  id: z.enum(['hero', 'projects', 'skills', 'experience', 'education', 'contact']),
  visible: z.boolean().default(true),
  order: z.number().default(0),
});

export const PortfolioSettingsSchema = z.object({
  showAvatar: z.boolean().default(true),
  showProjectImages: z.boolean().default(true),
  showGitHubLinks: z.boolean().default(true),
  showSkillCategories: z.boolean().default(true),
});

export const PortfolioConfigSchema = z.object({
  template: z.string().default('minimal'),
  theme: ThemeSchema.default({
    mode: 'dark',
    accent: '#FFFFFF',
  }),
  sections: z.array(PortfolioSectionSchema).default([
    { id: 'hero', visible: true, order: 0 },
    { id: 'projects', visible: true, order: 1 },
    { id: 'skills', visible: true, order: 2 },
  ]),
  settings: PortfolioSettingsSchema.default({
    showAvatar: true,
    showProjectImages: true,
    showGitHubLinks: true,
    showSkillCategories: true,
  }),
});

export const PortfolioAISchema = z.object({
  used: z.boolean().default(false),
  provider: z.string().nullable().default(null),
  mode: z.string().nullable().default(null),
  changes: z.object({
    profileBio: z.boolean().default(false),
    projectDescriptions: z.array(z.string()).default([]), // Project IDs
  }).default({ profileBio: false, projectDescriptions: [] }),
});

export const PortfolioSessionSchema = z.object({
  schemaVersion: z.number().default(1),
  app: z.object({
    name: z.string().default('Portfolio Builder'),
    version: z.string().default('1.0.0'),
  }).default({ name: 'Portfolio Builder', version: '1.0.0' }),
  profile: ProfileSchema.default({
    name: '',
    headline: '',
    bio: '',
  }),
  socialLinks: z.array(SocialLinkSchema).default([]),
  customSkillCategories: z.array(z.string()).default([]),
  projects: z.array(ProjectSchema).default([]),
  skills: z.array(SkillSchema).default([]),
  skillGroups: z.array(SkillGroupSchema).default([]),
  portfolio: PortfolioConfigSchema.default({
    template: 'minimal',
    theme: { mode: 'dark', accent: '#FFFFFF' },
    sections: [
      { id: 'hero', visible: true, order: 0 },
      { id: 'projects', visible: true, order: 1 },
      { id: 'skills', visible: true, order: 2 },
    ],
    settings: {
      showAvatar: true,
      showProjectImages: true,
      showGitHubLinks: true,
      showSkillCategories: true,
    }
  }),
  ai: PortfolioAISchema.default({
    used: false,
    provider: null,
    mode: null,
    changes: { profileBio: false, projectDescriptions: [] }
  }),
  metadata: z.object({
    createdAt: z.string().default(() => new Date().toISOString()),
    updatedAt: z.string().default(() => new Date().toISOString()),
    language: z.string().default('en'),
    generator: z.string().default('portfolio-builder'),
  }).default({
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    language: 'en',
    generator: 'portfolio-builder',
  }),
});
