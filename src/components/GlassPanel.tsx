import React from 'react';
import { StyleSheet, View } from 'react-native';
import { getGlassVariantConfig } from './glassStyles';
import type { GlassPanelProps } from './types';

export function GlassPanel({
  children,
  variant = 'smoked',
  style,
  highlightRim = true,
  testID,
}: GlassPanelProps) {
  const palette = getGlassVariantConfig(variant);

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
          borderTopColor: highlightRim ? palette.rimColor : palette.borderColor,
        },
        style,
      ]}
    >
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

