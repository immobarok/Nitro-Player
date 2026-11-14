export interface ShortcutHandlers {
  onTogglePlay: () => void;
  onSkipBy: (seconds: number) => void;
  onAdjustVolume: (delta: number) => void;
  onToggleMute: () => void;
  onToggleTheater: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function usePlayerShortcuts(_handlers: ShortcutHandlers): void {
  // Keyboard shortcuts are handled on web via usePlayerShortcuts.web.ts
}
