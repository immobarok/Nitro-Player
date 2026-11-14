/**
 * Midnight Cinema color palette and glassmorphic design tokens for Nitro Player.
 */
export const MIDNIGHT_CINEMA = {
  // Core background surfaces
  bgVoid: '#0A0A0C',
  bgElevated: '#121218',
  bgCinemaStage: '#050507',

  // Smoked translucent glass surfaces
  glassBase: 'rgba(255, 255, 255, 0.06)',
  glassElevated: 'rgba(255, 255, 255, 0.09)',
  glassHover: 'rgba(255, 255, 255, 0.12)',
  glassHud: 'rgba(10, 10, 14, 0.62)',
  glassHudStrong: 'rgba(10, 10, 14, 0.80)',
  glassActive: 'rgba(255, 46, 84, 0.16)',
  glassAmber: 'rgba(245, 158, 11, 0.14)',

  // Specular borders and inner highlights
  borderGlass: 'rgba(255, 255, 255, 0.12)',
  borderGlassStrong: 'rgba(255, 255, 255, 0.22)',
  borderDivider: 'rgba(255, 255, 255, 0.08)',
  borderCrimson: 'rgba(255, 46, 84, 0.48)',
  borderAmber: 'rgba(245, 158, 11, 0.45)',

  // Brand & energy accents
  crimson: '#FF2E54',
  crimsonGlow: 'rgba(255, 46, 84, 0.45)',
  crimsonSoft: 'rgba(255, 46, 84, 0.20)',
  amber: '#F59E0B',
  amberGlow: 'rgba(245, 158, 11, 0.35)',
  amberSoft: 'rgba(245, 158, 11, 0.16)',

  // Typography
  textPrimary: '#F8FAFC',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
} as const;

export type GlassVariant = 'smoked' | 'elevated' | 'hud' | 'accent' | 'amber';

export const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;
export const QUALITY_TIERS = ['Auto (4K)', '2160p HDR', '1080p', '720p'] as const;

