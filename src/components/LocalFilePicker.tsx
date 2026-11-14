import React, { useImperativeHandle } from 'react';

export interface LocalFilePickerHandle {
  open: () => void;
}

interface LocalFilePickerProps {
  onFilesSelected?: (files: FileList) => void;
  onNativeUnsupported?: () => void;
}

export const LocalFilePicker = React.forwardRef<
  LocalFilePickerHandle,
  LocalFilePickerProps
>(function LocalFilePickerImpl({ onNativeUnsupported }, ref) {
  useImperativeHandle(ref, () => ({
    open: () => {
      onNativeUnsupported?.();
    },
  }));

  return null;
});
