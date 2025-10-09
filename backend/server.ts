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
        id: string;
        title: string;
        time: number;
        created_at: string;
}

// ------------------- GET /records -------------------
app.get("/records", (req: Request, res: Response) => {
        try {
                const rows = db
                        .prepare("SELECT * FROM study_record ORDER BY created_at ASC")
                        .all() as StudyRecord[];

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

// ------------------- POST /records -------------------
app.post("/records", (req: Request, res: Response) => {
        try {
                const { title, time } = req.body;

                console.log("Received POST /records with body:", req.body);

                if (!title || typeof time !== "number") {
                        return res.status(400).json({ error: "Invalid request body" });
                }

                const stmt = db.prepare(
                        "INSERT INTO study_record (title, time, created_at) VALUES (?, ?, datetime('now'))"
                );
                const info = stmt.run(title, time);

                const newRecord: Record = Record.newRecord(info.lastInsertRowid.toString(), title, time);
                res.status(201).json(newRecord);
        } catch (err: unknown) {
                if (err instanceof Error) {
                        res.status(500).json({ error: err.message });
                } else {
                        res.status(500).json({ error: "Unknown error" });
                }
        }
});

// ------------------- PUT /records/:id -------------------
app.put("/records/:id", (req: Request, res: Response) => {
        try {
                const { id } = req.params;
                const { title, time } = req.body;

                if (!title || typeof time !== "number") {
                        return res.status(400).json({ error: "Invalid request body" });
                }

                const stmt = db.prepare(
                        "UPDATE study_record SET title = ?, time = ? WHERE id = ?"
                );
                const info = stmt.run(title, time, id);

                if (info.changes === 0) {
                        return res.status(404).json({ error: "Record not found" });
                }

                const updatedRecord: Record = Record.newRecord(id, title, time);
                res.json(updatedRecord);
        } catch (err: unknown) {
                if (err instanceof Error) {
                        res.status(500).json({ error: err.message });
                } else {
                        res.status(500).json({ error: "Unknown error" });
                }
        }
});

// ------------------- DELETE /records/:id -------------------
app.delete("/records/:id", (req: Request, res: Response) => {
        try {
                const { id } = req.params;

                const stmt = db.prepare("DELETE FROM study_record WHERE id = ?");
                const info = stmt.run(id);

                if (info.changes === 0) {
                        return res.status(404).json({ error: "Record not found" });
                }

                res.status(204).send(); // 削除成功、ボディなし
        } catch (err: unknown) {
                if (err instanceof Error) {
                        res.status(500).json({ error: err.message });
                } else {
                        res.status(500).json({ error: "Unknown error" });
                }
        }
});

// ------------------- サーバー起動 -------------------
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
