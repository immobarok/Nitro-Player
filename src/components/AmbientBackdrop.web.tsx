import React from 'react';
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
  const crimsonOpacity = enabled ? 0.34 : 0.12;
  const amberOpacity = enabled ? 0.24 : 0.08;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: MIDNIGHT_CINEMA.bgVoid,
        backgroundImage: `
          radial-gradient(ellipse 80% 55% at 22% 18%, rgba(255, 46, 84, ${crimsonOpacity * 0.45}), transparent 68%),
          radial-gradient(ellipse 70% 50% at 82% 80%, rgba(245, 158, 11, ${amberOpacity * 0.45}), transparent 66%)
        `,
        transition: 'background-image 600ms ease',
      }}
    >
      {/* Drifting Crimson / Primary Aura Orb */}
      <div
        className="nitro-orb-1"
        style={{
          position: 'absolute',
          top: '-14%',
          left: '-8%',
          width: '48vw',
          height: '48vw',
          maxWidth: 680,
          maxHeight: 680,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          opacity: crimsonOpacity,
          filter: 'blur(90px)',
          transition: 'opacity 500ms ease, background 600ms ease',
        }}
      />

      {/* Drifting Warm Amber Aura Orb */}
      <div
        className="nitro-orb-2"
        style={{
          position: 'absolute',
          bottom: '-18%',
          right: '-8%',
          width: '46vw',
          height: '46vw',
          maxWidth: 640,
          maxHeight: 640,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${secondaryGlow} 0%, transparent 70%)`,
          opacity: amberOpacity,
          filter: 'blur(100px)',
          transition: 'opacity 500ms ease, background 600ms ease',
        }}
      />

      {/* Subtle cinema micro-grid sheen for refractive glass depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.22,
          backgroundImage:
            'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage:
            'radial-gradient(circle at 50% 35%, rgba(0,0,0,0.8), transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(circle at 50% 35%, rgba(0,0,0,0.8), transparent 78%)',
        }}
      />
    </div>
  );
}

