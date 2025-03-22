module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'next/core-web-vitals',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'jsx-a11y'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Reglas para solucionar los problemas identificados
    'no-console': ['warn', { allow: ['warn', 'error'] }], // Advertir sobre console.log
    '@typescript-eslint/no-unused-vars': 'error', // Error para variables no utilizadas
    '@typescript-eslint/no-empty-interface': 'warn', // Advertencia para interfaces vacías
    '@typescript-eslint/no-explicit-any': 'warn', // Advertencia para el uso de 'any'
    'react/no-unescaped-entities': 'error', // Error para entidades no escapadas
    'react/jsx-uses-react': 'error', // Asegurar que React se use correctamente
    'react/jsx-uses-vars': 'error', // Asegurar que las variables JSX se usen correctamente
    'react/react-in-jsx-scope': 'off', // No es necesario importar React en Next.js
    
    // Reglas adicionales para mejorar la calidad del código
    'prefer-const': 'error', // Preferir const sobre let cuando sea posible
    'no-var': 'error', // No usar var
    'eqeqeq': ['error', 'always'], // Usar === en lugar de ==
    'curly': ['error', 'all'], // Siempre usar llaves para bloques
  },
  overrides: [
    // Reglas específicas para archivos TypeScript
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off', // Desactivar tipos explícitos en fronteras de módulos
      },
    },
    // Reglas específicas para archivos de configuración
    {
      files: ['.eslintrc.js'],
      rules: {
        'import/no-commonjs': 'off', // Permitir module.exports en archivos de configuración
      },
    },
  ],
}
