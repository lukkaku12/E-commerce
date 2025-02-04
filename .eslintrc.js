module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  plugins: ['@typescript-eslint/eslint-plugin', 'simple-import-sort'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': 'error', // Formato con Prettier
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Prohíbe variables sin usar (excepto las que empiezan con "_")
    'simple-import-sort/imports': 'error', // Ordena los imports automáticamente
    'simple-import-sort/exports': 'error', // Ordena los exports automáticamente
    'sort-imports': 'off', // Desactiva la regla nativa para usar 'simple-import-sort'
  },
};
