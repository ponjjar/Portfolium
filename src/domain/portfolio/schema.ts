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

export const VisualThemeSchema = z.object({
  preset: z.enum(['minimal', 'dark', 'amoled', 'lava', 'cosmic-glow', 'soft-purple-glow', 'grid-stars', 'clean-light', 'neon-orbit']).default('dark'),
  accent: z.string().default('#FFFFFF'),
  backgroundEffects: z.object({
    glows: z.object({
      enabled: z.boolean().default(false),
      intensity: z.enum(['low', 'medium', 'high']).default('medium'),
      color: z.string().default('#3b82f6'),
      count: z.number().default(2),
    }).default({}),
    microStars: z.object({
      enabled: z.boolean().default(false),
      density: z.enum(['low', 'medium', 'high']).default('low'),
      opacity: z.number().default(0.3),
    }).default({}),
  }).default({}),
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
  avatarStyle: AvatarStyleSchema.default({}),
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
  }),
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
  enabled: z.boolean().default(false),
  showNavigation: z.boolean().default(true),
  showName: z.boolean().default(true),
  showAvatar: z.boolean().default(true),
  namePosition: z.enum(['left', 'right']).default('left'),
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
    backgroundEffects: { glows: { enabled: false, intensity: 'medium', color: '#3b82f6', count: 2 }, microStars: { enabled: false, density: 'low', opacity: 0.3 } }
  }),
  layout: z.object({
    profile: ProfileLayoutSchema.default({}),
    projects: ProjectsLayoutSchema.default({}),
    header: HeaderLayoutSchema.default({}),
  }).default({}),
  animations: z.object({
    revealOnScroll: z.boolean().default(false),
  }).default({}),
  navigation: z.object({
    enabled: z.boolean().default(false),
  }).default({}),
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
    visualTheme: {
      preset: 'dark',
      accent: '#FFFFFF',
      backgroundEffects: { glows: { enabled: false, intensity: 'medium', color: '#3b82f6', count: 2 }, microStars: { enabled: false, density: 'low', opacity: 0.3 } }
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
      header: { enabled: false, showNavigation: true, showName: true, showAvatar: true, namePosition: 'left' }
    },
    animations: { revealOnScroll: false },
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
