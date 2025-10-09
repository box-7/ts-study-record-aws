// backend/init-db.ts
import Database from "better-sqlite3";

const db = new Database("mydb.sqlite");

// テーブル作成
db.prepare(`
  CREATE TABLE IF NOT EXISTS study_record (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    time INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// テストデータを1件追加
db.prepare(`
  INSERT INTO study_record (title, time)
  VALUES (?, ?)
`).run("テスト記録", 30);

console.log("Table 'study_record' created (if not exists).");