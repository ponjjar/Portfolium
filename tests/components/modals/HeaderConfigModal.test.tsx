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
        'header_config.modal_title': 'Configuração do Cabeçalho',
        'common.done': 'Concluir',
        'header_config.enable_header': 'Habilitar Cabeçalho',
        'header_config.show_navigation': 'Menu de Navegação (Seções)',
        'header_config.show_name': 'Exibir Seu Nome',
        'header_config.show_avatar': 'Exibir Seu Avatar',
        'header_config.name_position': 'Posição da Identificação',
        'header_config.position_left': 'Esquerda',
        'header_config.position_right': 'Direita',
      };
      return map[key] || key;
    },
  }),
}));

import { HeaderConfigModal } from '@/components/modals/HeaderConfigModal';

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

describe('HeaderConfigModal Component (Issue #32)', () => {
  const enabledConfig = {
    enabled: true,
    showNavigation: true,
    showName: true,
    showAvatar: true,
    namePosition: 'left' as const,
  };

  const disabledConfig = {
    enabled: false,
    showNavigation: false,
    showName: false,
    showAvatar: false,
    namePosition: 'left' as const,
  };

  it('renders modal title and header enable toggle', () => {
    const handleClose = jest.fn();
    const handleUpdate = jest.fn();

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <HeaderConfigModal
          visible={true}
          onClose={handleClose}
          config={enabledConfig}
          onUpdate={handleUpdate}
        />
      );
    });

    expect(tree!.root.findByProps({ children: 'Configuração do Cabeçalho' })).toBeTruthy();
    expect(tree!.root.findByProps({ children: 'Habilitar Cabeçalho' })).toBeTruthy();
  });

  it('hides sub-options when header is disabled', () => {
    const handleClose = jest.fn();
    const handleUpdate = jest.fn();

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <HeaderConfigModal
          visible={true}
          onClose={handleClose}
          config={disabledConfig}
          onUpdate={handleUpdate}
        />
      );
    });

    expect(tree!.root.findAllByProps({ children: 'Menu de Navegação (Seções)' }).length).toBe(0);
    expect(tree!.root.findAllByProps({ children: 'Exibir Seu Nome' }).length).toBe(0);
    expect(tree!.root.findAllByProps({ children: 'Exibir Seu Avatar' }).length).toBe(0);
  });

  it('shows sub-options and allows toggling them when header is enabled', () => {
    const handleClose = jest.fn();
    const handleUpdate = jest.fn();

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <HeaderConfigModal
          visible={true}
          onClose={handleClose}
          config={enabledConfig}
          onUpdate={handleUpdate}
        />
      );
    });

    const navNode = tree!.root.findByProps({ children: 'Menu de Navegação (Seções)' });
    act(() => {
      triggerPress(navNode);
    });

    expect(handleUpdate).toHaveBeenCalledWith({
      ...enabledConfig,
      showNavigation: false,
    });

    const nameNode = tree!.root.findByProps({ children: 'Exibir Seu Nome' });
    act(() => {
      triggerPress(nameNode);
    });

    expect(handleUpdate).toHaveBeenCalledWith({
      ...enabledConfig,
      showName: false,
    });
  });

  it('allows changing name position between left and right', () => {
    const handleClose = jest.fn();
    const handleUpdate = jest.fn();

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <HeaderConfigModal
          visible={true}
          onClose={handleClose}
          config={enabledConfig}
          onUpdate={handleUpdate}
        />
      );
    });

    const rightOption = tree!.root.findByProps({ children: 'Direita' });
    act(() => {
      triggerPress(rightOption);
    });

    expect(handleUpdate).toHaveBeenCalledWith({
      ...enabledConfig,
      namePosition: 'right',
    });
  });

  it('calls onClose when concluding', () => {
    const handleClose = jest.fn();
    const handleUpdate = jest.fn();

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <HeaderConfigModal
          visible={true}
          onClose={handleClose}
          config={enabledConfig}
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
