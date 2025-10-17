import type { Server } from 'http';

console.log('--- server.ts START ---');

// npm パッケージ express のデフォルトエクスポートを読み込む。HTTP サーバ／ルーティング作成に使う。
import express from 'express';
// 同リポジトリ内の db.ts を参照している。そこから export default された PrismaClient のインスタンスを受け取る。
import prisma from './src/db.ts';
// npm パッケージ cors のデフォルトエクスポートを読み込む。ブラウザからのクロスオリジンリクエストを許可するミドルウェア。
import cors from 'cors';


console.log('--- server.ts: import開始 ---');
// Express アプリケーションのインスタンスを作成。ルーティングやミドルウェアの登録はこの app に対して行う。
const app = express();
// CORS ミドルウェアを全ルートに適用。デフォルトで全オリジンを許可する（Origin: *）。Cookie を使う場合は credentials: true を明示してかつ特定オリジンを返す必要がある。
app.use(cors());
// 受信した HTTP リクエストの JSON ボディをパースして req.body に格納する。デフォルトの最大サイズは小さい（約100kb）ため大きいペイロードがある場合は limit オプションで増やす。
app.use(express.json());


// GET /records へのリクエストを受けるルートハンドラ。非同期処理を行う async 関数。
app.get('/records', async (req, res) => {
        try {
                // Prisma を使って StudyRecord テーブルの全行を取得し、created_at 昇順でソートしている。
                const rows = await prisma.studyRecord.findMany({ orderBy: { created_at: 'asc' } });
                // 取得結果（配列）を JSON としてクライアントに返す（HTTP 200 相当）。
                res.json(rows);
        } catch (err) {
                // try/catch で例外を捕捉。エラー発生時はコンソールにログ出力し、HTTP 500 と { error: メッセージ } を返す。
                console.error('GET /records error:', err);
                res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
        }
});

// POST /records に来たリクエストで新しい StudyRecord を DB に作るエンドポイント。
app.post('/records', async (req, res) => {
        try {
                // リクエストボディから title と time を取り出す
                const { title, time } = req.body;
                // バリデーション：title が存在し、time が number でなければ 400 を返す
                if (!title || typeof time !== 'number') {
                        return res.status(400).json({ error: 'Invalid request body' });
                }
                // Prisma で新規作成：await prisma.studyRecord.create({ data: { title, time } });
                const newRecord = await prisma.studyRecord.create({ data: { title, time } });
                // 成功時は HTTP 201 と作成したオブジェクトを返す
                res.status(201).json(newRecord);
        } catch (err) {
                // 例外発生時はログを出して HTTP 500 とエラーメッセージを返す
                console.error('POST /records error:', err);
                res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
        }
});

// PUT /records/:id に来たリクエストで既存の StudyRecord を更新するエンドポイント。
app.put('/records/:id', async (req, res) => {
        try {
                // URL パラメータから id を取得
                const { id } = req.params;
                // リクエストボディから更新データを取得
                const { title, time } = req.body;

                // バリデーション：title が存在し、time が number でなければ 400 を返す
                // - title が空文字や undefined の場合は無効
                // - time は数値型であることを期待
                if (!title || typeof time !== 'number') {
                        return res.status(400).json({ error: 'Invalid request body' });
                }

                // Prisma を使って指定 id のレコードを更新
                // - where: 更新対象の一意キー (id)
                // - data: 更新するフィールド
                const updatedRecord = await prisma.studyRecord.update({
                        where: { id },
                        data: { title, time }
                });

                // 更新成功時は更新後のオブジェクトを返す（HTTP 200）
                res.json(updatedRecord);
        } catch (err) {
                // エラー時のログ出力（原因調査用）
                console.error('PUT /records/:id error:', err);
                // エラーレスポンスを返す。Error オブジェクトならメッセージを返す
                res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
        }
});

// DELETE /records/:id に来たリクエストで既存の StudyRecord を削除するエンドポイント。
app.delete('/records/:id', async (req, res) => {
        try {
                const { id } = req.params;
                // optional: id の簡易バリデーション（UUID 期待なら正規表現でチェック）
                if (!id) return res.status(400).json({ error: 'Missing id' });

                await prisma.studyRecord.delete({ where: { id } });
                // 削除成功: 204 No Content
                res.status(204).send();
        } catch (err) {
                console.error('DELETE /records/:id error:', err);
                res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
        }
});


// server は後で prisma 接続成功時に代入して起動する（重複 listen を防ぐ）
let server: Server | null = null;
let keepalive: NodeJS.Timeout | null = null;

// ヘルスチェックエンドポイント
// 何か：ヘルスチェック用のエンドポイント。GET /health にアクセスすると JSON { status: 'ok' } を返す。
// 目的：ロードバランサー／監視ツールがアプリの「生存（liveness）／準備（readiness）」を簡易に確認できるようにするため。
// 挙動：HTTP 200 を返す想定（問題なければOK）。現状は単純で DB など外部依存は確認していない。
app.get('/health', (req, res) => {
        res.json({ status: 'ok' });
});


// Prisma接続とサーバー起動（接続成功後に一度だけ listen）
console.log('--- server.ts: Prisma接続開始 ---');
prisma.$connect()
        .then(() => {
                console.log('--- server.ts: Prisma接続成功 ---');
                // 定期的にデータベース接続を保持（接続タイムアウト防止）
                keepalive = setInterval(async () => {
                        try {
                                await prisma.$queryRaw`SELECT 1`;
                        } catch (err) {
                                console.error('Database keepalive failed:', err);
                        }
                }, 30000); // 30秒ごと
                server = app.listen(4000, '0.0.0.0', () => {
                        console.log('--- server.ts: サーバー起動 ---');
                        console.log('Server running on port 4000');
                });
        })
        .catch(err => {
                console.error('--- server.ts: Prisma接続失敗 ---', err);
                process.exit(1);
        });


const shutdown = async (signal: string, code = 0) => {
        console.log(`\n--- ${signal} received: shutting down ---`);
        // 新しい接続受付を停止
        if (server && typeof server.close === 'function') {
                const s = server;
                await new Promise<void>((resolve) => {
                        s.close(() => resolve());
                        setTimeout(() => resolve(), 10000); // 保険: 10秒で強制的に続行
                });
        }
        // keepalive を停止
        if (keepalive) clearInterval(keepalive);
        try {
                await prisma.$disconnect();
                console.log('Prisma disconnected');
        } catch (e) {
                console.error('Error disconnecting Prisma:', e);
        }
        process.exit(code);
};

// process.on('SIGINT', ...) はプロセスに SIGINT（Ctrl+C）シグナルが送られたときに実行されるハンドラを登録している。
// - SIGINT: ターミナルで Ctrl+C を押したときに送られる。
// - SIGTERM: systemd や pm2 がプロセスを停止するときに送る一般的な終了シグナル。
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// process.on は Node.js の process（EventEmitter）でイベントを監視するための関数。指定したイベント名が発生したときにコールバックを呼ぶ。
// Node のプロセス内で捕捉されなかった例外（同期例外）を受け取るイベントハンドラ。
process.on('uncaughtException', (err) => {
        console.error('uncaughtException:', err);
        // グレースフルシャットダウンを試みる
        void shutdown('uncaughtException', 1);
});

// 捕捉されない Promise の拒否
process.on('unhandledRejection', (err) => {
        console.error('unhandledRejection:', err);
        void shutdown('unhandledRejection', 1);
});

