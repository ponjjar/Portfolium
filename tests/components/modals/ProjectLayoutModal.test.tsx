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

import { ProjectLayoutModal } from '@/components/modals/ProjectLayoutModal';

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

describe('ProjectLayoutModal Component (Issue #33)', () => {
  const gridConfig = {
    columns: 2,
    cardStyle: 'banner-card' as const,
    carousel: {
      enabled: false,
      autoplay: true,
      intervalMs: 3000,
      paginationDots: true,
    },
  };

  const carouselConfig = {
    columns: 2,
    cardStyle: 'banner-card' as const,
    carousel: {
      enabled: true,
      autoplay: true,
      intervalMs: 3000,
      paginationDots: true,
    },
  };

  it('renders modal title, card styles, and structure options', () => {
    const handleClose = jest.fn();
    const handleUpdate = jest.fn();

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <ProjectLayoutModal
          visible={true}
          onClose={handleClose}
          config={gridConfig}
          onUpdate={handleUpdate}
        />
      );
    });

    expect(tree!.root.findByProps({ children: 'Layout dos Projetos' })).toBeTruthy();
    expect(tree!.root.findByProps({ children: 'Banner (Padrão)' })).toBeTruthy();
    expect(tree!.root.findByProps({ children: 'Logo Lateral' })).toBeTruthy();
    expect(tree!.root.findByProps({ children: 'Apenas Texto' })).toBeTruthy();
    expect(tree!.root.findByProps({ children: 'Grade Fixa' })).toBeTruthy();
    expect(tree!.root.findByProps({ children: 'Carrossel' })).toBeTruthy();
  });

  it('selects card style properly', () => {
    const handleClose = jest.fn();
    const handleUpdate = jest.fn();

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <ProjectLayoutModal
          visible={true}
          onClose={handleClose}
          config={gridConfig}
          onUpdate={handleUpdate}
        />
      );
    });

    const logoSideNode = tree!.root.findByProps({ children: 'Logo Lateral' });
    act(() => {
      triggerPress(logoSideNode);
    });

    expect(handleUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ cardStyle: 'logo-side-card' })
    );

    const textCardNode = tree!.root.findByProps({ children: 'Apenas Texto' });
    act(() => {
      triggerPress(textCardNode);
    });

    expect(handleUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ cardStyle: 'text-card' })
    );
  });

  it('toggles structure between grid and carousel', () => {
    const handleClose = jest.fn();
    const handleUpdate = jest.fn();

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <ProjectLayoutModal
          visible={true}
          onClose={handleClose}
          config={gridConfig}
          onUpdate={handleUpdate}
        />
      );
    });

    const carouselNode = tree!.root.findByProps({ children: 'Carrossel' });
    act(() => {
      triggerPress(carouselNode);
    });

    expect(handleUpdate).toHaveBeenCalledWith({
      ...gridConfig,
      carousel: {
        ...gridConfig.carousel,
        enabled: true,
      },
    });
  });

  it('allows selecting column counts when in grid structure', () => {
    const handleClose = jest.fn();
    const handleUpdate = jest.fn();

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <ProjectLayoutModal
          visible={true}
          onClose={handleClose}
          config={gridConfig}
          onUpdate={handleUpdate}
        />
      );
    });

    const col3Node = tree!.root.findByProps({ children: 3 });
    act(() => {
      triggerPress(col3Node);
    });

    expect(handleUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ columns: 3 })
    );
  });

  it('allows toggling autoplay and pagination in carousel structure', () => {
    const handleClose = jest.fn();
    const handleUpdate = jest.fn();

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <ProjectLayoutModal
          visible={true}
          onClose={handleClose}
          config={carouselConfig}
          onUpdate={handleUpdate}
        />
      );
    });

    const touchables = tree!.root.findAll((node) => typeof node.props.onPress === 'function');
    // The touchable for autoplay toggle is among the touchables in the tree
    const autoplayToggle = touchables.find((t) => {
      return t.props.className && t.props.className.includes('rounded-full p-1');
    });

    expect(autoplayToggle).toBeTruthy();
    act(() => {
      autoplayToggle!.props.onPress();
    });

    expect(handleUpdate).toHaveBeenCalledWith({
      ...carouselConfig,
      carousel: {
        ...carouselConfig.carousel,
        autoplay: false,
      },
    });
  });

  it('calls onClose when clicking conclude', () => {
    const handleClose = jest.fn();
    const handleUpdate = jest.fn();

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <ProjectLayoutModal
          visible={true}
          onClose={handleClose}
          config={gridConfig}
          onUpdate={handleUpdate}
        />
      );
    });

    const doneButton = tree!.root.findByProps({ children: 'Concluir' });
    act(() => {
      triggerPress(doneButton);
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
