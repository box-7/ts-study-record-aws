console.log('--- db.ts START ---');
// 生成コマンド
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export default prisma;