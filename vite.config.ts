// Vite.config.ts
// TypeScript で記述された Vite の設定ファイルで、プロジェクトのビルドや開発サーバーの設定を行う

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import envCompatible from 'vite-plugin-env-compatible';

export default defineConfig({
        root: 'frontend', // プロジェクトのルートディレクトリを 'frontend' に設定
        plugins: [
                react(),
                tsconfigPaths(),
                envCompatible({
                        prefix: 'VITE', // 環境変数のプレフィックス
                        mountedPath: 'process.env', // 環境変数をマウントするパス
                }),
        ],
});



