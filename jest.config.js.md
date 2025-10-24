ドキュメント url
https://jestjs.io/docs/configuration#preset-string

// Jest テストランナーの設定ファイルで、Jest がどのようにテストを実行するかを制御
// このファイルを使用して、テスト環境、トランスフォーマー、モジュールの解決方法、テストの実行方法などを設定
```
// 自分のプロジェクトのjest.config.js

export default {
        preset: "ts-jest",
        setupFiles: ["dotenv/config"],
        testEnvironment: "jest-environment-jsdom",
        setupFilesAfterEnv: ["./jest.setup.ts"],
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

# Jest の設定方法

Jest は「デフォルトでうまく動作する」ことを理念としていますが、必要に応じて柔軟に設定をカスタマイズできます。

---

### 🔧 設定ファイルの基本

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

`preset` は、Jest の設定のベースとして使用されるプリセットを指定します。  
プリセットは、ルートに以下のいずれかのファイルを持つ npm モジュールを指す必要があります。

- `jest-preset.json`
- `jest-preset.js`
- `jest-preset.cjs`
- `jest-preset.mjs`

```
// 自分のプロジェクト
        preset: "ts-jest",
```
ts-jest
https://kulshekhar.github.io/ts-jest/docs/getting-started/presets

プリセット
Jestにおけるプリセットとは、テスト環境の設定プロセスを効率化し標準化するための事前定義済み設定です。これにより開発者は、特定のトランスフォーマー、ファイル拡張子、その他のオプションを用いてJestを迅速に構成できます。

ts-jestは、有用と判断した内容に基づいた非常に意見の強いプリセットを提供します。

重要
プリセットを使用する現在のベストプラクティスは、以下のユーティリティ関数のいずれかを呼び出してプリセットを作成（および必要に応じて拡張）することです。レガシーなプリセットはページ下部に記載されています。

---
# setupFiles [array]

**デフォルト:** `[]`

テスト環境を構成またはセットアップするために、いくつかのコードを実行するモジュールへのパスのリストです。  
各 `setupFile` は **テストファイルごとに1回** 実行されます。

各テストは独自の環境で実行されるため、  
これらのスクリプトは **`setupFilesAfterEnv` より前**、  
かつ **テストコードそのものを実行する前** にテスト環境内で実行されます。

---

### 💡 ヒント

もしセットアップスクリプトが **CommonJS（CJS）モジュール** である場合、  
非同期関数（`async function`）をエクスポートすることができます。  
Jest はその関数を呼び出し、結果が返るまで待機します。  
これは、非同期的にデータを取得したい場合などに便利です。

一方、ファイルが **ESM モジュール** である場合は、  
**トップレベル await** を使用して同様の動作を実現できます。

**自分メモ**
```
// 自分のプロジェクト
        setupFiles: ["dotenv/config"],
```


- テスト実行前に `dotenv/config` モジュールを読み込み、`.env` の内容を `process.env` に設定する
- 例 `.env`:

```ini
API_KEY=123456
NODE_ENV=test
```
テスト中は以下のように環境変数を使用可能:

```
process.env.API_KEY // "123456"
process.env.NODE_ENV // "test"
```
実行タイミング:

各テストファイルの実行前に 1 回だけ実行

setupFilesAfterEnv より先に実行される

テストコード実行前に環境変数がすでにセットされた状態になる

---
# testEnvironment [string]
https://jestjs.io/docs/configuration#testenvironment-string

デフォルト: "node"

テストに使用するテスト環境。Jestのデフォルト環境はNode.js環境です。Webアプリケーションを構築している場合は、代わりにjsdomを通じてブラウザのような環境を使用できます。

ファイルの先頭に@jest-environmentドキュメントブロックを追加することで、そのファイル内のすべてのテストで使用する別の環境を指定できます:

```
// 自分のプロジェクト
        testEnvironment: "jest-environment-jsdom",
```

`jest-environment-jsdom` は、**ブラウザ環境をシミュレートするテスト環境** です。

Jest はもともと **Node.js 上で動作** しますが、`jsdom` を利用することで  
以下のような **ブラウザ API** を仮想的に再現できます。

- `DOM`
- `window`
- `document`
- `HTMLElement` など

---

###  目的

Node.js 単体では以下のようなコードは実行できません。

```js
document.body.innerHTML = '<button id="btn">Click</button>';
```
なぜなら、Node.js には document が存在しないためです。

しかし jest-environment-jsdom を指定すると、
仮想ブラウザ環境 が自動的に構築され、上記のようなコードも実行できるようになります。

---
# setupFilesAfterEnv [array]

**デフォルト:** `[]`

テストスイート内の各テストファイルが実行される前に、**テストフレームワークを設定または構成するコードを実行するモジュールのパスのリスト** です。  

`setupFiles` はテスト環境にテストフレームワークがインストールされる前に実行されますが、  
`setupFilesAfterEnv` は **フレームワークがインストールされた直後、テストコードの実行前** に実行されます。

### 🔹 意味

- `setupFilesAfterEnv` モジュールは、**各テストファイルで繰り返し必要なコード** を実行するために使用されます  
- テストフレームワークがインストール済みなので、`Jest globals`、`jest` オブジェクト、`expect` がモジュール内で利用可能です  

**自分メモ**
```
        setupFilesAfterEnv: ["./jest.setup.ts"],
```
この設定は、**各テストファイルが実行される前に `./jest.setup.ts` モジュールを読み込む** ことを意味します。

### 🔹 役割
- `jest.setup.ts` 内のコードを実行して、**テストフレームワークの設定や拡張** を行う  
- テストフレームワークがインストール済みの状態で実行されるため、以下が利用可能：
  - `jest` オブジェクト
  - `expect` 関数
  - Jest のグローバル変数

---

# [transform](https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object)


**デフォルト:** `{"\\.[jt]sx?$": "babel-jest"}`

正規表現から変換器へのパスをマッピングします。オプションで、設定オプションを含むタプルを第二引数として渡せます: {filePattern: ['変換器へのパス', {オプション}]}。例えば、babel-jestをデフォルト以外の動作に設定する方法は次の通りです: {'\\.js$': ['babel-jest', {rootMode: 'upward'}]}。

JestはプロジェクトのコードをJavaScriptとして実行するため、Nodeが標準でサポートしない構文（JSX、TypeScript、Vueテンプレートなど）を使用する場合はトランスフォーマーが必要です。デフォルトでは、Jestはbabel-jestトランスフォーマーを使用します。これはプロジェクトのBabel設定を読み込み、/\.[jt]sx?$/という正規表現に一致するファイル（つまり.js、.jsx、.ts、.tsxファイル）を変換します。さらに、babel-jestはESモジュールモッキングで説明したモックのホイストに必要なBabelプラグインを注入します。

詳細および独自のトランスフォーマー構築手順については、コード変換セクションを参照してください。

🔹 トランスフォーマーの目的
- Jest はプロジェクトのコードを JavaScript として実行します
- Node.js が標準でサポートしていない構文（JSX、TypeScript、Vue テンプレートなど）を使用している場合、トランスフォーマーで変換 が必要です
- デフォルトでは babel-jest が使用され、プロジェクトの Babel 設定を読み込んで次のファイルを変換します：
- .js, .jsx, .ts, .tsx（正規表現 /\.[jt]sx?$/ にマッチするファイル）
- さらに、ES Module のモックで必要な Babel プラグインも自動で注入されます

🔹 注意点
- トランスフォーマーは ファイルが変更されない限り、ファイルごとに 1 回だけ実行 されます
- デフォルトの babel-jest を使用しつつ、追加のコードプリプロセッサを使いたい場合は、明示的に指定する必要があります


**自分メモ**
自分プロジェクトの設定:
```ts
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
```
🔹 意味
"^.+\\.(ts|tsx)$"
- 拡張子が .ts または .tsx のファイルを対象にする正規表現
- すべての TypeScript ファイルをトランスフォーマーで処理する

"ts-jest"
- TypeScript ファイルを Jest が理解できる JavaScript に変換するトランスフォーマー
- JSX や TypeScript の構文もサポート

オプションオブジェクト
```
{
  tsconfig: {
    module: "ESNext",
    target: "ES2020",
  }
}
```
- TypeScript のコンパイル設定を指定
- module: "ESNext" → モジュールシステムを ESNext に変換
- target: "ES2020" → 出力される JavaScript のバージョンを ES2020 に設定

🔹 結果  
Jest は .ts / .tsx ファイルを ts-jest を通して変換して実行  
指定した TypeScript コンパイル設定が適用される  
TypeScript と最新の ECMAScript 機能を使ったテストが可能になる


---

# moduleNameMapper [object<string, string | array<string>>]
https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring

**デフォルト:** `null`

正規表現をモジュール名またはモジュール名の配列にマッピングする設定です。  
これにより、画像やスタイルなどのリソースを **単一のモジュールでスタブ化** することができます。

- マッピングされたモジュールは、**自動モックの設定に関わらずデフォルトでモックされません**。
- `<rootDir>` トークンを使うと、プロジェクトのルートディレクトリを参照できます。
- 正規表現のキャプチャグループは、**番号付きバックリファレンス** で置換可能です。


export default config;
🔹 注意点
- マッピングの 定義順が重要
- 上から順にパターンをチェックし、最初にマッチしたルールが適用される
- 配列の場合も同様
- 境界 ^$ を指定せずにモジュール名を設定すると、意図しない置換が発生する可能性があります
- 例: "relay" をマッピングした場合、relay、react-relay、graphql-relay などすべてが置換される

**自分メモ**
```
        moduleNameMapper: {
                "\\.(css|less)$": "identity-obj-proxy",
                '^@/(.*)$': '<rootDir>/frontend/src/$1',
                '^@shared/(.*)$': '<rootDir>/shared/$1',
        },
```

### 🔹 各マッピングの意味

1. `\\.(css|less)$`: `"identity-obj-proxy"`  
   - `.css` または `.less` ファイルを **スタブ化**  
   - `identity-obj-proxy` を使うことで、インポートした CSS モジュールをオブジェクトとして扱える  
   - 例:  
     ```ts
     import styles from './style.css';
     console.log(styles.className); // className がそのまま文字列として利用可能
     ```

→「スタブ化（stub）」とは、テスト用に本物のモジュールやファイルの代わりに 簡易版（ダミー）を置き換えること

2. `'^@/(.*)$'`: `'<rootDir>/frontend/src/$1'`  
   - インポートパスで `@/` から始まるものを、プロジェクトルートの `frontend/src` に置換  
   - 例:  
     ```ts
     import MyComponent from '@/components/MyComponent';
     // <rootDir>/frontend/src/components/MyComponent に変換される
     ```

3. `'^@shared/(.*)$'`: `'<rootDir>/shared/$1'`  
   - インポートパスで `@shared/` から始まるものを、プロジェクトルートの `shared` に置換  
   - 例:  
     ```ts
     import Utils from '@shared/utils';
     // <rootDir>/shared/utils に変換される
     ```

### 🔹 要点

- CSS や LESS は **モック化** してテストに影響を与えないようにする  
- `@` や `@shared` の **パスエイリアスを Jest に認識させる**  
- これにより、フロントエンドのエイリアス付きインポートを Jest のテストでも問題なく使える






