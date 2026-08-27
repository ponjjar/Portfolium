import React from 'react';
import { render } from '@testing-library/react-native';
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

    const { getByText, toJSON } = render(<LanguageSelector />);
    expect(getByText('EN-US')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
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
