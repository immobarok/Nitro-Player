import React from 'react';
import { MIDNIGHT_CINEMA } from '../theme/midnightCinema';
import type { IconName } from './types';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export function Icon({
  name,
  size = 18,
  color = MIDNIGHT_CINEMA.textPrimary,
}: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    style: { display: 'block', flexShrink: 0 },
  };

  switch (name) {
    case 'play':
      return (
        <svg {...common} fill={color} stroke="none">
          <path d="M7.5 5.25v13.5L18.5 12 7.5 5.25z" />
        </svg>
      );
    case 'pause':
      return (
        <svg {...common} fill={color} stroke="none">
          <rect x="6.5" y="5" width="4" height="14" rx="1.2" />
          <rect x="13.5" y="5" width="4" height="14" rx="1.2" />
        </svg>
      );
    case 'prev':
      return (
        <svg {...common}>
          <path d="M6 6v12" />
          <path d="M18 6l-9 6 9 6V6z" fill={color} stroke="none" />
        </svg>
      );
    case 'next':
      return (
        <svg {...common}>
          <path d="M18 6v12" />
          <path d="M6 6l9 6-9 6V6z" fill={color} stroke="none" />
        </svg>
      );
    case 'rewind':
      return (
        <svg {...common}>
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
          <path d="M10.5 10.5v3" />
          <path d="M14 10.5c.8 0 1.2.6 1.2 1.5s-.4 1.5-1.2 1.5-1.2-.6-1.2-1.5.4-1.5 1.2-1.5z" />
        </svg>
      );
    case 'forward':
      return (
        <svg {...common}>
          <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M9.5 10.5v3" />
          <path d="M13 10.5c.8 0 1.2.6 1.2 1.5s-.4 1.5-1.2 1.5-1.2-.6-1.2-1.5.4-1.5 1.2-1.5z" />
        </svg>
      );
    case 'volume':
      return (
        <svg {...common}>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill={color} stroke="none" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.8 5.8a9 9 0 0 1 0 12.4" />
        </svg>
      );
    case 'mute':
      return (
        <svg {...common}>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill={color} stroke="none" />
          <path d="M22 9l-6 6" />
          <path d="M16 9l6 6" />
        </svg>
      );
    case 'fullscreen':
      return (
        <svg {...common}>
          <path d="M8 3H5a2 2 0 0 0-2 2v3" />
          <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
          <path d="M3 16v3a2 2 0 0 0 2 2h3" />
          <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
        </svg>
      );
    case 'exit-fullscreen':
      return (
        <svg {...common}>
          <path d="M8 3v3a2 2 0 0 1-2 2H3" />
          <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
          <path d="M3 16h3a2 2 0 0 1 2 2v3" />
          <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
        </svg>
      );
    case 'pip':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <rect x="12" y="10.5" width="6.5" height="4.8" rx="1" fill={color} stroke="none" />
        </svg>
      );
    case 'loop':
      return (
        <svg {...common}>
          <path d="M17 2l4 4-4 4" />
          <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
          <path d="M7 22l-4-4 4-4" />
          <path d="M21 13v1a4 4 0 0 1-4 4H3" />
        </svg>
      );
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      );
    case 'upload':
      return (
        <svg {...common}>
          <path d="M12 16V4" />
          <path d="M7 9l5-5 5 5" />
          <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...common}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case 'heart-filled':
      return (
        <svg {...common} fill={color} stroke={color}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case 'sparkles':
      return (
        <svg {...common}>
          <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
          <path d="M19 3v3" />
          <path d="M20.5 4.5h-3" />
          <path d="M5 17v3" />
          <path d="M6.5 18.5h-3" />
        </svg>
      );
    case 'theater':
      return (
        <svg {...common}>
          <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
          <path d="M6.5 9h11v6h-11z" />
        </svg>
      );
    case 'keyboard':
      return (
        <svg {...common}>
          <rect x="2.5" y="6" width="19" height="12" rx="2.2" />
          <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01" />
          <path d="M7 14h10" />
        </svg>
      );
    case 'film':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 4v16M17 4v16M3 8h4M3 16h4M17 8h4M17 16h4" />
        </svg>
      );
    case 'flame':
      return (
        <svg {...common} fill={color} stroke="none">
          <path d="M13.5 2.5L5.5 13h6l-1 8.5 8-10.5h-6l1-8.5z" />
        </svg>
      );
    case 'close':
      return (
        <svg {...common}>
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="M5 13l4 4L19 7" />
        </svg>
      );
  }
}
