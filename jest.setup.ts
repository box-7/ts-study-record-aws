// jest.setup.ts
// Jest テストランナーのセットアップファイルで、各テストファイルの実行前に実行されるスクリプトを定義するために使用される

import '@testing-library/jest-dom';
import 'dotenv/config';

window.alert = jest.fn();

if (typeof global.structuredClone === 'undefined') {
        global.structuredClone = (obj) => obj === undefined ? undefined : JSON.parse(JSON.stringify(obj));
}