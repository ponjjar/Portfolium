import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly', () => {
    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<Button>Click Me!</Button>);
    });

    const textNode = tree!.root.findByProps({ children: 'Click Me!' });
    expect(textNode).toBeTruthy();
    expect(tree!.toJSON()).toMatchSnapshot();
  });
});
