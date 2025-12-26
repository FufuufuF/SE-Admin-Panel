import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/xxx': {
        target: 'http://172.31.68.19:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/xxx/, ''),
      },
      // 添加这个代理规则
      '/api': {
        target: 'http://172.31.68.19:8080',
        changeOrigin: true,
      },
    },
  },
});
