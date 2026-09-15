import React from 'react';
import renderer, { act } from 'react-test-renderer';
import TermsOfUseScreen from '@/app/terms';
import PrivacyPolicyScreen from '@/app/privacy';
import AboutUsScreen from '@/app/about';
import CookiesScreen from '@/app/cookies';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
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

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'pt', changeLanguage: jest.fn() },
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(null),
}));

describe('Institutional Screens', () => {
  it('renders TermsOfUseScreen successfully', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<TermsOfUseScreen />);
    });
    expect(tree!.toJSON()).toBeTruthy();
  });

  it('renders PrivacyPolicyScreen successfully', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<PrivacyPolicyScreen />);
    });
    expect(tree!.toJSON()).toBeTruthy();
  });

  it('renders AboutUsScreen successfully', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<AboutUsScreen />);
    });
    expect(tree!.toJSON()).toBeTruthy();
  });

  it('renders CookiesScreen successfully', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<CookiesScreen />);
    });
    expect(tree!.toJSON()).toBeTruthy();
  });
});
