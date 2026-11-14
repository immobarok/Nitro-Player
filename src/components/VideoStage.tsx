import React, { useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatTimecode } from '../data/playlist';
import { MIDNIGHT_CINEMA } from '../theme/midnightCinema';
import { GlassPanel } from './GlassPanel';
import { Icon } from './Icon';
import type { VideoStageProps } from './types';

export function VideoStage({
  video,
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  quality,
  isLooping,
  isMuted,
  isTheater,
  onTogglePlay,
  onSkipBy,
  onPrev,
  onNext,
  onToggleMute,
  onCyclePlaybackRate,
  onCycleQuality,
  onToggleLoop,
  onToggleTheater,
  onTimeUpdate,
  onEnded,
}: VideoStageProps) {
  const effectiveDuration = duration > 0 ? duration : video.durationSeconds;
  const progressPct =
    effectiveDuration > 0
      ? Math.min(100, Math.max(0, (currentTime / effectiveDuration) * 100))
      : 0;

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    const timer = setInterval(() => {
      const nextTime = currentTime + 0.5 * playbackRate;
      if (nextTime >= effectiveDuration) {
        if (isLooping) {
          onTimeUpdate(0);
        } else {
          onEnded();
        }
      } else {
        onTimeUpdate(nextTime);
      }
    }, 500);
    return () => clearInterval(timer);
  }, [
    isPlaying,
    currentTime,
    playbackRate,
    effectiveDuration,
    isLooping,
    onTimeUpdate,
    onEnded,
  ]);

  return (
    <View style={[styles.container, isTheater && styles.theaterHeight]}>
      {video.posterUrl ? (
        <Image
          source={{ uri: video.posterUrl }}
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View style={[StyleSheet.absoluteFill, styles.scrim]} />

      <View style={styles.topRow}>
        <GlassPanel variant="hud" style={styles.pill}>
          <Text numberOfLines={1} style={styles.titleText}>
            {video.title}
          </Text>
        </GlassPanel>
        <GlassPanel variant="hud" style={styles.pill}>
          <Text style={styles.amberText}>
            {video.resolution} • {video.fps}FPS
          </Text>
        </GlassPanel>
      </View>

      <Pressable onPress={onTogglePlay} style={styles.centerHitArea}>
        <GlassPanel variant="hud" style={styles.centerOrb}>
          <View style={styles.centerButton}>
            <Icon name={isPlaying ? 'pause' : 'play'} size={24} color="#FFFFFF" />
          </View>
        </GlassPanel>
      </Pressable>

      <GlassPanel variant="hud" style={styles.hud}>
        <View style={styles.trackBg}>
          <View style={[styles.trackFill, { width: `${progressPct}%` }]} />
        </View>

        <View style={styles.controlsRow}>
          <View style={styles.group}>
            <Pressable onPress={onPrev} style={styles.btn}>
              <Icon name="prev" size={16} />
            </Pressable>
            <Pressable onPress={() => onSkipBy(-10)} style={styles.btn}>
              <Icon name="rewind" size={16} />
            </Pressable>
            <Pressable onPress={onTogglePlay} style={styles.playBtn}>
              <Icon
                name={isPlaying ? 'pause' : 'play'}
                size={16}
                color="#FFFFFF"
              />
            </Pressable>
            <Pressable onPress={() => onSkipBy(10)} style={styles.btn}>
              <Icon name="forward" size={16} />
            </Pressable>
            <Pressable onPress={onNext} style={styles.btn}>
              <Icon name="next" size={16} />
            </Pressable>
            <Pressable onPress={onToggleMute} style={styles.btn}>
              <Icon name={isMuted ? 'mute' : 'volume'} size={16} />
            </Pressable>
            <Text style={styles.timeText}>
              {formatTimecode(currentTime)} / {formatTimecode(effectiveDuration)}
            </Text>
          </View>

          <View style={styles.group}>
            <Pressable onPress={onCyclePlaybackRate} style={styles.chipBtn}>
              <Text style={styles.chipText}>{playbackRate}x</Text>
            </Pressable>
            <Pressable onPress={onCycleQuality} style={styles.chipBtn}>
              <Text style={styles.amberText}>{quality}</Text>
            </Pressable>
            <Pressable onPress={onToggleLoop} style={styles.btn}>
              <Icon
                name="loop"
                size={16}
                color={
                  isLooping
                    ? MIDNIGHT_CINEMA.crimson
                    : MIDNIGHT_CINEMA.textPrimary
                }
              />
            </Pressable>
            <Pressable onPress={onToggleTheater} style={styles.btn}>
              <Icon name="theater" size={16} />
            </Pressable>
          </View>
        </View>
      </GlassPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    minHeight: 240,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: MIDNIGHT_CINEMA.bgCinemaStage,
    borderWidth: 1,
    borderColor: MIDNIGHT_CINEMA.borderGlassStrong,
    justifyContent: 'space-between',
    padding: 14,
  },
  theaterHeight: {
    aspectRatio: 21 / 9,
  },
  scrim: {
    backgroundColor: 'rgba(10, 10, 14, 0.46)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  titleText: {
    color: MIDNIGHT_CINEMA.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  amberText: {
    color: MIDNIGHT_CINEMA.amber,
    fontSize: 11,
    fontWeight: '700',
  },
  centerHitArea: {
    alignSelf: 'center',
  },
  centerOrb: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: MIDNIGHT_CINEMA.crimson,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hud: {
    borderRadius: 16,
    padding: 12,
    gap: 10,
  },
  trackBg: {
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    backgroundColor: MIDNIGHT_CINEMA.crimson,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 38,
    height: 32,
    borderRadius: 10,
    backgroundColor: MIDNIGHT_CINEMA.crimson,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    color: MIDNIGHT_CINEMA.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  chipBtn: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  chipText: {
    color: MIDNIGHT_CINEMA.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
});
