import { renderHook, act } from '@testing-library/react-native';
import { useAiGeneration } from '../../src/features/ai/hooks/useAiGeneration';
import { usePortfolioStore, getInitialSession } from '../../src/store';
import { AiClient } from '../../src/features/ai/ai-client';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock AiClient
jest.mock('../../src/features/ai/ai-client', () => ({
  AiClient: {
    summarizeProjects: jest.fn(),
    suggestProfile: jest.fn(),
    translate: jest.fn(),
  }
}));

describe('AI Integration Phase 2 - MultiLocale', () => {
  beforeEach(() => {
    // Reset the store before each test
    const initialSession = getInitialSession();
    usePortfolioStore.setState({ session: { ...initialSession, languageSettings: { defaultLanguage: 'pt-BR', supportedLanguages: ['pt-BR', 'en'] } } });
    jest.clearAllMocks();
  });

  const setupProjects = (count: number) => {
    const projects = Array.from({ length: count }).map((_, i) => ({
      id: `proj-${i}`,
      title: `Project ${i}`,
      description: `Description ${i}`,
      shortDescription: '',
      source: { type: 'manual' as const },
      links: {},
      technologies: ['React'],
      selected: true,
      featured: false,
      order: i,
      githubMetadata: undefined,
      aiReviewsByLocale: {}
    }));
    usePortfolioStore.setState(state => ({
      session: { ...state.session, projects }
    }));
    return projects;
  };

  it('selects free mode and triggers limit modal if > 10 project x locale pairs', async () => {
    setupProjects(6); // 6 projects * 2 locales = 12 pairs
    const { result } = await renderHook(() => useAiGeneration());
    
    await act(async () => {
      result.current.selectMode('free');
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.step).toBe('project-limit');
    expect(result.current.selectedPairs.length).toBe(10);
  });

  it('selects free mode and proceeds immediately if <= 10 pairs', async () => {
    setupProjects(2); // 2 projects * 2 locales = 4 pairs
    (AiClient.summarizeProjects as jest.Mock).mockResolvedValue({
      results: Array.from({ length: 2 }).map((_, i) => ({
        projectId: `proj-${i}`,
        summary: `Summary ${i}`,
        confidence: 'high',
        provider: 'groq'
      }))
    });

    const { result } = await renderHook(() => useAiGeneration());
    
    await act(async () => {
      result.current.selectMode('free');
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.step).toBe('review-projects');
    const store = usePortfolioStore.getState();
    const proj = store.session.projects[0];
    expect(proj.aiReviewsByLocale).toBeDefined();
    expect(proj.aiReviewsByLocale?.['pt-BR']?.status).toBe('approved');
  });

  it('generates profile suggestion for multiple locales', async () => {
    setupProjects(1);
    (AiClient.suggestProfile as jest.Mock).mockResolvedValue({
      suggestions: {
        'pt-BR': 'A highly skilled engineer.',
        'en': 'A highly skilled engineer.'
      },
      provider: 'groq'
    });

    const { result } = await renderHook(() => useAiGeneration());
    
    await act(async () => {
      await result.current.generateProfileSuggestion();
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.step).toBe('review-profile');
    const drafts = result.current.profileDrafts;
    expect(drafts['pt-BR'].status).toBe('completed');
    expect(drafts['pt-BR'].suggestedDescription).toBe('A highly skilled engineer.');
  });
});
