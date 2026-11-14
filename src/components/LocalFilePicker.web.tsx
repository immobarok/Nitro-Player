import React, { useImperativeHandle, useRef } from 'react';

export interface LocalFilePickerHandle {
  open: () => void;
}

interface LocalFilePickerProps {
  onFilesSelected: (files: FileList) => void;
}

export const LocalFilePicker = React.forwardRef<
  LocalFilePickerHandle,
  LocalFilePickerProps
>(function LocalFilePickerImpl({ onFilesSelected }, ref) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      inputRef.current?.click();
    },
  }));

  return (
    <input
      ref={inputRef}
      type="file"
      accept="video/*"
      multiple
      style={{ display: 'none' }}
      onChange={e => {
        if (e.target.files?.length) {
          onFilesSelected(e.target.files);
          e.target.value = '';
        }
      }}
    />
  );
});
