import React from 'react';
import { render } from '@testing-library/react-native';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly', () => {
    const { getByText, toJSON } = render(<Button>Click Me!</Button>);

    expect(getByText('Click Me!')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });
});
