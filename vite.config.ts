import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import envCompatible from 'vite-plugin-env-compatible';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    envCompatible({
      prefix: 'VITE', // 環境変数のプレフィックス
      mountedPath: 'process.env', // 環境変数をマウントするパス
    }),
  ],
});

// export default defineConfig({
//         plugins: [react(), tsconfigPaths()],
//         define: {
//                 prefix: 'VITE',
//                 mountedPath: 'process.env'
//         }
//       });

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react(), tsconfigPaths()],
// })

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
