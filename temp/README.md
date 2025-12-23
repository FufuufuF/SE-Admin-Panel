Temp 小后端（用于本地测试 users 页面）

快速说明
- 该目录包含一个最小 Express 服务，监听 `/admin/v1/users` 以及 `/admin/v1/users/:id/status`。
- 默认端口：3002

运行步骤
1. 进入 temp 目录：
   ```
   cd temp
   ```
2. 安装依赖：
   ```
   npm install
   ```
   或使用 pnpm：
   ```
   pnpm install
   ```
3. 启动服务：
   ```
   npm start
   ```
   开发时可使用 nodemon：
   ```
   npm run dev
   ```

如何与前端联调（两种可选方式）
1) 修改前端 API 地址（临时）
   - 打开 `src/api/core/config.ts`，将 `baseUrl` 临时改为 `http://localhost:3002`，然后重启前端。

2) 使用 Vite 代理（推荐）
   - 在项目根的 `vite.config.ts` 中添加或修改 `server.proxy`：
     ```js
     server: {
       proxy: {
         '/admin/v1': {
           target: 'http://localhost:3002',
           changeOrigin: true,
           rewrite: (path) => path.replace(/^\/admin\/v1/, '/admin/v1'),
         },
       },
     },
     ```
   - 这样前端请求 `/admin/v1/*` 会被转发到本地 temp 后端，不改前端代码。

注意
- 该后端把数据保存在 `temp/data/users.json`，对状态变更会写回该文件（用于测试持久化）。
- 请仅在本地开发环境使用，提交代码前请撤销对 `src/api/core/config.ts` 的临时修改（若修改过）。


