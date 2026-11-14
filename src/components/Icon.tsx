import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { MIDNIGHT_CINEMA } from '../theme/midnightCinema';
import type { IconName } from './types';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

const GLYPH_MAP: Record<IconName, string> = {
  play: '▶',
  pause: '❚❚',
  prev: '⏮',
  next: '⏭',
  rewind: '↺',
  forward: '↻',
  volume: '🔊',
  mute: '🔇',
  fullscreen: '⛶',
  'exit-fullscreen': '🗗',
  pip: '⧉',
  loop: '🔁',
  search: '⌕',
  upload: '⇪',
  heart: '♡',
  'heart-filled': '♥',
  sparkles: '✦',
  theater: '▭',
  keyboard: '⌘',
  film: '▶',
  flame: '⚡',
  close: '✕',
  check: '✓',
};

export function Icon({
  name,
  size = 18,
  color = MIDNIGHT_CINEMA.textPrimary,
}: IconProps) {
  return (
    <Text style={[styles.glyph, { fontSize: size * 0.9, color }]}>
      {GLYPH_MAP[name]}
    </Text>
  );
}

const styles = StyleSheet.create({
  glyph: {
    fontWeight: '700',
    includeFontPadding: false,
    textAlign: 'center',
  },
});

