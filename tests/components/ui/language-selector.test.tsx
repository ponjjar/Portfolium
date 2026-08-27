import React from 'react';
import renderer from 'react-test-renderer';
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

    const tree = renderer.create(<LanguageSelector />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders PT-BR correctly', () => {
    (useTranslation as jest.Mock).mockReturnValue({
      i18n: {
        language: 'pt-BR',
        changeLanguage: jest.fn(),
      },
    });

    const tree = renderer.create(<LanguageSelector />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
