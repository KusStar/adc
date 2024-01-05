import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'style/brace-style': ['error', '1tbs', { allowSingleLine: false }],
    'style/max-statements-per-line': 'off',
    'curly': ['error', 'all'],
  }
})
