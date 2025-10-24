# Configuring Vite  

自分のプロジェクト
```
react プラグインは、Vite で React をサポートするためのプラグイン
defineConfig は、Vite の設定を定義するための関数  TypeScript の型補完が有効になる
tsconfigPaths プラグインは、TypeScript の tsconfig.json ファイルに定義されたパスエイリアスを Vite で解決するためのプラグイン
envCompatible プラグインは、環境変数を Vite のプロジェクトに適用するためのプラグイン
特定のプレフィックスを持つ環境変数を読み込み、指定されたパスにマウント

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import envCompatible from 'vite-plugin-env-compatible';

export default defineConfig({
        root: 'frontend',
        plugins: [
                react(),
                tsconfigPaths(),
                envCompatible({
                        prefix: 'VITE', // 環境変数のプレフィックス
                        mountedPath: 'process.env', // 環境変数をマウントするパス
                }),
        ],
});
```

### 環境変数のプレフィックスについて
VITE_ がプレフィックスです。  
Vite はこのプレフィックス付きの環境変数だけを import.meta.env でアプリ側に渡します。  
API_URL や APP_NAME はプレフィックスなしでは渡されません。  
mountedPath: 'process.env' を指定すると、Vite の import.meta.env ではなく、
process.env を使って環境変数にアクセスすることになる

prefix: 'VITE':  
環境変数のプレフィックスを指定  
プレフィックス（prefix）とは、文字列の先頭に付加される特定の文字列や記号のことを指す  
VITE で始まる環境変数が対象となる  

mountedPath: 'process.env':  
環境変数をマウントするパスを指定  
環境変数が process.env にマウント

1 .env ファイル  
VITE_API_URL=https://api.example.com  
2 vite.config.ts  
vite.config.ts ファイルで envCompatible プラグインを使用して、環境変数を process.env にマウント  
3 アプリケーション内で process.env を通じて環境変数にアクセス  
console.log(process.env.VITE_API_URL); 環境変数を使用  


---
# tsconfigPaths プラグインの役割
TypeScript では、`tsconfig.json` 内にパスエイリアスを設定できます。例えば、以下のように設定します。

{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@shared/*": ["shared/*"]
    }
  }
}

この設定により、TypeScript はコンパイル時に `@/components/Button` を `src/components/Button` に解決できるようになります。

## 問題点
Vite（ブラウザで動くビルドツール）は Node.js とは別にモジュールを解決するため、tsconfig のパスエイリアスをそのまま認識できません。そのままでは `import Button from '@/components/Button'` はビルド時にエラーになります。

## tsconfigPaths プラグインの効果
Vite にこのプラグインを追加すると、Vite が tsconfig の `paths` を読み取り、ビルド時に正しいファイルパスに変換してくれます。これにより、TypeScript で書いたパスエイリアスを Vite の開発環境やビルドでもそのまま使えるようになります。

---


# Vite の設定 (Configuring Vite)
https://vite.dev/config/?utm_source=chatgpt.com

### 1. Vite 設定ファイルの自動解決

- コマンドラインから `vite` を実行すると、Vite はプロジェクトルートにある `vite.config.js`（他の JS / TS 拡張子もサポート）を自動的に解決します。
- 最も基本的な設定ファイル例:

```js
// vite.config.js
export default {
  // config options
}
```
注意: Vite は ES モジュール構文をサポートしており、プロジェクトが Node ESM を使用していなくても（package.json に "type": "module" がなくても）設定ファイルを自動的に前処理して読み込みます。

明示的に設定ファイルを指定したい場合は、CLI の --config オプションを使用します（カレントディレクトリを基準に解決されます）:

bash
```
vite --config my-config.js
```

3. 設定ファイルでの Intellisense
Vite は TypeScript の型定義を提供しているため、IDE の Intellisense を活用できます。

defineConfig ヘルパーを使う方法
ts
```
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```


# Shared Options
https://vite.dev/config/shared-options.html

### root

- **型 (Type):** `string`  
- **デフォルト (Default):** `process.cwd()`  

プロジェクトのルートディレクトリを指定します（`index.html` が存在する場所）。  
絶対パス、またはカレントディレクトリに対する相対パスで指定可能です。

> 詳細は [Project Root](https://vite.dev/config/#root) を参照してください。

# plugins
https://vite.dev/config/shared-options.html  
**型:** `(Plugin | Plugin[] | Promise<Plugin | Plugin[]>)[]`

Vite で使用するプラグインの配列です。

- `falsy` な値（`null` や `undefined` など）は無視されます  
- 配列内のプラグインはフラット化されます  
- `Promise` を返す場合は、Vite が実行前に解決します

詳細は [Plugin API](https://vitejs.dev/guide/api-plugin.html) を参照してください。



