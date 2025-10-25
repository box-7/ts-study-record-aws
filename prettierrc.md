### `.prettierrc` と npm スクリプトでの整形

`.prettierrc` は Prettier の設定ファイルで、プロジェクト単位でコード整形（フォーマット）のルールを定義できます。  

例えば、`singleQuote` を `true` に設定すると文字列がシングルクォートで統一され、`trailingComma` を `es5` に設定すると ES5 互換の場所で末尾カンマが付与されます。  

さらに、`package.json` に整形用のスクリプトを追加することで、コマンド一つで Prettier を実行できます。  
例えば、`format` というスクリプトを `"prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,scss,md}\""` と設定しておくと、`npm run format` を実行するだけで `src` 配下の対象ファイルが `.prettierrc` のルールに従って自動整形されます。  
```
npm run format
```
初回実行時は既存コードに大きな変更が入る可能性があります。

| 設定項目       | 内容 |
|----------------|------|
| singleQuote    | 文字列をダブルクォートではなくシングルクォート `'` で囲む |
| trailingComma  | 配列やオブジェクトの末尾にカンマを付けるかどうかを指定 (`"es5"` は ES5 で有効な場所にカンマを付与) |
