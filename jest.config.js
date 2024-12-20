// jest.config.js
// Jest テストランナーの設定ファイルで、Jest がどのようにテストを実行するかを制御
// このファイルを使用して、テスト環境、トランスフォーマー、モジュールの解決方法、テストの実行方法などを設定

export default {
        preset: "ts-jest",
        // testEnvironment: "jsdom",
        testEnvironment: "jest-environment-jsdom",
        setupFilesAfterEnv: ["./jest.setup.ts"],
        transform: {
                "^.+\\.(ts|tsx)$": "ts-jest", // TypeScript ファイルをトランスパイルするための設定
        },
        moduleNameMapper: {
                "\\.(css|less)$": "identity-obj-proxy", // CSS/LESS ファイルをモックするための設定
                // LESS ファイルは、CSS（Cascading Style Sheets）を拡張したスタイルシート言語である LESS（Leaner Style Sheets）のファイル
                "^@/(.*)$": "<rootDir>/src/$1", // エイリアス設定を追加
        },
};

// ^@/(.*)$:
// ^ は文字列の先頭を示します。
// @/ はエイリアスのプレフィックスです。
// (.*) は任意の文字列にマッチする正規表現です。
// $ は文字列の終わりを示します。
// つまり、@/ で始まる任意の文字列にマッチします。

// <rootDir>/src/$1:
// <rootDir> はプロジェクトのルートディレクトリを示します。
// src は src ディレクトリを示します。
// $1 は、正規表現のキャプチャグループ (.*) にマッチした部分を指します。

// 通常のインポート
// import MyComponent from './src/components/MyComponent';
// エイリアスを使用したインポート
// import MyComponent from '@/components/MyComponent';

// preset:
// Jest のプリセットを指定する。例: ts-jest（TypeScript を使用する場合）。
// testEnvironment:
// テスト環境を指定する。例: jsdom（ブラウザ環境をシミュレートする場合）。
// setupFilesAfterEnv:
// 各テストファイルの実行前に実行するスクリプトを指定する。テストのセットアップやグローバル設定を行うために使用。
// transform:
// ファイルのトランスフォーマーを指定する。例: ts-jest（TypeScript ファイルをトランスパイルする場合）。
// moduleNameMapper:
// モジュールのエイリアスを設定する。特定のパスを別のパスにマッピングするために使用。
// testMatch:
// テストファイルのパターンを指定する。特定のディレクトリ内のファイルをテストファイルとして認識させるために使用。
// collectCoverage:
// カバレッジ情報を収集するかどうかを指定する。
// coverageDirectory:
// カバレッジ情報の出力ディレクトリを指定する。