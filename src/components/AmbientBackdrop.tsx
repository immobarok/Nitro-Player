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
    <View pointerEvents="none" style={styles.root}>
      <View
        style={[
          styles.orbTopLeft,
          {
            backgroundColor: accentColor,
            opacity: enabled ? 0.2 : 0.08,
          },
        ]}
      />
      <View
        style={[
          styles.orbBottomRight,
          {
            backgroundColor: secondaryGlow,
            opacity: enabled ? 0.16 : 0.06,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
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
});
