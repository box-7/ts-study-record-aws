// backend/server.ts
import express, { Request, Response } from "express";
import Database from "better-sqlite3";
import cors from "cors";
import { Record } from "./domain/record.ts";

const app = express();
app.use(cors());
app.use(express.json());

// SQLite データベースを開く
const db = new Database("mydb.sqlite");

// SQLite のテーブル構造に合わせた型
interface StudyRecord {
        id: string;         // number → string に変更
        title: string;
        time: number;
        created_at: string; // SQLite の datetime 文字列
}

// 全レコード取得 API
app.get("/records", (req: Request, res: Response) => {
        try {
                // SQLite から取得し、created_at 昇順に並べる
                const rows = db
                        .prepare("SELECT * FROM study_record ORDER BY created_at ASC")
                        .all() as StudyRecord[];

                // Record 型に変換して返す
                const records: Record[] = rows.map((r) =>
                        Record.newRecord(r.id, r.title, r.time)
                );

                res.json(records);
        } catch (err: unknown) {
                if (err instanceof Error) {
                        res.status(500).json({ error: err.message });
                } else {
                        res.status(500).json({ error: "Unknown error" });
                }
        }
});

// サーバー起動
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));