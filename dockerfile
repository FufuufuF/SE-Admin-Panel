# ============================
# 阶段 1：构建环境 (Build Stage)
# ============================
FROM node:20-alpine as build-stage

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖定义文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖 (严格按照 lock 文件)
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 执行构建
RUN pnpm run build

# ============================
# 阶段 2：生产环境 (Production Stage)
# ============================
FROM nginx:alpine as production-stage

# 复制 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建结果到 Nginx 目录
# 【注意】如果你用的是 Create-React-App，请将 /app/dist 改为 /app/build
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]