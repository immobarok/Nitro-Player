import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { VideoItem } from '../data/playlist';
import type { GlassVariant } from '../theme/midnightCinema';

export type IconName =
  | 'play'
  | 'pause'
  | 'prev'
  | 'next'
  | 'rewind'
  | 'forward'
  | 'volume'
  | 'mute'
  | 'fullscreen'
  | 'exit-fullscreen'
  | 'pip'
  | 'loop'
  | 'search'
  | 'upload'
  | 'heart'
  | 'heart-filled'
  | 'sparkles'
  | 'theater'
  | 'keyboard'
  | 'film'
  | 'flame'
  | 'close'
  | 'check';

export interface GlassPanelProps {
  children?: ReactNode;
  variant?: GlassVariant;
  blurPx?: number;
  style?: StyleProp<ViewStyle>;
  highlightRim?: boolean;
  testID?: string;
}

export interface VideoStageProps {
  video: VideoItem;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  bufferedPercent: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  quality: string;
  isLooping: boolean;
  isTheater: boolean;
  ambientEnabled: boolean;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  onSkipBy: (deltaSeconds: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onVolumeChange: (nextVolume: number) => void;
  onToggleMute: () => void;
  onCyclePlaybackRate: () => void;
  onCycleQuality: () => void;
  onToggleLoop: () => void;
  onToggleTheater: () => void;
  onTimeUpdate: (seconds: number) => void;
  onDurationChange: (seconds: number) => void;
  onBufferedChange: (percent: number) => void;
  onEnded: () => void;
  onPlayStateSync: (playing: boolean) => void;
  onDropFiles?: (files: FileList) => void;
}
