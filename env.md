# 環境ごとの .env 変数アクセス方法

## 1️⃣ Node.js
Node.js では `process.env` が標準で使用できます。  
Vite で `mountedPath: 'process.env'` を指定すると、Node.js 実行環境でも `.env` の内容をそのまま参照できます。

例:  
console.log(process.env.VITE_API_URL); // ここで参照可能


## 2️⃣ ブラウザ（Vite フロントエンド）
ブラウザには `process.env` は存在しません。  
そのため、通常 Vite は `.env` の変数を `import.meta.env` にマウントします。

例:  
console.log(import.meta.env.VITE_API_URL); // ブラウザ側ではこれを使う

`mountedPath: 'process.env'` にすると、ブラウザでは `process.env` が存在しないので undefined になります。


## 3️⃣ Jest テスト環境
Jest は Node.js 上で動作するため、`process.env` が使用可能です。  
そのため、`mountedPath: 'process.env'` にしておくと、Jest 内でも `.env` の値をそのまま参照できます。

`import.meta.env` は Jest 環境では使えません（Vite 専用）。


## 🔹 結論

- Node.js / Jest → `process.env` が安全  
- ブラウザ → `import.meta.env` が必須  
- 両方で共通して使う場合は、ビルド時に Vite が `import.meta.env` を適切に書き換える必要があります






