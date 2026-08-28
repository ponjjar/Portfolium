import React from 'react';
import renderer, { act } from 'react-test-renderer';

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    __esModule: true,
    default: {
      View: RN.View,
      Text: RN.Text,
    },
    useSharedValue: (init: any) => ({ value: init }),
    useAnimatedStyle: (fn: any) => fn(),
    withTiming: (toValue: any) => toValue,
    interpolate: () => 0,
    FadeIn: { duration: () => ({}) },
    Easing: { out: () => ({}), cubic: () => ({}) },
    Extrapolation: { CLAMP: 'clamp' },
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: { step?: number; total?: number }) => {
      if (key === 'common.step_of' && params) {
        return `Step ${params.step} of ${params.total}`;
      }
      return key;
    },
  }),
}));

import { WizardHeader } from '@/components/layout/wizard-header';

describe('WizardHeader Component', () => {
  it('renders step indicator and progress accurately', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(
        <WizardHeader step={2} totalSteps={5} title="Projects" subtitle="Select your projects" />
      );
    });

    // Check step indicator text
    const stepNode = tree!.root.findByProps({ children: 'Step 2 of 5' });
    expect(stepNode).toBeTruthy();

    // Check percentage text
    const percentageNode = tree!.root.findByProps({ children: '40%' });
    expect(percentageNode).toBeTruthy();

    // Check title
    const titleNode = tree!.root.findByProps({ children: 'Projects' });
    expect(titleNode).toBeTruthy();
  });
});
