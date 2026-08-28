import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('LanguageSelector Component', () => {
  it('renders EN-US correctly', () => {
    (useTranslation as jest.Mock).mockReturnValue({
      i18n: {
        language: 'en',
        changeLanguage: jest.fn(),
      },
    });

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<LanguageSelector />);
    });

    const textNode = tree!.root.findByProps({ children: 'EN-US' });
    expect(textNode).toBeTruthy();
    expect(tree!.toJSON()).toMatchSnapshot();
  });

  it('renders PT-BR correctly', () => {
    (useTranslation as jest.Mock).mockReturnValue({
      i18n: {
        language: 'pt-BR',
        changeLanguage: jest.fn(),
      },
    });

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<LanguageSelector />);
    });

    const textNode = tree!.root.findByProps({ children: 'PT-BR' });
    expect(textNode).toBeTruthy();
    expect(tree!.toJSON()).toMatchSnapshot();
  });
});
