import { MIDNIGHT_CINEMA, type GlassVariant } from '../theme/midnightCinema';

interface GlassVariantStyleConfig {
  backgroundColor: string;
  borderColor: string;
  rimColor: string;
  shadowColor: string;
}

const VARIANT_TABLE: Record<GlassVariant, GlassVariantStyleConfig> = {
  smoked: {
    backgroundColor: MIDNIGHT_CINEMA.glassBase,
    borderColor: MIDNIGHT_CINEMA.borderGlass,
    rimColor: 'rgba(255, 255, 255, 0.14)',
    shadowColor: 'rgba(0, 0, 0, 0.45)',
  },
  elevated: {
    backgroundColor: MIDNIGHT_CINEMA.glassElevated,
    borderColor: MIDNIGHT_CINEMA.borderGlassStrong,
    rimColor: 'rgba(255, 255, 255, 0.22)',
    shadowColor: 'rgba(0, 0, 0, 0.58)',
  },
  hud: {
    backgroundColor: MIDNIGHT_CINEMA.glassHud,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    rimColor: 'rgba(255, 255, 255, 0.20)',
    shadowColor: 'rgba(0, 0, 0, 0.72)',
  },
  accent: {
    backgroundColor: MIDNIGHT_CINEMA.glassActive,
    borderColor: MIDNIGHT_CINEMA.borderCrimson,
    rimColor: 'rgba(255, 110, 138, 0.35)',
    shadowColor: 'rgba(255, 46, 84, 0.28)',
  },
  amber: {
    backgroundColor: MIDNIGHT_CINEMA.glassAmber,
    borderColor: MIDNIGHT_CINEMA.borderAmber,
    rimColor: 'rgba(251, 191, 36, 0.32)',
    shadowColor: 'rgba(245, 158, 11, 0.22)',
  },
};

export function getGlassVariantConfig(
  variant: GlassVariant = 'smoked',
): GlassVariantStyleConfig {
  return VARIANT_TABLE[variant];
}
