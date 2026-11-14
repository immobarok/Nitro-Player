import React, { useImperativeHandle } from 'react';

export interface LocalFilePickerHandle {
  open: () => void;
}

interface LocalFilePickerProps {
  onFilesSelected?: (files: unknown) => void;
  onNativeUnsupported?: () => void;
}

export const LocalFilePicker = React.forwardRef<
  LocalFilePickerHandle,
  LocalFilePickerProps
>(function LocalFilePicker({ onNativeUnsupported }, ref) {
  useImperativeHandle(ref, () => ({
    open: () => {
      onNativeUnsupported?.();
    },
  }));

  return null;
});
