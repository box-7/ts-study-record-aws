# jest.config.js
Jest テストランナーの設定ファイルで、Jest がどのようにテストを実行するかを制御
このファイルを使用して、テスト環境、トランスフォーマー、モジュールの解決方法、テストの実行方法などを設定

# jest.setup.ts
Jest テストランナーのセットアップファイルで、各テストファイルの実行前に実行されるスクリプトを定義するために使用される

# Vite.config.ts
TypeScript で記述された Vite の設定ファイルで、プロジェクトのビルドや開発サーバーの設定を行う

# envへのアクセス
- Node.js / Jest → `process.env` が安全  
- ブラウザ → `import.meta.env` が必須  
- 両方で共通して使う場合は、ビルド時に Vite が `import.meta.env` を適切に書き換える必要があります

Vite.config.tsの、vite-plugin-env-compatible(ブラウザ（Vite でビルドされたフロントエンド）と Node.js（サーバーや Jest テスト）) により、両環境で process.env が使える

# package.json
プロジェクトのメタ情報、依存関係、スクリプトなどを管理するファイル。

- npm や yarn で依存パッケージを管理する
- `"scripts"` で開発・ビルド・テスト・整形などのコマンドを定義
- `"dependencies"` と `"devDependencies"` により本番用／開発用パッケージを区別
- `"private": true` を設定すると npm に公開できない

# tsconfig.json
TypeScript のコンパイラ設定ファイル。

- プロジェクト内の TypeScript コードをコンパイルする際のルールを定義
- `"compilerOptions"` でターゲットの JavaScript バージョン、モジュール形式、型チェックの設定などを指定
- `"include"` や `"exclude"` でコンパイル対象のファイルを制御

# .prettierrc
Prettier の設定ファイルで、コード整形ルールをプロジェクト単位で定義。

- 例：`"singleQuote": true` → 文字列をシングルクォートで囲む
- 例：`"trailingComma": "es5"` → 配列・オブジェクトの末尾に ES5 で有効な場所でカンマを付与
- `package.json` の `"format"` スクリプトなどで呼び出して適用可能

# ESLint
JavaScript/TypeScript の静的解析ツールで、コード品質とスタイルをチェック。

- コードに潜むバグや不適切な書き方を警告
- React プロジェクトでは `eslint-plugin-react-hooks` や `eslint-plugin-react-refresh` などのプラグインも使用
- VS Code ではリアルタイムで警告（波線）を表示可能
- `"lint"` スクリプトで手動実行もできるし、VS Code 上で自動で警告を表示できる


