import { z } from 'zod';
import {
  ProfileSchema,
  ProjectSchema,
  SkillSchema,
  ThemeSchema,
  PortfolioSessionSchema,
} from './schema';

export type Profile = z.infer<typeof ProfileSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type PortfolioSession = z.infer<typeof PortfolioSessionSchema>;
