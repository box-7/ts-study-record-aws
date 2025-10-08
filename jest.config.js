// jest.config.js
// Jest テストランナーの設定ファイルで、Jest がどのようにテストを実行するかを制御
// このファイルを使用して、テスト環境、トランスフォーマー、モジュールの解決方法、テストの実行方法などを設定

export default {
        preset: "ts-jest",
        setupFiles: ["dotenv/config"],
        testEnvironment: "jest-environment-jsdom",
        setupFilesAfterEnv: ["./jest.setup.ts"],
        transform: {
                "^.+\\.(ts|tsx)$": "ts-jest",
        },
        moduleNameMapper: {
                "\\.(css|less)$": "identity-obj-proxy",
                "^@/(.*)$": "<rootDir>/src/$1",
        },
        // Jestのテスト結果をHTML形式でレポートするための設定
        // 具体的には、jest-html-reporters パッケージを使用して、テスト結果をHTMLファイルとして生成
        reporters: [
                "default",
                ["jest-html-reporters", {
                        "publicPath": "./html-report",
                        "filename": "jest_html_reporters.html",
                        "expand": true
                }]
        ]
};