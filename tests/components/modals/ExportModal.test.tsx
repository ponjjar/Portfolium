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
  useThemeColors: () => ({
    background: '#202124',
    surface: '#292A2D',
    surfaceElevated: '#303134',
    text: '#F1F3F4',
    textSecondary: '#BDC1C6',
    textMuted: '#9AA0A6',
    border: '#3C4043',
    borderStrong: '#5F6368',
    primary: '#F1F3F4',
    primaryForeground: '#202124',
    inputBackground: '#303134',
    overlay: 'rgba(0, 0, 0, 0.60)',
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'export_modal.title': 'Pronto para exportar',
        'export_modal.subtitle': 'Escolha como deseja salvar ou publicar seu portfólio.',
        'export_modal.html_title': 'Portfólio HTML',
        'export_modal.html_desc': 'Baixe um único arquivo estático.',
        'export_modal.html_btn': 'Baixar HTML',
        'export_modal.zip_title': 'Projeto Completo (ZIP)',
        'export_modal.zip_desc': 'Pacote completo com HTML.',
        'export_modal.zip_btn': 'Baixar ZIP',
        'export_modal.markdown_title': 'Currículo Técnico (Markdown)',
        'export_modal.markdown_desc': 'Documento em Markdown limpo.',
        'export_modal.markdown_btn': 'Baixar Markdown',
        'export_modal.github_title': 'GitHub Pages',
        'export_modal.github_desc': 'Arquivos organizados para publicar.',
        'export_modal.github_btn': 'Preparar para GitHub Pages',
        'export_modal.json_title': 'Backup de Sessão (.json)',
        'export_modal.json_desc': 'Salve seus dados estruturados.',
        'export_modal.json_btn': 'Baixar session.json',
        'export_modal.auto_saved_note': 'Sua sessão também foi salva automaticamente.',
      };
      return map[key] || key;
    },
  }),
}));

import { ExportModal } from '@/components/modals/ExportModal';

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

describe('ExportModal Component', () => {
  it('renders all export format options and handles clicks', async () => {
    const handleClose = jest.fn();
    const handleExportHtml = jest.fn();
    const handleExportJson = jest.fn();
    const handleExportZip = jest.fn();
    const handleExportGitHub = jest.fn();
    const handleExportMarkdown = jest.fn();

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <ExportModal
          visible={true}
          onClose={handleClose}
          onExportHtml={handleExportHtml}
          onExportJson={handleExportJson}
          onExportZip={handleExportZip}
          onExportGitHubPages={handleExportGitHub}
          onExportMarkdown={handleExportMarkdown}
        />
      );
    });

    // Verify Title & Cards
    expect(tree!.root.findByProps({ children: 'Pronto para exportar' })).toBeTruthy();
    expect(tree!.root.findByProps({ children: 'Portfólio HTML' })).toBeTruthy();
    expect(tree!.root.findByProps({ children: 'Projeto Completo (ZIP)' })).toBeTruthy();
    expect(tree!.root.findByProps({ children: 'Currículo Técnico (Markdown)' })).toBeTruthy();
    expect(tree!.root.findByProps({ children: 'GitHub Pages' })).toBeTruthy();
    expect(tree!.root.findByProps({ children: 'Backup de Sessão (.json)' })).toBeTruthy();

    // Trigger HTML Export
    const htmlBtn = tree!.root.findByProps({ children: 'Baixar HTML' });
    await act(async () => {
      triggerPress(htmlBtn);
    });
    expect(handleExportHtml).toHaveBeenCalledTimes(1);

    // Trigger ZIP Export
    const zipBtn = tree!.root.findByProps({ children: 'Baixar ZIP' });
    await act(async () => {
      triggerPress(zipBtn);
    });
    expect(handleExportZip).toHaveBeenCalledTimes(1);

    // Trigger Markdown Export
    const mdBtn = tree!.root.findByProps({ children: 'Baixar Markdown' });
    await act(async () => {
      triggerPress(mdBtn);
    });
    expect(handleExportMarkdown).toHaveBeenCalledTimes(1);

    // Trigger JSON Export
    const jsonBtn = tree!.root.findByProps({ children: 'Baixar session.json' });
    await act(async () => {
      triggerPress(jsonBtn);
    });
    expect(handleExportJson).toHaveBeenCalledTimes(1);
  });
});
