// jest.setup.ts
// Jest テストランナーのセットアップファイルで、各テストファイルの実行前に実行されるスクリプトを定義するために使用される

// @testing-library/jest-dom パッケージをインポートして、Jest のカスタムマッチャを追加する
import '@testing-library/jest-dom';

// require('dotenv').config();
// Node.js 環境で、アプリケーション内で環境変数を設定するためのコード
// 「アプリケーション内」とは、ローカル環境、テスト環境（例えば Jest を使用したテスト環境）、および本番環境など、Node.js が実行されるすべての環境
// require は、Node.js の組み込み関数で、モジュールをインポートするために使用される
// require('dotenv'):で、dotenv パッケージをインポート
// .config():は、dotenv パッケージの config メソッドを呼び出す
// プロジェクトのルートディレクトリにある .env ファイルを読み込み、その内容を process.env オブジェクトに設定
require('dotenv').config();

// structuredClone は、JavaScript のオブジェクトを深くコピーするための標準的なメソッド
// 深いコピーとは、オブジェクトのすべてのプロパティとそのネストされたオブジェクトを再帰的にコピーすることを意味する
// これにより、元のオブジェクトとコピーされたオブジェクトが完全に独立した状態になる
global.structuredClone = (obj) => {
  console.log("jest.setup.ts", obj);
  if (obj === undefined) return undefined;
  return JSON.parse(JSON.stringify(obj));
};

// structuredClone の特徴
// 深いコピー:
// オブジェクトのすべてのプロパティとそのネストされたオブジェクトを再帰的にコピー
// 循環参照のサポート:
// 循環参照を含むオブジェクトも正しくコピー
// 特殊なオブジェクトのサポート:
// Date オブジェクト、Map、Set、ArrayBuffer などの特殊なオブジェクトも正しくコピー

// JSON.parse(JSON.stringify(obj)):
// オブジェクトを JSON 文字列に変換し、その後 JSON 文字列を再度オブジェクトに変換することで、オブジェクトの深いコピーを作成する方法
// 簡単に深いコピーを作成できる
// 関数やシンボルはコピーされない
// 循環参照を含むオブジェクトはエラーが発生する
// Date オブジェクトや Map、Set などの特殊なオブジェクトは正しくコピーされない






// import "@testing-library/jest-dom";

// require("dotenv").config();

// じんさんslack追加分
// global.structuredClone = (val) => {
//   return JSON.parse(JSON.stringify(val));
// };

// if (!global.structuredClone) {
//   global.structuredClone = function structuredClone(objectToClone: any) {
//     const stringified = JSON.stringify(objectToClone);
//     const parsed = JSON.parse(stringified);
//     return parsed;
//   };
// }

// import '@testing-library/jest-dom';
// import 'dotenv/config';

// global.structuredClone = (val) => {
//         return JSON.parse(JSON.stringify(val));
//       };

//       if(!global.structuredClone){
//         global.structuredClone = function structuredClone(objectToClone: any) {
//               const stringified = JSON.stringify(objectToClone);
//               const parsed = JSON.parse(stringified);
//               return parsed;
//             }
//     }

// structuredClone のポリフィル
// if (typeof global.structuredClone === 'undefined') {
//   global.structuredClone = (value: any) => {
//     return JSON.parse(JSON.stringify(value));
//   };
// }

// import '@testing-library/jest-dom';
// import 'core-js/actual/structured-clone';

// require('dotenv').config();

// if (!global.structuredClone) {
//   global.structuredClone = function structuredClone(objectToClone: any) {
//     const stringified = JSON.stringify(objectToClone);
//     const parsed = JSON.parse(stringified);
//     return parsed;
//   };
// }
