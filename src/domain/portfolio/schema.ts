import { z } from 'zod';

export const ProfileSchema = z.object({
  name: z.string().default(''),
  headline: z.string().default(''),
  bio: z.string().default(''),
  avatar: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
});

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().default(''),
  description: z.string().default(''),
  url: z.string().optional(),
  repositoryUrl: z.string().optional(),
  image: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  source: z.enum(['manual', 'github']),
  selected: z.boolean().default(true),
  order: z.number().default(0),
});

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum([
    'Frontend',
    'Backend',
    'Mobile',
    'Database',
    'Cloud & Delivery',
    'Testing',
    'AI',
    'Tools',
    'Other'
  ]).default('Other'),
  source: z.enum(['manual', 'github']).default('manual'),
  selected: z.boolean().default(true),
});

export const ThemeSchema = z.object({
  template: z.string().default('minimal'),
  mode: z.enum(['light', 'dark']).default('dark'),
  accent: z.string().default('#FFFFFF'),
});

export const PortfolioSessionSchema = z.object({
  schemaVersion: z.number().default(1),
  profile: ProfileSchema.default({
    name: '',
    headline: '',
    bio: '',
  }),
  projects: z.array(ProjectSchema).default([]),
  skills: z.array(SkillSchema).default([]),
  theme: ThemeSchema.default({
    template: 'minimal',
    mode: 'dark',
    accent: '#FFFFFF',
  }),
  metadata: z.record(z.string(), z.unknown()).default({}),
});
