/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import { getGlassVariantConfig } from '../src/components/glassStyles';
import { formatTimecode, INITIAL_PLAYLIST } from '../src/data/playlist';

test('renders Nitro Player studio correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});

test('formats video timecodes accurately', () => {
  expect(formatTimecode(0)).toBe('00:00');
  expect(formatTimecode(15)).toBe('00:15');
  expect(formatTimecode(125)).toBe('02:05');
  expect(formatTimecode(3661)).toBe('1:01:01');
  expect(formatTimecode(-5)).toBe('00:00');
});

test('provides Midnight Cinema glass variant configs and initial playlist', () => {
  expect(INITIAL_PLAYLIST.length).toBeGreaterThanOrEqual(4);
  expect(getGlassVariantConfig('smoked').backgroundColor).toBe(
    'rgba(255, 255, 255, 0.06)',
  );
  expect(getGlassVariantConfig('accent').borderColor).toBe(
    'rgba(255, 46, 84, 0.48)',
  );
});
