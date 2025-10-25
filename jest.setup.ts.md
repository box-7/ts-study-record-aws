# jest.setup.ts
Jest テストランナーのセットアップファイルで、各テストファイルの実行前に実行されるスクリプトを定義するために使用される

### 自分のプロジェクトのコード
```
// パッケージをインポートして、Jest のカスタムマッチャを追加する  
import '@testing-library/jest-dom';
// .env ファイルの内容を自動的に読み込んで process.env に反映させるためのショートカット構文
import 'dotenv/config';

// アラートをモック化
window.alert = jest.fn();

if (typeof global.structuredClone === 'undefined') {
        global.structuredClone = (obj) => obj === undefined ? undefined : JSON.parse(JSON.stringify(obj));
}
```

### structuredClone  
JavaScript のオブジェクトを深くコピーするための標準的なメソッド  
深いコピーとは、オブジェクトのすべてのプロパティとそのネストされたオブジェクトを再帰的にコピーすることを意味する  
これにより、元のオブジェクトとコピーされたオブジェクトが完全に独立した状態になる  

Window: structuredClone() メソッド  
https://developer.mozilla.org/ja/docs/Web/API/Window/structuredClone

### 動作の説明

- `typeof global.structuredClone === 'undefined'`  
  `structuredClone` が既に定義されているかどうかを確認

- `global.structuredClone` に代入される関数の動作:
  - 引数 `obj` が `undefined` の場合は `undefined` を返す
  - それ以外の場合は `JSON.parse(JSON.stringify(obj))` により **深いコピー** を作成
  - ネストされたオブジェクトも再帰的にコピー
  - 元のオブジェクトとコピーは完全に独立

### コピーされるもの

- JavaScript のオブジェクトや配列などのデータ構造
  - オブジェクトリテラル `{}`  
  - 配列 `[]`  
  - ネストされたオブジェクト（オブジェクトの中にオブジェクトや配列がある場合も再帰的にコピー）
- プリミティブ値も含まれる
  - `string`、`number`、`boolean`、`null`、`undefined`

## コピーされないもの（JSON ベースの場合の制限）

- 関数 `function` はコピーされず無視される
- `Date` や `Map`、`Set` などの特殊オブジェクトは文字列化されて復元されない
- `Symbol` やプロトタイプチェーンの情報は失われる
- 循環参照（自分自身を参照するオブジェクト）はエラーになる

## 注意

- このフォールバック版は **JSON 化できるデータ** のみ安全に深くコピー可能