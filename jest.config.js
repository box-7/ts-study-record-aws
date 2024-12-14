export default {
        preset: "ts-jest",
        testEnvironment: "jsdom",
        setupFilesAfterEnv: ["./jest.setup.ts"],
        transform: {
          "^.+\\.(ts|tsx)$": "ts-jest",
        },
        moduleNameMapper: {
          "\\.(css|less)$": "identity-obj-proxy",
          "^@/(.*)$": "<rootDir>/src/$1", // エイリアス設定を追加
        },
      };
