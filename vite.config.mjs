import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
        'react-native': 'react-native-web',
      },
    },
    define: {
      global: 'window',
      __DEV__: JSON.stringify(isDev),
      DEV: JSON.stringify(isDev),
    },
    optimizeDeps: {
      esbuildOptions: {
        resolveExtensions: extensions,
        loader: {
          '.js': 'jsx',
        },
      },
    },
  };
});
