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

jest.mock('@/theme/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'dark',
    setTheme: jest.fn(),
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'visual_theme.modal_title': 'Tema e Efeitos Visuais',
        'common.done': 'Concluir',
        'visual_theme.preset_title': 'Predefinição de Tema',
        'visual_theme.accent_color': 'Cor de Destaque',
        'visual_theme.background_effects': 'Efeitos de Fundo (Background)',
        'visual_theme.glows_label': 'Bolas de Brilho (Glows)',
        'visual_theme.glow_intensity': 'Intensidade do Brilho',
        'visual_theme.intensity_low': 'Suave',
        'visual_theme.intensity_medium': 'Médio',
        'visual_theme.intensity_high': 'Forte',
        'visual_theme.stars_label': 'Micro Estrelas (Pontilhado)',
        'visual_theme.stars_density': 'Densidade',
        'visual_theme.density_low': 'Raro',
        'visual_theme.density_medium': 'Normal',
        'visual_theme.density_high': 'Denso',
        'visual_theme.presets.minimal': 'Minimal (Auto)',
        'visual_theme.presets.dark': 'Dark',
        'visual_theme.presets.clean_light': 'Clean Light',
        'visual_theme.presets.amoled': 'AMOLED Black',
        'visual_theme.presets.cosmic_glow': 'Cosmic Glow',
        'visual_theme.presets.soft_purple': 'Soft Purple',
        'visual_theme.presets.neon_orbit': 'Neon Orbit',
        'visual_theme.presets.lava': 'Lava',
        'visual_theme.presets.grid_stars': 'Grid + Stars',
      };
      return map[key] || key;
    },
  }),
}));

import { VisualThemeModal, VisualThemeConfig } from '@/components/modals/VisualThemeModal';

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

describe('VisualThemeModal Component (Issue #31)', () => {
  const initialConfig: VisualThemeConfig = {
    preset: 'dark',
    accent: '#3b82f6',
    backgroundEffects: {
      glows: {
        enabled: true,
        intensity: 'medium',
        color: '#3b82f6',
        count: 2,
      },
      microStars: {
        enabled: true,
        density: 'medium',
        opacity: 0.3,
      },
    },
  };

  it('renders modal title, preset section, accent color section, and background effects section', () => {
    const handleClose = jest.fn();
    const handleUpdate = jest.fn();

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <VisualThemeModal
          visible={true}
          onClose={handleClose}
          config={initialConfig}
          onUpdate={handleUpdate}
        />
      );
    });

    expect(tree!.root.findByProps({ children: 'Tema e Efeitos Visuais' })).toBeTruthy();
    expect(tree!.root.findByProps({ children: 'Predefinição de Tema' })).toBeTruthy();
    expect(tree!.root.findByProps({ children: 'Cor de Destaque' })).toBeTruthy();
    expect(tree!.root.findByProps({ children: 'Efeitos de Fundo (Background)' })).toBeTruthy();
  });

  it('renders theme presets and allows selecting a new preset', () => {
    const handleClose = jest.fn();
    const handleUpdate = jest.fn();

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <VisualThemeModal
          visible={true}
          onClose={handleClose}
          config={initialConfig}
          onUpdate={handleUpdate}
        />
      );
    });

    const cosmicGlowNode = tree!.root.findByProps({ children: 'Cosmic Glow' });
    act(() => {
      triggerPress(cosmicGlowNode);
    });

    expect(handleUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ preset: 'cosmic-glow' })
    );

    const amoledNode = tree!.root.findByProps({ children: 'AMOLED Black' });
    act(() => {
      triggerPress(amoledNode);
    });

    expect(handleUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ preset: 'amoled' })
    );
  });

  it('toggles glow effects and allows selecting intensity', () => {
    const handleClose = jest.fn();
    const handleUpdate = jest.fn();

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <VisualThemeModal
          visible={true}
          onClose={handleClose}
          config={initialConfig}
          onUpdate={handleUpdate}
        />
      );
    });

    const highIntensityNode = tree!.root.findByProps({ children: 'Forte' });
    act(() => {
      triggerPress(highIntensityNode);
    });

    expect(handleUpdate).toHaveBeenCalledWith({
      ...initialConfig,
      backgroundEffects: {
        ...initialConfig.backgroundEffects,
        glows: {
          ...initialConfig.backgroundEffects.glows,
          intensity: 'high',
        },
      },
    });

    const glowsToggleNode = tree!.root.findByProps({ children: 'Bolas de Brilho (Glows)' });
    act(() => {
      triggerPress(glowsToggleNode);
    });

    expect(handleUpdate).toHaveBeenCalledWith({
      ...initialConfig,
      backgroundEffects: {
        ...initialConfig.backgroundEffects,
        glows: {
          ...initialConfig.backgroundEffects.glows,
          enabled: false,
        },
      },
    });
  });

  it('toggles micro stars and allows selecting density', () => {
    const handleClose = jest.fn();
    const handleUpdate = jest.fn();

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <VisualThemeModal
          visible={true}
          onClose={handleClose}
          config={initialConfig}
          onUpdate={handleUpdate}
        />
      );
    });

    const denseNode = tree!.root.findByProps({ children: 'Denso' });
    act(() => {
      triggerPress(denseNode);
    });

    expect(handleUpdate).toHaveBeenCalledWith({
      ...initialConfig,
      backgroundEffects: {
        ...initialConfig.backgroundEffects,
        microStars: {
          ...initialConfig.backgroundEffects.microStars,
          density: 'high',
        },
      },
    });
  });

  it('calls onClose when concluding', () => {
    const handleClose = jest.fn();
    const handleUpdate = jest.fn();

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <VisualThemeModal
          visible={true}
          onClose={handleClose}
          config={initialConfig}
          onUpdate={handleUpdate}
        />
      );
    });

    const doneNode = tree!.root.findByProps({ children: 'Concluir' });
    act(() => {
      triggerPress(doneNode);
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
