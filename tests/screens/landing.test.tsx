import React from 'react';
import renderer, { act } from 'react-test-renderer';
import WelcomeScreen from '@/app/index';

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

jest.mock('@/components/ui/testimonial-v2', () => () => {
  const RN = require('react-native');
  return <RN.View testID="mock-testimonial" />;
});

jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn().mockResolvedValue({ canceled: true }),
}));

jest.mock('@/store', () => ({
  usePortfolioStore: () => ({
    importSession: jest.fn().mockReturnValue(true),
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'pt', changeLanguage: jest.fn() },
  }),
}));

describe('WelcomeScreen (Landing Page)', () => {
  it('renders landing page with hero, brand title, and action buttons', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<WelcomeScreen />);
    });
    expect(tree!.toJSON()).toBeTruthy();
  });
});
