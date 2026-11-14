import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MIDNIGHT_CINEMA } from '../theme/midnightCinema';

interface AmbientBackdropProps {
  accentColor: string;
  secondaryGlow: string;
  enabled: boolean;
}

export function AmbientBackdrop({
  accentColor,
  secondaryGlow,
  enabled,
}: AmbientBackdropProps) {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.root]}>
      <View
        style={[
          styles.orbTopLeft,
          { backgroundColor: accentColor },
          enabled ? styles.orbTopEnabled : styles.orbTopDim,
        ]}
      />
      <View
        style={[
          styles.orbBottomRight,
          { backgroundColor: secondaryGlow },
          enabled ? styles.orbBottomEnabled : styles.orbBottomDim,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: MIDNIGHT_CINEMA.bgVoid,
    overflow: 'hidden',
  },
  orbTopLeft: {
    position: 'absolute',
    top: -120,
    left: -100,
    width: 380,
    height: 380,
    borderRadius: 190,
  },
  orbBottomRight: {
    position: 'absolute',
    bottom: -140,
    right: -100,
    width: 420,
    height: 420,
    borderRadius: 210,
  },
  orbTopEnabled: {
    opacity: 0.2,
  },
  orbTopDim: {
    opacity: 0.08,
  },
  orbBottomEnabled: {
    opacity: 0.16,
  },
  orbBottomDim: {
    opacity: 0.06,
  },
});
