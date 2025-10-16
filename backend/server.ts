console.log('--- server.ts START ---');

import express from 'express';
import prisma from './src/db.ts';
import cors from 'cors';

process.on('uncaughtException', err => {
    console.error('uncaughtException:', err);
});
process.on('unhandledRejection', err => {
    console.error('unhandledRejection:', err);
});


console.log('--- server.ts: import開始 ---');

const app = express();
app.use(cors());
app.use(express.json());

console.log('--- server.ts: Prisma接続開始 ---');
prisma.$connect().then(() => {
    console.log('--- server.ts: Prisma接続成功 ---');
    app.listen(4000, () => console.log('--- server.ts: サーバー起動 ---'));
}).catch(err => {
    console.error('--- server.ts: Prisma接続失敗 ---', err);
});

app.get('/records', async (req, res) => {
        try {
                const rows = await prisma.studyRecord.findMany({ orderBy: { created_at: 'asc' } });
                res.json(rows);
        } catch (err) {
		console.error('GET /records error:', err);
                res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
        }
});

app.post('/records', async (req, res) => {
        try {
                const { title, time } = req.body;
                if (!title || typeof time !== 'number') {
                        return res.status(400).json({ error: 'Invalid request body' });
                }
                const newRecord = await prisma.studyRecord.create({ data: { title, time } });
                res.status(201).json(newRecord);
        } catch (err) {
		console.error('POST /records error:', err);
                res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
        }
});

app.put('/records/:id', async (req, res) => {
        try {
                const { id } = req.params;
                const { title, time } = req.body;
                if (!title || typeof time !== 'number') {
                        return res.status(400).json({ error: 'Invalid request body' });
                }
                const updatedRecord = await prisma.studyRecord.update({
                        where: { id },
                        data: { title, time }
                });
                res.json(updatedRecord);
        } catch (err) {
		console.error('PUT /records/:id error:', err);
                res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
        }
});

app.delete('/records/:id', async (req, res) => {
        try {
                const { id } = req.params;
                await prisma.studyRecord.delete({ where: { id } });
                res.status(204).send();
        } catch (err) {
		console.error('DELETE /records/:id error:', err);
                res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
        }
});

app.listen(4000, () => console.log('Server running on port 4000'));



// import express, { Request, Response } from "express";
// import Database from "better-sqlite3";
// import cors from "cors";
// import { Record } from "../shared/record.ts";

// const app = express();
// app.use(cors());
// app.use(express.json());

// // SQLite データベースを開く
// const db = new Database("mydb.sqlite");

// // SQLite のテーブル構造に合わせた型
// interface StudyRecord {
//         id: string;
//         title: string;
//         time: number;
//         created_at: string;
// }

// // ------------------- GET /records -------------------
// app.get("/records", (req: Request, res: Response) => {
//         try {
//                 const rows = db
//                         .prepare("SELECT * FROM study_record ORDER BY created_at ASC")
//                         .all() as StudyRecord[];

//                 const records: Record[] = rows.map((r) =>
//                         Record.newRecord(r.id, r.title, r.time)
//                 );

//                 res.json(records);
//         } catch (err: unknown) {
//                 if (err instanceof Error) {
//                         res.status(500).json({ error: err.message });
//                 } else {
//                         res.status(500).json({ error: "Unknown error" });
//                 }
//         }
// });

// // ------------------- POST /records -------------------
// app.post("/records", (req: Request, res: Response) => {
//         try {
//                 const { title, time } = req.body;

//                 console.log("Received POST /records with body:", req.body);

//                 if (!title || typeof time !== "number") {
//                         return res.status(400).json({ error: "Invalid request body" });
//                 }

//                 const stmt = db.prepare(
//                         "INSERT INTO study_record (title, time, created_at) VALUES (?, ?, datetime('now'))"
//                 );
//                 const info = stmt.run(title, time);

//                 const newRecord: Record = Record.newRecord(info.lastInsertRowid.toString(), title, time);
//                 res.status(201).json(newRecord);
//         } catch (err: unknown) {
//                 if (err instanceof Error) {
//                         res.status(500).json({ error: err.message });
//                 } else {
//                         res.status(500).json({ error: "Unknown error" });
//                 }
//         }
// });

// // ------------------- PUT /records/:id -------------------
// app.put("/records/:id", (req: Request, res: Response) => {
//         try {
//                 const { id } = req.params;
//                 const { title, time } = req.body;

//                 if (!title || typeof time !== "number") {
//                         return res.status(400).json({ error: "Invalid request body" });
//                 }

//                 const stmt = db.prepare(
//                         "UPDATE study_record SET title = ?, time = ? WHERE id = ?"
//                 );
//                 const info = stmt.run(title, time, id);

//                 if (info.changes === 0) {
//                         return res.status(404).json({ error: "Record not found" });
//                 }

//                 const updatedRecord: Record = Record.newRecord(id, title, time);
//                 res.json(updatedRecord);
//         } catch (err: unknown) {
//                 if (err instanceof Error) {
//                         res.status(500).json({ error: err.message });
//                 } else {
//                         res.status(500).json({ error: "Unknown error" });
//                 }
//         }
// });

// // ------------------- DELETE /records/:id -------------------
// app.delete("/records/:id", (req: Request, res: Response) => {
//         try {
//                 const { id } = req.params;

//                 const stmt = db.prepare("DELETE FROM study_record WHERE id = ?");
//                 const info = stmt.run(id);

//                 if (info.changes === 0) {
//                         return res.status(404).json({ error: "Record not found" });
//                 }

//                 res.status(204).send(); // 削除成功、ボディなし
//         } catch (err: unknown) {
//                 if (err instanceof Error) {
//                         res.status(500).json({ error: err.message });
//                 } else {
//                         res.status(500).json({ error: "Unknown error" });
//                 }
//         }
// });

// // ------------------- サーバー起動 -------------------
// const PORT = 4000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
