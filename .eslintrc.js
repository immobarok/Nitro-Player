module.exports = {
  root: true,
  extends: '@react-native',
  ignorePatterns: ['dist/'],
  overrides: [
    {
      files: ['*.web.ts', '*.web.tsx'],
      env: {
        browser: true,
      },
      rules: {
        'react-native/no-inline-styles': 'off',
      },
    },
  ],
};
