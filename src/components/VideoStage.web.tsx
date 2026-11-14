import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
  bufferedPercent,
  volume,
  isMuted,
  playbackRate,
  quality,
  isLooping,
  isTheater,
  ambientEnabled,
  onTogglePlay,
  onSeek,
  onSkipBy,
  onPrev,
  onNext,
  onVolumeChange,
  onToggleMute,
  onCyclePlaybackRate,
  onCycleQuality,
  onToggleLoop,
  onToggleTheater,
  onTimeUpdate,
  onDurationChange,
  onBufferedChange,
  onEnded,
  onPlayStateSync,
  onDropFiles,
}: VideoStageProps) {
  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  const [hudVisible, setHudVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);

  const effectiveDuration = duration > 0 ? duration : video.durationSeconds;
  const progressRatio =
    effectiveDuration > 0
      ? Math.min(1, Math.max(0, currentTime / effectiveDuration))
      : 0;

  const scheduleHudHide = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
    }
    setHudVisible(true);
    if (isPlaying && !isScrubbing) {
      hideTimerRef.current = window.setTimeout(() => {
        setHudVisible(false);
      }, 2800);
    }
  }, [isPlaying, isScrubbing]);

  useEffect(() => {
    scheduleHudHide();
    return () => {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, [scheduleHudHide]);

  // Reset error & load new video source cleanly
  useEffect(() => {
    setStreamError(null);
    setIsBuffering(false);
    const el = videoRef.current;
    if (!el) {
      return;
    }
    el.playbackRate = playbackRate;
    el.volume = isMuted ? 0 : volume;
    el.muted = isMuted;
    if (isPlaying) {
      el.play().catch(() => {
        onPlayStateSync(false);
      });
    }
  }, [video.id, video.videoUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync play/pause state with HTMLVideoElement
  useEffect(() => {
    const el = videoRef.current;
    if (!el) {
      return;
    }
    if (isPlaying && el.paused) {
      el.play().catch(() => {
        onPlayStateSync(false);
      });
    } else if (!isPlaying && !el.paused) {
      el.pause();
    }
  }, [isPlaying, onPlayStateSync]);

  // Sync volume & mute
  useEffect(() => {
    const el = videoRef.current;
    if (!el) {
      return;
    }
    el.volume = volume;
    el.muted = isMuted;
  }, [volume, isMuted]);

  // Sync playback rate & loop
  useEffect(() => {
    const el = videoRef.current;
    if (!el) {
      return;
    }
    el.playbackRate = playbackRate;
    el.loop = isLooping;
  }, [playbackRate, isLooping]);

  // Sync external seeks (chapter clicks, skip buttons, keyboard shortcuts)
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !Number.isFinite(currentTime)) {
      return;
    }
    if (Math.abs(el.currentTime - currentTime) > 0.65) {
      el.currentTime = currentTime;
    }
  }, [currentTime]);

  // Listen to fullscreen state changes
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const seekFromPointer = useCallback(
    (clientX: number) => {
      const bar = timelineRef.current;
      if (!bar || effectiveDuration <= 0) {
        return;
      }
      const rect = bar.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const targetTime = ratio * effectiveDuration;
      if (videoRef.current) {
        videoRef.current.currentTime = targetTime;
      }
      onSeek(targetTime);
    },
    [effectiveDuration, onSeek],
  );

  useEffect(() => {
    if (!isScrubbing) {
      return;
    }
    const handleMove = (e: PointerEvent) => seekFromPointer(e.clientX);
    const handleUp = () => setIsScrubbing(false);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [isScrubbing, seekFromPointer]);

  const toggleFullscreen = async () => {
    const node = stageContainerRef.current;
    if (!node) {
      return;
    }
    try {
      if (!document.fullscreenElement) {
        await node.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore browser permission rejection
    }
  };

  const togglePip = async () => {
    const el = videoRef.current as
      | (HTMLVideoElement & {
          requestPictureInPicture?: () => Promise<PictureInPictureWindow>;
        })
      | null;
    if (!el) {
      return;
    }
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (el.requestPictureInPicture) {
        await el.requestPictureInPicture();
      }
    } catch {
      // Ignore if PiP unavailable
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files?.length && onDropFiles) {
      onDropFiles(e.dataTransfer.files);
    }
  };

  return (
    <View style={styles.stageWrapper}>
      {/* Ambient cinema backlight behind player */}
      {ambientEnabled && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: -14,
            borderRadius: 32,
            background: `radial-gradient(circle at 30% 45%, ${video.accentColor}44, transparent 58%), radial-gradient(circle at 75% 60%, ${video.secondaryGlow}33, transparent 60%)`,
            filter: 'blur(36px)',
            opacity: isPlaying ? 0.92 : 0.55,
            transition: 'opacity 400ms ease, background 600ms ease',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

      <div
        ref={stageContainerRef}
        onMouseMove={scheduleHudHide}
        onMouseLeave={() => {
          if (isPlaying && !isScrubbing) {
            setHudVisible(false);
          }
        }}
        onDragOver={e => {
          e.preventDefault();
          setIsDraggingFile(true);
        }}
        onDragLeave={() => setIsDraggingFile(false)}
        onDrop={handleDrop}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          aspectRatio: isFullscreen ? undefined : isTheater ? '21 / 9' : '16 / 9',
          minHeight: isFullscreen ? '100vh' : 280,
          maxHeight: isFullscreen ? '100vh' : isTheater ? '72vh' : '64vh',
          borderRadius: isFullscreen ? 0 : 24,
          overflow: 'hidden',
          backgroundColor: MIDNIGHT_CINEMA.bgCinemaStage,
          border: isFullscreen
            ? 'none'
            : `1px solid ${
                isDraggingFile
                  ? MIDNIGHT_CINEMA.crimson
                  : MIDNIGHT_CINEMA.borderGlassStrong
              }`,
          boxShadow: isFullscreen
            ? 'none'
            : '0 28px 80px rgba(0, 0, 0, 0.78), inset 0 1px 0 rgba(255, 255, 255, 0.16)',
          userSelect: 'none',
        }}
      >
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.posterUrl || undefined}
          playsInline
          preload="metadata"
          onClick={onTogglePlay}
          onDoubleClick={toggleFullscreen}
          onWaiting={() => setIsBuffering(true)}
          onCanPlay={() => setIsBuffering(false)}
          onPlaying={() => {
            setIsBuffering(false);
            onPlayStateSync(true);
          }}
          onPause={() => onPlayStateSync(false)}
          onEnded={onEnded}
          onError={() => {
            setIsBuffering(false);
            setStreamError(
              'Remote stream could not load here — drop or open a local video file (.mp4 / .webm / .mov) to test instant playback.',
            );
            onPlayStateSync(false);
          }}
          onLoadedMetadata={e => {
            const target = e.currentTarget;
            if (Number.isFinite(target.duration) && target.duration > 0) {
              onDurationChange(target.duration);
            }
          }}
          onTimeUpdate={e => {
            const target = e.currentTarget;
            onTimeUpdate(target.currentTime);
            if (target.buffered.length > 0 && target.duration > 0) {
              const bufferedEnd = target.buffered.end(target.buffered.length - 1);
              onBufferedChange(Math.min(100, (bufferedEnd / target.duration) * 100));
            }
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            cursor: 'pointer',
            backgroundColor: '#040406',
          }}
        />

        {/* Subtle top & bottom gradient scrims when HUD is visible */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: hudVisible || !isPlaying ? 1 : 0,
            transition: 'opacity 240ms ease',
            background:
              'linear-gradient(180deg, rgba(10,10,12,0.72) 0%, transparent 26%, transparent 62%, rgba(10,10,12,0.88) 100%)',
          }}
        />

        {/* Top Floating Glass Info Pill */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            right: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            opacity: hudVisible || !isPlaying ? 1 : 0,
            transform: hudVisible || !isPlaying ? 'translateY(0)' : 'translateY(-8px)',
            transition: 'opacity 220ms ease, transform 220ms ease',
            pointerEvents: hudVisible || !isPlaying ? 'auto' : 'none',
          }}
        >
          <GlassPanel variant="hud" blurPx={20} style={styles.topBadge}>
            <View style={styles.topBadgeInner}>
              <View style={styles.liveDot} />
              <Text numberOfLines={1} style={styles.topTitle}>
                {video.title}
              </Text>
            </View>
          </GlassPanel>

          <GlassPanel variant="hud" blurPx={20} style={styles.topMetaBadge}>
            <View style={styles.topMetaRow}>
              <Text style={styles.amberChipText}>
                {video.isLocal ? 'LOCAL FILE' : video.category.toUpperCase()}
              </Text>
              <Text style={styles.metaDivider}>•</Text>
              <Text style={styles.metaSpecText}>
                {video.resolution} {video.fps}FPS
              </Text>
            </View>
          </GlassPanel>
        </div>

        {/* Center Play CTA / Buffering / Error */}
        {(!isPlaying || isBuffering || streamError) && !isDraggingFile && (
          <div
            onClick={() => {
              if (!streamError) {
                onTogglePlay();
              }
            }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: streamError ? 'auto' : 'none',
              padding: 24,
            }}
          >
            {streamError ? (
              <GlassPanel variant="hud" blurPx={24} style={styles.errorCard}>
                <Text style={styles.errorTitle}>Stream Unavailable</Text>
                <Text style={styles.errorBody}>{streamError}</Text>
              </GlassPanel>
            ) : (
              <GlassPanel variant="hud" blurPx={22} style={styles.centerPlayOrb}>
                <View style={styles.centerPlayCore}>
                  {isBuffering ? (
                    <Text style={styles.bufferingText}>•••</Text>
                  ) : (
                    <Icon name="play" size={28} color={MIDNIGHT_CINEMA.textPrimary} />
                  )}
                </View>
              </GlassPanel>
            )}
          </div>
        )}

        {/* Drag & Drop File Overlay */}
        {isDraggingFile && (
          <div
            style={{
              position: 'absolute',
              inset: 14,
              borderRadius: 18,
              border: `2px dashed ${MIDNIGHT_CINEMA.crimson}`,
              backgroundColor: 'rgba(10, 10, 14, 0.78)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              zIndex: 20,
            }}
          >
            <Icon name="upload" size={34} color={MIDNIGHT_CINEMA.crimson} />
            <Text style={styles.dropTitle}>Drop Video Into Nitro Engine</Text>
            <Text style={styles.dropSub}>MP4, WebM, MOV, or M4V supported locally</Text>
          </div>
        )}

        {/* Bottom Glassmorphic Playback HUD */}
        <div
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 16,
            opacity: hudVisible || !isPlaying ? 1 : 0,
            transform: hudVisible || !isPlaying ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 220ms ease, transform 220ms ease',
            pointerEvents: hudVisible || !isPlaying ? 'auto' : 'none',
          }}
        >
          <GlassPanel variant="hud" blurPx={26} style={styles.hudDock}>
            {/* Scrubber Bar */}
            <div
              ref={timelineRef}
              onPointerDown={e => {
                setIsScrubbing(true);
                seekFromPointer(e.clientX);
              }}
              onMouseMove={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = Math.min(
                  1,
                  Math.max(0, (e.clientX - rect.left) / rect.width),
                );
                setHoverRatio(ratio);
              }}
              onMouseLeave={() => setHoverRatio(null)}
              style={{
                position: 'relative',
                height: 20,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              {/* Hover Timestamp Tooltip */}
              {hoverRatio !== null && effectiveDuration > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${hoverRatio * 100}%`,
                    bottom: 22,
                    transform: 'translateX(-50%)',
                    padding: '4px 8px',
                    borderRadius: 8,
                    backgroundColor: 'rgba(10, 10, 14, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    color: MIDNIGHT_CINEMA.textPrimary,
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600,
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formatTimecode(hoverRatio * effectiveDuration)}
                </div>
              )}

              {/* Track */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: isScrubbing || hoverRatio !== null ? 7 : 5,
                  borderRadius: 999,
                  backgroundColor: 'rgba(255, 255, 255, 0.16)',
                  overflow: 'visible',
                  transition: 'height 140ms ease',
                }}
              >
                {/* Buffered Fill */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${bufferedPercent}%`,
                    borderRadius: 999,
                    backgroundColor: 'rgba(255, 255, 255, 0.24)',
                  }}
                />

                {/* Crimson -> Amber Played Fill */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${progressRatio * 100}%`,
                    borderRadius: 999,
                    background: `linear-gradient(90deg, ${MIDNIGHT_CINEMA.crimson} 0%, ${MIDNIGHT_CINEMA.amber} 100%)`,
                    boxShadow: `0 0 14px ${MIDNIGHT_CINEMA.crimsonGlow}`,
                  }}
                />

                {/* Chapter Markers */}
                {effectiveDuration > 0 &&
                  video.chapters.map(chapter => {
                    const pct = (chapter.timeSeconds / effectiveDuration) * 100;
                    if (pct <= 1 || pct >= 99) {
                      return null;
                    }
                    return (
                      <div
                        key={chapter.label}
                        title={chapter.label}
                        style={{
                          position: 'absolute',
                          left: `${pct}%`,
                          top: -1,
                          bottom: -1,
                          width: 2,
                          borderRadius: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.55)',
                        }}
                      />
                    );
                  })}

                {/* Glowing Playhead Thumb */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${progressRatio * 100}%`,
                    top: '50%',
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#FFFFFF',
                    border: `2.5px solid ${MIDNIGHT_CINEMA.crimson}`,
                    boxShadow: `0 0 12px ${MIDNIGHT_CINEMA.crimson}`,
                  }}
                />
              </div>
            </div>

            {/* Controls Row */}
            <View style={styles.controlsRow}>
              <View style={styles.controlsGroup}>
                <Pressable
                  accessibilityLabel="Previous video"
                  onPress={onPrev}
                  style={styles.iconBtn}
                >
                  <Icon name="prev" size={17} />
                </Pressable>

                <Pressable
                  accessibilityLabel="Rewind 10 seconds"
                  onPress={() => onSkipBy(-10)}
                  style={styles.iconBtn}
                >
                  <Icon name="rewind" size={17} />
                </Pressable>

                <Pressable
                  accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
                  onPress={onTogglePlay}
                  style={styles.playPillBtn}
                >
                  <Icon
                    name={isPlaying ? 'pause' : 'play'}
                    size={18}
                    color="#FFFFFF"
                  />
                </Pressable>

                <Pressable
                  accessibilityLabel="Forward 10 seconds"
                  onPress={() => onSkipBy(10)}
                  style={styles.iconBtn}
                >
                  <Icon name="forward" size={17} />
                </Pressable>

                <Pressable
                  accessibilityLabel="Next video"
                  onPress={onNext}
                  style={styles.iconBtn}
                >
                  <Icon name="next" size={17} />
                </Pressable>

                <View style={styles.volumeGroup}>
                  <Pressable
                    accessibilityLabel={isMuted ? 'Unmute' : 'Mute'}
                    onPress={onToggleMute}
                    style={styles.iconBtn}
                  >
                    <Icon
                      name={isMuted || volume === 0 ? 'mute' : 'volume'}
                      size={17}
                    />
                  </Pressable>
                  <input
                    aria-label="Volume"
                    type="range"
                    min={0}
                    max={1}
                    step={0.02}
                    value={isMuted ? 0 : volume}
                    onChange={e => onVolumeChange(parseFloat(e.target.value))}
                    style={{
                      width: 68,
                      accentColor: MIDNIGHT_CINEMA.crimson,
                      cursor: 'pointer',
                    }}
                  />
                </View>

                <Text style={styles.timecodeText}>
                  {formatTimecode(currentTime)}{' '}
                  <Text style={styles.timecodeMuted}>
                    / {formatTimecode(effectiveDuration)}
                  </Text>
                </Text>
              </View>

              <View style={styles.controlsGroup}>
                <Pressable
                  accessibilityLabel="Playback speed"
                  onPress={onCyclePlaybackRate}
                  style={[
                    styles.pillControl,
                    playbackRate !== 1 && styles.pillControlActive,
                  ]}
                >
                  <Text style={styles.pillControlText}>{playbackRate}x</Text>
                </Pressable>

                <Pressable
                  accessibilityLabel="Quality preset"
                  onPress={onCycleQuality}
                  style={styles.pillControl}
                >
                  <Text style={styles.amberSmallText}>{quality}</Text>
                </Pressable>

                <Pressable
                  accessibilityLabel="Toggle loop"
                  onPress={onToggleLoop}
                  style={[styles.iconBtn, isLooping && styles.iconBtnActive]}
                >
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

                <Pressable
                  accessibilityLabel="Picture in Picture"
                  onPress={togglePip}
                  style={styles.iconBtn}
                >
                  <Icon name="pip" size={17} />
                </Pressable>

                <Pressable
                  accessibilityLabel="Toggle theater mode"
                  onPress={onToggleTheater}
                  style={[styles.iconBtn, isTheater && styles.iconBtnActive]}
                >
                  <Icon
                    name="theater"
                    size={17}
                    color={
                      isTheater
                        ? MIDNIGHT_CINEMA.amber
                        : MIDNIGHT_CINEMA.textPrimary
                    }
                  />
                </Pressable>

                <Pressable
                  accessibilityLabel="Fullscreen"
                  onPress={toggleFullscreen}
                  style={styles.iconBtn}
                >
                  <Icon
                    name={isFullscreen ? 'exit-fullscreen' : 'fullscreen'}
                    size={17}
                  />
                </Pressable>
              </View>
            </View>
          </GlassPanel>
        </div>
      </div>
    </View>
  );
}

const styles = StyleSheet.create({
  stageWrapper: {
    position: 'relative',
    width: '100%',
  },
  topBadge: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    maxWidth: '64%',
  },
  topBadgeInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: MIDNIGHT_CINEMA.crimson,
  },
  topTitle: {
    color: MIDNIGHT_CINEMA.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  topMetaBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  topMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  amberChipText: {
    color: MIDNIGHT_CINEMA.amber,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  metaDivider: {
    color: MIDNIGHT_CINEMA.textMuted,
    fontSize: 11,
  },
  metaSpecText: {
    color: MIDNIGHT_CINEMA.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  centerPlayOrb: {
    borderRadius: 999,
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPlayCore: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: MIDNIGHT_CINEMA.crimson,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bufferingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
  },
  errorCard: {
    padding: 20,
    maxWidth: 420,
    alignItems: 'center',
    gap: 6,
  },
  errorTitle: {
    color: MIDNIGHT_CINEMA.crimson,
    fontSize: 15,
    fontWeight: '700',
  },
  errorBody: {
    color: MIDNIGHT_CINEMA.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  dropTitle: {
    color: MIDNIGHT_CINEMA.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  dropSub: {
    color: MIDNIGHT_CINEMA.textSecondary,
    fontSize: 13,
  },
  hudDock: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 6,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  controlsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconBtnActive: {
    backgroundColor: MIDNIGHT_CINEMA.crimsonSoft,
    borderWidth: 1,
    borderColor: MIDNIGHT_CINEMA.borderCrimson,
  },
  playPillBtn: {
    width: 44,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MIDNIGHT_CINEMA.crimson,
  },
  volumeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 2,
  },
  timecodeText: {
    color: MIDNIGHT_CINEMA.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    marginLeft: 4,
  },
  timecodeMuted: {
    color: MIDNIGHT_CINEMA.textSecondary,
  },
  pillControl: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  pillControlActive: {
    backgroundColor: MIDNIGHT_CINEMA.crimsonSoft,
    borderColor: MIDNIGHT_CINEMA.borderCrimson,
  },
  pillControlText: {
    color: MIDNIGHT_CINEMA.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  amberSmallText: {
    color: MIDNIGHT_CINEMA.amber,
    fontSize: 11,
    fontWeight: '700',
  },
});
