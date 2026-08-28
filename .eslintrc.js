module.exports = {
  extends: 'expo',
  rules: {
    'import/no-unresolved': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  },
};
