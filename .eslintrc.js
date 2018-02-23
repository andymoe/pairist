module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:vue/recommended', '@vue/standard'],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'quote-props': ['error', 'consistent-as-needed'],
    'vue/max-attributes-per-line': [5, 'multiline'],
    'no-console': 'off',
    'no-debugger': 'off',
    'object-curly-spacing': [2, 'always'],
    'array-bracket-spacing': [2, 'never'],
  },
}
