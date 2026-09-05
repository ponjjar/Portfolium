import { z } from 'zod';
import { Project } from '@/domain/portfolio/types';

export type AiMode = 'free' | 'personal';
export type AiProvider = 'cloudflare' | 'groq' | 'openai' | 'gemini' | 'ollama' | 'custom';
export type AiConfidence = 'high' | 'medium' | 'low';
export type AiGenerationStatus = 'pending' | 'generating' | 'completed' | 'error';

export interface ProjectAiDraft {
  projectId: string;
  locale: string;
  originalDescription: string;
  suggestedDescription?: string;
  useful: boolean;
  status: AiGenerationStatus;
  provider?: AiProvider;
  confidence?: AiConfidence;
  error?: string;
}

export interface ProfileAiDraft {
  originalDescription?: string;
  suggestedDescription?: string;
  status: AiGenerationStatus;
  approved: boolean;
}

export interface SummarizeProjectsRequest {
  language: string;
  projects: (Pick<Project, 'id' | 'title' | 'description' | 'shortDescription' | 'technologies'> & {
    repositoryUrl?: string;
    language?: string;
    topics?: string[];
    rawReadme?: string;
  })[];
}

export interface SummarizeProjectsResponse {
  results: {
    projectId: string;
    summary?: string;
    confidence?: AiConfidence;
    requestedProvider?: AiProvider;
    usedProvider?: AiProvider;
    originalDescription?: string;
    error?: string;
  }[];
}

export interface SuggestProfileRequest {
  sourceLocale: 'pt-BR' | 'en';
  targetLocales: Array<'pt-BR' | 'en'>;
  projects: Array<{
    id: string;
    name: string;
    summary: string;
    technologies?: string[];
  }>;
  currentProfile?: {
    descriptions?: Partial<Record<'pt-BR' | 'en', string>>;
  };
}

export interface SuggestProfileResponse {
  suggestions: {
    'pt-BR'?: string;
    en?: string;
  };
  sourceLocale: 'pt-BR' | 'en';
  provider?: AiProvider;
  error?: string;
}

export interface TranslateRequest {
  sourceLocale: string;
  targetLocale: string;
  texts: { id: string; text: string }[];
}

export interface TranslateResponse {
  results: {
    id: string;
    text?: string;
    provider?: AiProvider;
    error?: string;
  }[];
}

export interface ParseResumeRequest {
  text: string;
  language: string;
}

export interface ParseResumeResponse {
  result: {
    experiences: any[];
    education: any[];
  };
  provider?: AiProvider;
  error?: string;
}
