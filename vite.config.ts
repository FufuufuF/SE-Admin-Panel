
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // 代理 /api 路径（用户端 API）
      '/api': {
        target: 'http://172.31.68.19:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // 添加 /admin/v1 路径代理（管理端 API）
      '/admin/v1': {
        target: 'http://172.31.68.19:8080',
        changeOrigin: true,
        // 不需要 rewrite，因为路径已经是 /admin/v1
      },
    },
  },
})