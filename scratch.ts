import { renderHook } from '@testing-library/react-native';
import { useState } from 'react';
async function test() {
  const result = await renderHook(() => useState(0));
  console.log("Keys of result:", Object.keys(result));
}
test();
