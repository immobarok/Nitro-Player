import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { MIDNIGHT_CINEMA } from '../theme/midnightCinema';
import { GlassPanel } from './GlassPanel';
import { Icon } from './Icon';

interface ShortcutsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: 'Space / K', action: 'Play or pause video' },
  { key: '← / → or J / L', action: 'Seek backward / forward 10s' },
  { key: '↑ / ↓', action: 'Adjust volume by 10%' },
  { key: 'M', action: 'Mute or unmute audio' },
  { key: 'T', action: 'Toggle Theater widescreen layout' },
  { key: 'N / P', action: 'Next or previous video in queue' },
  { key: 'F', action: 'Toggle fullscreen (on video double-click)' },
] as const;

export function ShortcutsModal({ visible, onClose }: ShortcutsModalProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} style={styles.backdrop}>
        <Pressable onPress={e => e.stopPropagation()} style={styles.cardWrap}>
          <GlassPanel variant="hud" blurPx={30} style={styles.modalCard}>
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <Icon name="keyboard" size={18} color={MIDNIGHT_CINEMA.amber} />
                <Text style={styles.title}>Nitro Engine Controls</Text>
              </View>
              <Pressable onPress={onClose} style={styles.closeBtn}>
                <Icon name="close" size={16} />
              </Pressable>
            </View>

            <Text style={styles.subtitle}>
              Built with React Native 0.88.1 • Midnight Cinema Glass UI
            </Text>

            <View style={styles.list}>
              {SHORTCUTS.map(entry => (
                <View key={entry.key} style={styles.row}>
                  <Text style={styles.actionText}>{entry.action}</Text>
                  <View style={styles.keyCap}>
                    <Text style={styles.keyText}>{entry.key}</Text>
                  </View>
                </View>
              ))}
            </View>
          </GlassPanel>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 4, 6, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardWrap: {
    width: '100%',
    maxWidth: 460,
  },
  modalCard: {
    padding: 22,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    color: MIDNIGHT_CINEMA.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    color: MIDNIGHT_CINEMA.textSecondary,
    fontSize: 12,
  },
  list: {
    gap: 10,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: MIDNIGHT_CINEMA.borderDivider,
  },
  actionText: {
    color: MIDNIGHT_CINEMA.textPrimary,
    fontSize: 13,
    flex: 1,
  },
  keyCap: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: MIDNIGHT_CINEMA.borderGlassStrong,
  },
  keyText: {
    color: MIDNIGHT_CINEMA.amber,
    fontSize: 11,
    fontWeight: '700',
  },
});

