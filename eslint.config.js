// ESLint の公式 JS 設定をインポート
import js from '@eslint/js'

// ブラウザや Node などのグローバル変数定義をインポート
import globals from 'globals'

// React Hooks 専用 ESLint プラグインをインポート
import reactHooks from 'eslint-plugin-react-hooks'

// React Fast Refresh 用 ESLint プラグインをインポート
import reactRefresh from 'eslint-plugin-react-refresh'

// TypeScript 用 ESLint 設定をインポート
import tseslint from 'typescript-eslint'

// TypeScript ESLint 設定をエクスポート
export default tseslint.config(
  // dist フォルダは ESLint の対象外にする
  { ignores: ['dist'] },
  {
    // 推奨の JS 設定と TypeScript 設定を拡張
    extends: [js.configs.recommended, ...tseslint.configs.recommended],

    // 対象ファイルを TypeScript (*.ts, *.tsx) のみに限定
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      // ECMAScript 2020 の構文をサポート
      ecmaVersion: 2020,

      // ブラウザ環境のグローバル変数を使用可能にする
      globals: globals.browser,
    },

    plugins: {
      // React Hooks のルールを有効化
      'react-hooks': reactHooks,

      // React Fast Refresh のルールを有効化
      'react-refresh': reactRefresh,
    },

    rules: {
      // React Hooks 推奨ルールを追加
      ...reactHooks.configs.recommended.rules,

      // React Refresh ルールをカスタマイズ
      'react-refresh/only-export-components': [
        // 違反時に警告を出す
        'warn',

        // 定数でのコンポーネントエクスポートを許可
        { allowConstantExport: true },
      ],
    },
  },
)