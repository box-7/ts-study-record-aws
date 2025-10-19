console.log('--- db.ts START ---');
// 生成コマンド
// npx prisma generate
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// export default prisma;

import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export default prisma;