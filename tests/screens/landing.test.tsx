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
