 {
    // プロジェクト名
    "name": "sample-vite-ts",

    // npm publish されないようにする設定（private=true）
    // "private": true を設定すると、間違って npm publish を実行しても公開されず、プライベートプロジェクトとして扱われる
    "private": true,

    // プロジェクトのバージョン
    "version": "0.0.0",

    // ES モジュールとして実行することを指定
    "type": "module",

    // npm scripts
    "scripts": {
        // Vite 開発サーバーを起動
        "dev": "vite",

        // TypeScript ビルド + Vite プロダクションビルド
        "build": "tsc -b && vite build",

        // ESLint を実行してコードをチェック
        "lint": "eslint .",

        // Vite のビルド結果をプレビュー
        "preview": "vite preview",

        // Jest を実行してテスト
        "test": "jest",

        // Prettier で src 内のコードを整形
        "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,scss,md}\"",

        // Node.js で TypeScript を直接実行（ts-node の ESM ローダーを使用）
        // node：Node.js を実行するコマンド。
        // --loader ts-node/esm：Node の ESM ローダーとして ts-node/esm を使う（TypeScript をそのまま実行できるようにする）。
        // backend/server.ts：実行するエントリーポイント（TypeScript ファイル）のパス。
        // このスクリプトは「TypeScript の server.ts を事前にトランスパイルせずに ts-node の ESM ローダー経由で直接実行する」ためのコマンド。実行方法は以下。

        "server": "node --loader ts-node/esm backend/server.ts"
    },

    // 本番・開発で使用するライブラリ
    "dependencies": {
        "@chakra-ui/react": "^3.2.3",       // Chakra UI React コンポーネント
        "@emotion/react": "^11.13.5",       // Emotion CSS-in-JS
        "@prisma/client": "^6.17.1",        // Prisma クライアント
        "@supabase/supabase-js": "^2.47.2", // Supabase JS SDK
        "axios": "^1.12.2",                 // HTTP クライアント
        "better-sqlite3": "^12.4.1",        // SQLite データベース
        "cors": "^2.8.5",                   // CORS ミドルウェア
        "dotenv": "^16.4.7",                // 環境変数読み込み
        "express": "^5.1.0",                // Web サーバー
        "firebase": "^11.0.2",              // Firebase SDK
        "next-themes": "^0.4.4",            // Next.js 用テーマ切替
        "prisma": "^6.17.1",                // Prisma CLI
        "react": "^18.3.1",                 // React
        "react-dom": "^18.3.1",             // React DOM
        "react-hook-form": "^7.54.0",       // React Hook Form
        "react-icons": "^5.4.0",            // React アイコンライブラリ
        "uuid": "^11.0.3",                  // UUID 生成
        "vite-plugin-env-compatible": "^2.0.1" // Vite で dotenv を互換的に扱う
    },

    // 開発中に必要なツールや型定義
    "devDependencies": {
        "@eslint/js": "^9.15.0",                   // ESLint JS 用
        "@testing-library/jest-dom": "^6.6.3",     // Jest DOM マッチャ
        "@testing-library/react": "^16.1.0",       // React テストライブラリ
        "@testing-library/user-event": "^14.5.2",  // ユーザーイベントシミュレーション
        "@types/better-sqlite3": "^7.6.13",       // TypeScript 型定義
        "@types/cors": "^2.8.19",
        "@types/express": "^5.0.3",
        "@types/jest": "^29.5.14",
        "@types/node": "^24.7.0",
        "@types/react": "^18.3.12",
        "@types/react-dom": "^18.3.1",
        "@types/uuid": "^10.0.0",
        "@vitejs/plugin-react": "^4.3.4",          // Vite React プラグイン
        "eslint": "^9.15.0",                       // ESLint
        "eslint-plugin-react-hooks": "^5.0.0",     // React Hooks ルール
        "eslint-plugin-react-refresh": "^0.4.14",  // React Fast Refresh ルール
        "globals": "^15.12.0",                     // グローバル変数定義
        "identity-obj-proxy": "^3.0.0",            // CSS モジュール用モック
        "jest-environment-jsdom": "^29.7.0",       // Jest のブラウザ環境
        "jest-html-reporters": "^3.1.7",           // Jest HTML レポート
        "prettier": "^3.4.2",                       // コード整形ツール
        "ts-jest": "^29.2.5",                       // Jest + TypeScript
        "ts-node": "^10.9.2",                       // TypeScript 直接実行
        "typescript": "~5.6.2",                     // TypeScript 本体
        "typescript-eslint": "^8.15.0",            // TypeScript ESLint
        "vite": "^6.0.1",                           // Vite
        "vite-tsconfig-paths": "^5.1.4"            // tsconfig のパスを Vite で利用
    }
}
