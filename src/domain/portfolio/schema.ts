import { z } from 'zod';

export const PortfolioLanguageSettingsSchema = z.object({
  supportedLanguages: z.array(z.string()).default(['pt-BR', 'en']),
  defaultLanguage: z.string().default('pt-BR'),
});

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

export const ProjectAiReviewSchema = z.object({
  generationId: z.string(),
  projectId: z.string(),
  source: z.enum(['managed', 'external']),
  requestedProvider: z.enum(['cloudflare', 'groq', 'openai', 'gemini', 'ollama', 'custom']),
  usedProvider: z.enum(['cloudflare', 'groq', 'openai', 'gemini', 'ollama', 'custom']),
  model: z.string(),
  locale: z.string(),
  originalDescription: z.string(),
  generatedDescription: z.string(),
  status: z.enum(['pending', 'approved', 'rejected']),
  generatedAt: z.string(),
});

export const ProfileAiDescriptionSchema = z.object({
  locale: z.string(),
  originalText: z.string(),
  generatedText: z.string(),
  status: z.enum(['pending', 'approved', 'rejected']),
});

export const ProfileSchema = z.object({
  name: z.string().default(''),
  headline: z.string().default(''),
  bio: z.string().default(''),
  avatar: PortfolioImageSchema.optional(),
  location: z.string().optional(),
  email: z.string().optional(),
  aiDescriptionsByLocale: z.record(z.string(), ProfileAiDescriptionSchema).optional(),
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
  aiReviewsByLocale: z.record(z.string(), ProjectAiReviewSchema).optional(),
});

export const SkillCategorySchema = z.enum([
  'frontend',
  'backend',
  'mobile',
  'cloud-devops',
  'data',
  'ai',
  'ui-ux',
  'testing',
  'tools',
  'other',
]);

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: SkillCategorySchema.default('other'),
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

export const VisualThemeSchema = z.object({
  preset: z.enum(['minimal', 'dark', 'amoled', 'lava', 'cosmic-glow', 'soft-purple-glow', 'grid-stars', 'clean-light', 'neon-orbit']).default('dark'),
  accent: z.string().default('#FFFFFF'),
  backgroundEffects: z.object({
    glows: z.object({
      enabled: z.boolean().default(false),
      intensity: z.enum(['low', 'medium', 'high']).default('medium'),
      color: z.string().default('#3b82f6'),
      count: z.number().default(2),
    }).default({} as any),
    microStars: z.object({
      enabled: z.boolean().default(false),
      density: z.enum(['low', 'medium', 'high']).default('low'),
      opacity: z.number().default(0.3),
    }).default({} as any),
    parallax: z.boolean().default(false),
    parallaxIntensity: z.enum(['subtle', 'medium']).default('subtle'),
  }).default({} as any),
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

export const AvatarStyleSchema = z.object({
  shape: z.enum(['circle', 'square', 'rounded-square']).default('circle'),
  border: z.enum(['none', 'subtle', 'strong']).default('subtle'),
  effect: z.enum(['none', 'fade-in', 'soft-shadow', 'glow']).default('none'),
});

export const ProfileLayoutSchema = z.object({
  variant: z.enum(['stacked-center', 'avatar-side', 'center-orbit', 'custom-orbit-builder']).default('stacked-center'),
  cornerItemsOrder: z.array(z.enum(['name', 'links', 'headline'])).default(['name', 'links', 'headline']),
  embedsTechnologies: z.boolean().default(false),
  avatarStyle: AvatarStyleSchema.default({} as any),
  zones: z.object({
    topLeft: z.string().default(''),
    topCenter: z.string().default(''),
    topRight: z.string().default(''),
    left: z.string().default(''),
    center: z.string().default('avatar'),
    right: z.string().default(''),
    bottomLeft: z.string().default(''),
    bottomRight: z.string().default(''),
  }).default({
    center: 'avatar',
    topLeft: 'name',
    topRight: 'headline',
    left: 'links',
    bottomLeft: 'description',
    bottomRight: 'technologies'
  } as any),
});

export const ProjectsLayoutSchema = z.object({
  columns: z.number().min(1).max(3).default(2),
  cardStyle: z.enum(['banner-card', 'logo-side-card', 'text-card']).default('banner-card'),
  carousel: z.object({
    enabled: z.boolean().default(false),
    autoplay: z.boolean().default(true),
    intervalMs: z.number().default(3000),
    paginationDots: z.boolean().default(true),
  }).default({ enabled: false, autoplay: true, intervalMs: 3000, paginationDots: true }),
});

export const HeaderLayoutSchema = z.object({
  enabled: z.boolean().default(true),
  showNavigation: z.boolean().default(true),
  showName: z.boolean().default(true),
  showAvatar: z.boolean().default(true),
  namePosition: z.enum(['left', 'right']).default('left'),
});

export const SkillsLayoutSchema = z.object({
  placement: z.enum(['separate-section', 'beside-profile']).default('separate-section'),
  grouping: z.enum(['none', 'category']).default('none'),
  collapsedRows: z.number().default(5),
});

export const PortfolioMotionSchema = z.object({
  enabled: z.boolean().default(true),
  intensity: z.enum(['subtle', 'medium']).default('subtle'),
  sectionReveal: z.boolean().default(true),
  cardHover: z.boolean().default(true),
  chipStagger: z.boolean().default(true),
  backgroundParallax: z.boolean().default(false),
});

export const PortfolioConfigSchema = z.object({
  template: z.string().default('minimal'),
  theme: ThemeSchema.default({
    mode: 'dark',
    accent: '#FFFFFF',
  }),
  visualTheme: VisualThemeSchema.default({
    preset: 'dark',
    accent: '#FFFFFF',
    backgroundEffects: { glows: { enabled: false, intensity: 'medium', color: '#3b82f6', count: 2 }, microStars: { enabled: false, density: 'low', opacity: 0.3 }, parallax: false, parallaxIntensity: 'subtle' }
  }),
  layout: z.object({
    profile: ProfileLayoutSchema.default({} as any),
    projects: ProjectsLayoutSchema.default({} as any),
    header: HeaderLayoutSchema.default({} as any),
    skills: SkillsLayoutSchema.default({} as any),
  }).default({} as any),
  animations: PortfolioMotionSchema.default({} as any),
  navigation: z.object({
    enabled: z.boolean().default(false),
  }).default({} as any),
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
  } as any),
});

export const PortfolioAISchema = z.object({
  used: z.boolean().default(false),
  provider: z.string().nullable().default(null),
  mode: z.enum(['free', 'personal']).nullable().default(null),
  drafts: z.array(z.object({
    projectId: z.string(),
    originalDescription: z.string(),
    suggestedDescription: z.string().optional(),
    useful: z.boolean().default(true),
    status: z.enum(['pending', 'generating', 'completed', 'error']),
    provider: z.enum(['groq', 'cloudflare', 'personal']).optional(),
    confidence: z.enum(['high', 'medium', 'low']).optional(),
    error: z.string().optional(),
  })).default([]),
  profileDraft: z.object({
    originalDescription: z.string().optional(),
    suggestedDescription: z.string().optional(),
    status: z.enum(['pending', 'generating', 'completed', 'error']).default('pending'),
    approved: z.boolean().default(false),
  }).default({ status: 'pending', approved: false }),
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
  languageSettings: PortfolioLanguageSettingsSchema.default({
    supportedLanguages: ['pt-BR', 'en'],
    defaultLanguage: 'pt-BR',
  }),
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
    visualTheme: {
      preset: 'dark',
      accent: '#FFFFFF',
      backgroundEffects: { glows: { enabled: false, intensity: 'medium', color: '#3b82f6', count: 2 }, microStars: { enabled: false, density: 'low', opacity: 0.3 }, parallax: false, parallaxIntensity: 'subtle' }
    },
    layout: {
      profile: { 
        variant: 'stacked-center', 
        cornerItemsOrder: ['name', 'links', 'headline'],
        embedsTechnologies: false,
        avatarStyle: { shape: 'circle', border: 'subtle', effect: 'none' },
        zones: { center: 'avatar', topLeft: 'name', topRight: 'headline', left: 'links', right: '', topCenter: '', bottomLeft: 'description', bottomRight: 'technologies' }
      },
      projects: { columns: 2, cardStyle: 'banner-card', carousel: { enabled: false, autoplay: true, intervalMs: 3000, paginationDots: true } },
      header: { enabled: true, showNavigation: true, showName: true, showAvatar: true, namePosition: 'left' },
      skills: { placement: 'separate-section', grouping: 'none', collapsedRows: 5 }
    },
    animations: { enabled: true, intensity: 'subtle', sectionReveal: true, cardHover: true, chipStagger: true, backgroundParallax: false },
    navigation: { enabled: false },
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
    drafts: [],
    profileDraft: { status: 'pending', approved: false },
    changes: { profileBio: false, projectDescriptions: [] }
  } as any),
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
