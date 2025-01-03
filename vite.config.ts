// Vite の設定ファイル
// TypeScript で記述された Vite の設定ファイルで、プロジェクトのビルドや開発サーバーの設定を行う

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import envCompatible from 'vite-plugin-env-compatible';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    envCompatible({
      prefix: 'VITE', // 環境変数のプレフィックス
      mountedPath: 'process.env', // 環境変数をマウントするパス
    }),
  ],
});

// 設定の詳細
// defineConfig
// defineConfig は、Vite の設定を定義するための関数
// TypeScript の型補完が有効になる

// plugins
// plugins 配列には、Vite のプラグインを設定
// この例では、3つのプラグインが設定されている
        // a. react()
        // react プラグインは、Vite で React をサポートするためのプラグイン
        // React コンポーネントを使用した開発が可能になる

        // b. tsconfigPaths()
        // tsconfigPaths プラグインは、TypeScript の tsconfig.json ファイルに定義されたパスエイリアスを Vite で解決するためのプラグイン
        // tsconfig.json に設定されたパスエイリアスを Vite のビルドプロセスで使用できます。

        // c. envCompatible
        // envCompatible プラグインは、環境変数を Vite のプロジェクトに適用するためのプラグイン
        // 特定のプレフィックスを持つ環境変数を読み込み、指定されたパスにマウント

// prefix: 'VITE':
// 環境変数のプレフィックスを指定
        // プレフィックス（prefix）とは、文字列の先頭に付加される特定の文字列や記号のことを指す
// VITE で始まる環境変数が対象となる

// mountedPath: 'process.env':
// 環境変数をマウントするパスを指定
// 環境変数が process.env にマウント
        // 1 .env ファイル
        // VITE_API_URL=https://api.example.com
        // 2 vite.config.ts
        // vite.config.ts ファイルで envCompatible プラグインを使用して、環境変数を process.env にマウント
        // 3 アプリケーション内で process.env を通じて環境変数にアクセス
        // console.log(process.env.VITE_API_URL); // 環境変数を使用


