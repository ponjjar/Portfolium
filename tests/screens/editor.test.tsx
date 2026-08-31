import React from 'react';
import renderer, { act } from 'react-test-renderer';

jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');
  const createAnimationChain = () => {
    const chain: any = {
      duration: () => chain,
      springify: () => chain,
      damping: () => chain,
      stiffness: () => chain,
      delay: () => chain,
    };
    return chain;
  };

  return {
    __esModule: true,
    default: {
      View: RN.View,
      Text: RN.Text,
      ScrollView: RN.ScrollView,
      createAnimatedComponent: (c: any) => c,
    },
    FadeIn: createAnimationChain(),
    FadeOut: createAnimationChain(),
    SlideInDown: createAnimationChain(),
    SlideOutDown: createAnimationChain(),
    ZoomIn: createAnimationChain(),
    ZoomOut: createAnimationChain(),
    useSharedValue: (init: any) => ({ value: init }),
    useAnimatedStyle: (fn: any) => fn(),
    withTiming: (val: any) => val,
  };
});

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock('@/theme/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'dark',
    setTheme: jest.fn(),
  }),
}));

jest.mock('react-native-webview', () => ({
  WebView: () => null,
}));

jest.mock('react-i18next', () => {
  const pt = require('@/i18n/locales/pt.json');
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((prev, curr) => prev?.[curr], obj) || path;
  };
  return {
    useTranslation: () => ({
      t: (key: string) => {
        const val = getNestedValue(pt.translation, key);
        return typeof val === 'string' ? val : key;
      },
    }),
  };
});

const mockUpdateTheme = jest.fn();
const mockUpdateConfig = jest.fn();

const mockSession: any = {
  schemaVersion: 1,
  app: { name: 'Portfolio Builder', version: '1.0.0' },
  profile: {
    name: 'Alice Cooper',
    headline: 'Rockstar Developer',
    bio: 'Experienced software architect building universal apps.',
    avatar: { type: 'url', value: 'https://example.com/avatar.png' },
  },
  socialLinks: [{ label: 'GitHub', url: 'https://github.com' }],
  customSkillCategories: [],
  projects: [
    {
      id: 'p1',
      title: 'Project 1',
      description: 'First project description',
      shortDescription: '',
      source: { type: 'manual' },
      links: { demo: 'https://demo.com' },
      technologies: ['TypeScript', 'React'],
      selected: true,
      featured: true,
      order: 0,
    },
  ],
  skills: [
    { id: 's1', name: 'TypeScript', category: 'Frontend', selected: true, sources: [] },
  ],
  skillGroups: [],
  portfolio: {
    template: 'minimal',
    theme: { mode: 'dark', accent: '#3b82f6' },
    visualTheme: {
      preset: 'dark',
      accent: '#3b82f6',
      backgroundEffects: {
        glows: { enabled: false, intensity: 'medium', color: '#3b82f6', count: 2 },
        microStars: { enabled: false, density: 'medium', opacity: 0.3 },
      },
    },
    layout: {
      profile: {
        variant: 'stacked-center',
        cornerItemsOrder: ['name', 'links', 'headline'],
        embedsTechnologies: false,
        avatarStyle: { shape: 'circle', border: 'subtle', effect: 'none' },
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
      projects: {
        columns: 2,
        cardStyle: 'banner-card',
        carousel: { enabled: false, autoplay: true, intervalMs: 3000, paginationDots: true },
      },
      header: {
        enabled: false,
        showNavigation: true,
        showName: true,
        showAvatar: true,
        namePosition: 'left',
      },
    },
    sections: [
      { id: 'hero', title: 'Home', visible: true, order: 0 },
      { id: 'projects', title: 'Projects', visible: true, order: 1 },
      { id: 'skills', title: 'Skills', visible: true, order: 2 },
    ],
    settings: {
      showAvatar: true,
      showProjectImages: true,
      showGitHubLinks: true,
      showSkillCategories: true,
    },
    animations: {
      revealOnScroll: false,
    },
    navigation: {
      enabled: false,
      items: [],
    },
  },
  ai: { used: false, provider: null, mode: null, changes: { profileBio: false, projectDescriptions: [] } },
  metadata: { createdAt: '', updatedAt: '', language: 'en', generator: '' },
};

jest.mock('@/store', () => ({
  usePortfolioStore: () => ({
    session: mockSession,
    updateTheme: mockUpdateTheme,
    updateConfig: mockUpdateConfig,
  }),
}));

import * as ReactNative from 'react-native';
import EditorScreen from '@/app/(wizard)/editor';

function triggerPress(node: renderer.ReactTestInstance) {
  let current: renderer.ReactTestInstance | null = node;
  while (current) {
    if (current.props && typeof current.props.onPress === 'function') {
      current.props.onPress();
      return;
    }
    current = current.parent;
  }
  throw new Error('No pressable parent found');
}

describe('Editor Screen Integration (Issue #30)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(ReactNative.Dimensions, 'get').mockReturnValue({
      width: 1024,
      height: 768,
      scale: 1,
      fontScale: 1,
    });
    jest.spyOn(ReactNative, 'useWindowDimensions').mockReturnValue({
      width: 1024,
      height: 768,
      scale: 1,
      fontScale: 1,
    });
  });

  it('renders desktop sidebar with sections and customizer controls', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<EditorScreen />);
    });

    expect(tree!.root.findByProps({ children: 'Editor Final' })).toBeTruthy();
    expect(tree!.root.findByProps({ children: 'Tema Visual e Efeitos' })).toBeTruthy();
    expect(tree!.root.findByProps({ children: 'Layout do Perfil' })).toBeTruthy();
    expect(tree!.root.findByProps({ children: 'Layout dos Projetos' })).toBeTruthy();
    expect(tree!.root.findByProps({ children: 'Cabeçalho' })).toBeTruthy();
    expect(tree!.root.findByProps({ children: 'Animações de rolagem' })).toBeTruthy();
  });

  it('toggles scroll animations when pressing the option', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<EditorScreen />);
    });

    const scrollAnimOption = tree!.root.findByProps({ children: 'Animações de rolagem' });
    act(() => {
      triggerPress(scrollAnimOption);
    });

    expect(mockUpdateConfig).toHaveBeenCalledWith({
      animations: { revealOnScroll: true },
    });
  });

  it('opens and closes export modal', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<EditorScreen />);
    });

    const exportButton = tree!.root.findByProps({ children: 'Exportar Portfólio' });
    act(() => {
      triggerPress(exportButton);
    });

    // Check if ExportModal title is rendered
    expect(tree!.root.findByProps({ children: 'Pronto para exportar' })).toBeTruthy();
  });

  it('opens VisualThemeModal when clicking on visual theme option', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<EditorScreen />);
    });

    const visualThemeBtn = tree!.root.findByProps({ children: 'Tema Visual e Efeitos' });
    act(() => {
      triggerPress(visualThemeBtn);
    });

    expect(tree!.root.findByProps({ children: 'Predefinição de Tema' })).toBeTruthy();
  });

  it('opens ProfileLayoutModal when clicking on profile layout option', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<EditorScreen />);
    });

    const profileLayoutBtn = tree!.root.findByProps({ children: 'Layout do Perfil' });
    act(() => {
      triggerPress(profileLayoutBtn);
    });

    expect(tree!.root.findByProps({ children: 'Variante de Layout' })).toBeTruthy();
  });

  it('opens ProjectLayoutModal when clicking on project layout option', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<EditorScreen />);
    });

    const projectLayoutBtn = tree!.root.findByProps({ children: 'Layout dos Projetos' });
    act(() => {
      triggerPress(projectLayoutBtn);
    });

    expect(tree!.root.findByProps({ children: 'Estilo de Exibição (Card)' })).toBeTruthy();
  });

  it('opens HeaderConfigModal when clicking on header option', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<EditorScreen />);
    });

    const headerBtn = tree!.root.findByProps({ children: 'Cabeçalho' });
    act(() => {
      triggerPress(headerBtn);
    });

    expect(tree!.root.findByProps({ children: 'Habilitar Cabeçalho' })).toBeTruthy();
  });

  it('renders mobile layout with view portfolio button and toggles preview', () => {
    jest.spyOn(ReactNative.Dimensions, 'get').mockReturnValue({
      width: 375,
      height: 667,
      scale: 1,
      fontScale: 1,
    });
    jest.spyOn(ReactNative, 'useWindowDimensions').mockReturnValue({
      width: 375,
      height: 667,
      scale: 1,
      fontScale: 1,
    });

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<EditorScreen />);
    });

    const mobilePreviewBtn = tree!.root.findByProps({ children: 'Visualizar portfólio' });
    expect(mobilePreviewBtn).toBeTruthy();

    act(() => {
      triggerPress(mobilePreviewBtn);
    });

    expect(tree!.root.findByProps({ children: 'Voltar' })).toBeTruthy();
  });
});
