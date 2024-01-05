import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'style/brace-style': ['error', '1tbs', { allowSingleLine: false }],
    'style/max-statements-per-line': 'off',
    'style/max-len': ['error', { code: 120 }],
    'curly': ['error', 'all'],
  },
})
