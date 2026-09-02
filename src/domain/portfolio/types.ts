import { z } from 'zod';
import {
  ProfileSchema,
  ProjectSchema,
  SkillSchema,
  SkillGroupSchema,
  ThemeSchema,
  PortfolioConfigSchema,
  PortfolioSessionSchema,
  PortfolioImageSchema,
  SocialLinkSchema,
  PortfolioSectionSchema,
} from './schema';

export type Profile = z.infer<typeof ProfileSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type SkillGroup = z.infer<typeof SkillGroupSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type PortfolioConfig = z.infer<typeof PortfolioConfigSchema>;
export type PortfolioSession = z.infer<typeof PortfolioSessionSchema>;
export type PortfolioImage = z.infer<typeof PortfolioImageSchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type PortfolioSection = z.infer<typeof PortfolioSectionSchema>;
