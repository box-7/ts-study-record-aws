# jest.config.js
Jest テストランナーの設定ファイルで、Jest がどのようにテストを実行するかを制御
このファイルを使用して、テスト環境、トランスフォーマー、モジュールの解決方法、テストの実行方法などを設定

### ドキュメント url
https://jestjs.io/docs/configuration#preset-string

// Jest テストランナーの設定ファイルで、Jest がどのようにテストを実行するかを制御
// このファイルを使用して、テスト環境、トランスフォーマー、モジュールの解決方法、テストの実行方法などを設定
```
// 自分のプロジェクトのjest.config.js

export default {
        // **TypeScript のコードをそのまま Jest で実行できるようにするトランスフォーマー（変換器）
        preset: "ts-jest",
        // jestのテストが実行される前に環境変数（.envファイル）を自動で読み込む
        setupFiles: ["dotenv/config"],
        // Jest のテストを実行する際に使用する環境を指定する
        testEnvironment: "jest-environment-jsdom",
        // 各テスト環境のセットアップ後に実行されるスクリプトを指定
        setupFilesAfterEnv: ["./jest.setup.ts"],
        // TypeScript ファイルを ts-jest で変換してテスト実行
        transform: {
                "^.+\\.(ts|tsx)$": [
                        "ts-jest",
                        {
                                tsconfig: {
                                        module: "ESNext",
                                        target: "ES2020",
                                },
                        },
                ],
        },
        // モジュールのパスや名前のエイリアスをマッピングして Jest が解決できるようにする
        moduleNameMapper: {
                "\\.(css|less)$": "identity-obj-proxy",
                '^@/(.*)$': '<rootDir>/frontend/src/$1',
                '^@shared/(.*)$': '<rootDir>/shared/$1',
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
```

### Jest の設定方法
Jest は「デフォルトでうまく動作する」ことを理念としていますが、必要に応じて柔軟に設定をカスタマイズできます。


### 設定ファイルの基本
設定は **専用の JavaScript / TypeScript / JSON ファイル** に定義することを推奨します。  
Jest は以下の名前のファイルを自動的に検出します：
```
jest.config.js | jest.config.ts | jest.config.mjs | jest.config.cjs | jest.config.cts | jest.config.json
```

または、`--config` フラグを使用して明示的にパスを指定することもできます。

> 💡 **注意:**  
> 最終的な設定オブジェクトは常に **JSON シリアライズ可能** である必要があります。
設定ファイルは単純にオブジェクトをエクスポートする必要があります。

**自分メモ**  
JSON シリアライズ可能
設定ファイル（jest.config.js など）でエクスポートするオブジェクトは、
JSON.stringify() できるものに限る、というルール


# preset [string]
https://jestjs.io/docs/configuration#preset-string

**デフォルト:** `undefined`
### プリセット
Jestにおけるプリセットとは、テスト環境の設定プロセスを効率化し標準化するための事前定義済み設定です。これにより開発者は、特定のトランスフォーマー、ファイル拡張子、その他のオプションを用いてJestを迅速に構成できます。

### preset: "ts-jest" の意味

`ts-jest` は、**TypeScript のコードをそのまま Jest で実行できるようにするトランスフォーマー（変換器）** です。  
`preset: "ts-jest"` を指定すると、以下のような設定が自動的に適用されます 👇


###  `preset: "ts-jest"` が内部で設定する主な内容

| 設定項目 | 自動で設定される内容 |
|-----------|----------------------|
| **transform** | `.ts` / `.tsx` ファイルを `ts-jest` で変換して実行 |
| **moduleFileExtensions** | `["ts", "tsx", "js", "jsx", "json", "node"]` が自動追加 |
| **testEnvironment** | デフォルトで `"node"`（ただし変更可能） |
| **globals** | TypeScript の設定ファイル (`tsconfig.json`) を自動で検出して使用 |
| **sourceMap サポート** | `ts-jest` により Jest で TypeScript のスタックトレースが正しく表示されるようになる |



---
# setupFiles [array]

**デフォルト:** `[]`

| 設定項目 | 内容 |
|-----------|------|
| setupFiles | 各テスト実行前に読み込むスクリプトを指定する |
| "dotenv/config" | `.env` ファイルの環境変数を `process.env` に自動で読み込む |
| 効果 | `.env` の設定を手動で import しなくてもテストで使えるようにする |


---
# testEnvironment [string]
https://jestjs.io/docs/configuration#testenvironment-string

**デフォルト:** `"node"`

| 設定項目 | 内容 |
|-----------|------|
| testEnvironment | テスト実行時の環境を指定する |
| "jest-environment-jsdom" | ブラウザのような DOM 環境を再現してテストを実行する |
| 効果 | React コンポーネントや DOM 操作を伴うテストを Node.js 上で実行できるようにする |

`jest-environment-jsdom` は、**ブラウザ環境をシミュレートするテスト環境** です。

Jest はもともと **Node.js 上で動作** しますが、`jsdom` を利用することで  
以下のような **ブラウザ API** を仮想的に再現できます。

- `DOM`
- `window`
- `document`
- `HTMLElement` など


---
# setupFilesAfterEnv [array]

**デフォルト:** `[]`

| 設定項目 | 内容 |
|-----------|------|
| setupFilesAfterEnv | 各テスト環境のセットアップ後に実行されるスクリプトを指定する |
| "./jest.setup.ts" | Jest のカスタム設定（例：`@testing-library/jest-dom` のマッチャ追加など）を読み込む |
| 効果 | すべてのテストで共通の初期設定を自動的に適用できるようにする |


# transform
https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object

### preset: "ts-jest" の意味

`ts-jest` は、**TypeScript のコードをそのまま Jest で実行できるようにするトランスフォーマー（変換器）** です。  
`preset: "ts-jest"` を指定すると、以下のような設定が自動的に適用されます 👇

### `preset: "ts-jest"` が内部で設定する主な内容

| 設定項目 | 自動で設定される内容 |
|-----------|----------------------|
| **transform** | `.ts` / `.tsx` ファイルを `ts-jest` で変換して実行 |
| **moduleFileExtensions** | `["ts", "tsx", "js", "jsx", "json", "node"]` が自動追加 |
| **testEnvironment** | デフォルトで `"node"`（ただし変更可能） |
| **globals** | TypeScript の設定ファイル (`tsconfig.json`) を自動で検出して使用 |
| **sourceMap サポート** | `ts-jest` により Jest で TypeScript のスタックトレースが正しく表示されるようになる |


---

# moduleNameMapper [object<string, string | array<string>>]
https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring

**デフォルト:** `null`

### moduleNameMapper の意味

`moduleNameMapper` は、**特定のインポートパスやモジュール名を Jest が正しく解決できるようにマッピングする設定** です。  
これにより、CSS や LESS のインポート、エイリアスパスのモジュールなどをテスト実行時に適切に処理できます。

### moduleNameMapper の設定内容と効果

| 設定項目 | 内容 |
|-----------|------|
| `\\.(css|less)$` | CSS または LESS ファイルの拡張子にマッチ |
| `"identity-obj-proxy"` | CSS モジュールのインポートを Jest 内でモックとして扱う |
| `^@/(.*)$` | `@/` で始まるパスを対象とする正規表現 |
| `<rootDir>/frontend/src/$1` | 上記パスをプロジェクトの `frontend/src` ディレクトリにマッピング |
| `^@shared/(.*)$` | `@shared/` で始まるパスを対象とする正規表現 |
| `<rootDir>/shared/$1` | 上記パスをプロジェクトの `shared` ディレクトリにマッピング |
| **効果** | Jest がエイリアスや CSS/LESS モジュールを理解して正しく読み込めるようになる |




