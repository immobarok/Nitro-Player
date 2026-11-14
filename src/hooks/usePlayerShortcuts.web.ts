import { useEffect } from 'react';
import type { ShortcutHandlers } from './usePlayerShortcuts';

export function usePlayerShortcuts({
  onTogglePlay,
  onSkipBy,
  onAdjustVolume,
  onToggleMute,
  onToggleTheater,
  onNext,
  onPrev,
}: ShortcutHandlers): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) {
        return;
      }

      const key = event.key.toLowerCase();
      switch (key) {
        case ' ':
        case 'k':
          event.preventDefault();
          onTogglePlay();
          break;
        case 'arrowleft':
        case 'j':
          event.preventDefault();
          onSkipBy(-10);
          break;
        case 'arrowright':
        case 'l':
          event.preventDefault();
          onSkipBy(10);
          break;
        case 'arrowup':
          event.preventDefault();
          onAdjustVolume(0.1);
          break;
        case 'arrowdown':
          event.preventDefault();
          onAdjustVolume(-0.1);
          break;
        case 'm':
          event.preventDefault();
          onToggleMute();
          break;
        case 't':
          event.preventDefault();
          onToggleTheater();
          break;
        case 'n':
          event.preventDefault();
          onNext();
          break;
        case 'p':
          event.preventDefault();
          onPrev();
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    onTogglePlay,
    onSkipBy,
    onAdjustVolume,
    onToggleMute,
    onToggleTheater,
    onNext,
    onPrev,
  ]);
}
