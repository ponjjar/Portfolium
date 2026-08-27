import React from 'react';
import renderer from 'react-test-renderer';
import { Button } from '@/components/ui/button';
import { Text } from 'react-native';

describe('Button Component', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Button>
        <Text>Click Me!</Text>
      </Button>
    ).toJSON();
    
    expect(tree).toMatchSnapshot();
  });
});
