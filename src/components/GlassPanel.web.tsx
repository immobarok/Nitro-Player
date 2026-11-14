import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { getGlassVariantConfig } from './glassStyles';
import type { GlassPanelProps } from './types';

type WebGlassStyle = ViewStyle & {
  backdropFilter?: string;
  WebkitBackdropFilter?: string;
  boxShadow?: string;
};

export function GlassPanel({
  children,
  variant = 'smoked',
  blurPx = 24,
  style,
  highlightRim = true,
  testID,
}: GlassPanelProps) {
  const palette = getGlassVariantConfig(variant);

  const webGlassStyle: WebGlassStyle = {
    backgroundColor: palette.backgroundColor,
    borderColor: palette.borderColor,
    backdropFilter: `blur(${blurPx}px) saturate(180%)`,
    WebkitBackdropFilter: `blur(${blurPx}px) saturate(180%)`,
    boxShadow: highlightRim
      ? `0 22px 48px ${palette.shadowColor}, inset 0 1px 0 ${palette.rimColor}`
      : `0 22px 48px ${palette.shadowColor}`,
  };

  return (
    <View testID={testID} style={[styles.base, webGlassStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
});

