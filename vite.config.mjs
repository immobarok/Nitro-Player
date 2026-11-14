import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const reactNativeWebPath = path.resolve(
  __dirname,
  'node_modules/react-native-web',
);

const extensions = [
  '.web.tsx',
  '.tsx',
  '.web.ts',
  '.ts',
  '.web.jsx',
  '.jsx',
  '.web.js',
  '.js',
  '.css',
  '.json',
  '.mjs',
];

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [react()],
    resolve: {
      extensions,
      alias: {
        'react-native': reactNativeWebPath,
      },
    },
    define: {
      global: 'window',
      __DEV__: JSON.stringify(isDev),
      DEV: JSON.stringify(isDev),
    },
    optimizeDeps: {
      rolldownOptions: {
        resolve: {
          extensions,
          alias: {
            'react-native': reactNativeWebPath,
          },
        },
      },
    },
  };
});
