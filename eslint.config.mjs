import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  // tseslint.configs.recommendedTypeChecked,
  tseslint.configs.strictTypeChecked,
  // tseslint.configs.stylisticTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked]
  }
);
