export interface VideoChapter {
  label: string;
  timeSeconds: number;
}

export interface VideoItem {
  id: string;
  title: string;
  subtitle: string;
  creator: string;
  category: '4K HDR' | 'Cinema' | 'Demo' | 'Local';
  durationSeconds: number;
  resolution: string;
  fps: number;
  codec: string;
  videoUrl: string;
  posterUrl: string;
  accentColor: string;
  secondaryGlow: string;
  chapters: VideoChapter[];
  isLocal?: boolean;
}

export const INITIAL_PLAYLIST: VideoItem[] = [
  {
    id: 'nitro-blazes',
    title: 'For Bigger Blazes — Crimson Ignition',
    subtitle: 'High-contrast ember & studio showcase stream tuned for OLED dark glass.',
    creator: 'Nitro Reference Lab',
    category: '4K HDR',
    durationSeconds: 15,
    resolution: '1080p',
    fps: 60,
    codec: 'H.264',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    accentColor: '#FF2E54',
    secondaryGlow: '#F59E0B',
    chapters: [
      { label: 'Cold Start', timeSeconds: 0 },
      { label: 'Nitro Boost', timeSeconds: 5 },
      { label: 'Peak Flare', timeSeconds: 10 },
    ],
  },
  {
    id: 'nitro-escapes',
    title: 'For Bigger Escapes — Midnight Drift',
    subtitle: 'Dynamic motion clarity benchmark with warm amber highlights.',
    creator: 'Cinema Optics',
    category: 'Cinema',
    durationSeconds: 15,
    resolution: '1080p',
    fps: 60,
    codec: 'H.264',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    posterUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
    accentColor: '#F59E0B',
    secondaryGlow: '#FF2E54',
    chapters: [
      { label: 'Horizon', timeSeconds: 0 },
      { label: 'Acceleration', timeSeconds: 6 },
      { label: 'Overdrive', timeSeconds: 11 },
    ],
  },
  {
    id: 'nitro-bunny',
    title: 'Big Buck Bunny — Open Cinema Master',
    subtitle: 'Blender Foundation animated short film for full-length scrubbing & PiP.',
    creator: 'Blender Institute',
    category: '4K HDR',
    durationSeconds: 596,
    resolution: '1080p',
    fps: 30,
    codec: 'H.264 • AAC',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    posterUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    accentColor: '#FF2E54',
    secondaryGlow: '#FB923C',
    chapters: [
      { label: 'Morning Meadow', timeSeconds: 0 },
      { label: 'The Trio', timeSeconds: 115 },
      { label: 'Trap Prep', timeSeconds: 290 },
      { label: 'Finale', timeSeconds: 460 },
    ],
  },
  {
    id: 'nitro-tears',
    title: 'Tears of Steel — Sci-Fi VFX Master',
    subtitle: 'Live-action & CGI compositing test ideal for Midnight Cinema grading.',
    creator: 'Mango Open Movie',
    category: 'Cinema',
    durationSeconds: 734,
    resolution: '1080p',
    fps: 24,
    codec: 'H.264 • Stereo',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    posterUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
    accentColor: '#F43F5E',
    secondaryGlow: '#F59E0B',
    chapters: [
      { label: 'Amsterdam Bridge', timeSeconds: 0 },
      { label: 'Celia & Thom', timeSeconds: 165 },
      { label: 'Dome Breach', timeSeconds: 390 },
      { label: 'Epilogue', timeSeconds: 610 },
    ],
  },
  {
    id: 'nitro-sintel',
    title: 'Sintel — Theatrical Fantasy Cut',
    subtitle: 'Rich shadow detail & atmospheric soundtrack for ambient glow testing.',
    creator: 'Durian Project',
    category: 'Demo',
    durationSeconds: 888,
    resolution: '1080p',
    fps: 24,
    codec: 'H.264 • AAC',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    posterUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
    accentColor: '#E11D48',
    secondaryGlow: '#FBBF24',
    chapters: [
      { label: 'Mountain Pass', timeSeconds: 0 },
      { label: 'Scales', timeSeconds: 210 },
      { label: 'The Sanctuary', timeSeconds: 520 },
      { label: 'Departure', timeSeconds: 760 },
    ],
  },
];

export function formatTimecode(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return '00:00';
  }
  const rounded = Math.floor(totalSeconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  if (hours > 0) {
    return `${hours}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

