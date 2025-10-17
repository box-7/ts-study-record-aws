console.log('--- server.ts START ---');
import express from 'express';
import prisma from './src/db.ts';
import cors from 'cors';

process.on('uncaughtException', err => {
    console.error('uncaughtException:', err);
    process.exit(1);
});

process.on('unhandledRejection', err => {
    console.error('unhandledRejection:', err);
    process.exit(1);
});

console.log('--- server.ts: import開始 ---');
const app = express();
app.use(cors());
app.use(express.json());

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

// グレースフルシャットダウン
process.on('SIGINT', async () => {
    console.log('\n--- サーバーをシャットダウンしています ---');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n--- サーバーをシャットダウンしています ---');
    await prisma.$disconnect();
    process.exit(0);
});

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Prisma接続とサーバー起動
console.log('--- server.ts: Prisma接続開始 ---');
prisma.$connect()
    .then(() => {
        console.log('--- server.ts: Prisma接続成功 ---');
        
        // 定期的にデータベース接続を保持（接続タイムアウト防止）
        setInterval(async () => {
            try {
                await prisma.$queryRaw`SELECT 1`;
            } catch (err) {
                console.error('Database keepalive failed:', err);
            }
        }, 30000); // 30秒ごと
        
        app.listen(4000, '0.0.0.0', () => {
            console.log('--- server.ts: サーバー起動 ---');
            console.log('Server running on port 4000');
        });
    })
    .catch(err => {
        console.error('--- server.ts: Prisma接続失敗 ---', err);
        process.exit(1);
    });
