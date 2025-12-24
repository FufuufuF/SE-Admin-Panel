# 项目开发文档

> 本文档面向团队成员，介绍项目结构、开发规范和技术栈使用指南

## 📋 目录

- [1. 项目概述](#1-项目概述)
- [2. 技术栈](#2-技术栈)
- [3. 项目结构](#3-项目结构)
- [4. 开发规范](#4-开发规范)
- [5. 快速开始](#5-快速开始)
- [6. 核心功能开发指南](#6-核心功能开发指南)
- [7. 常见问题](#7-常见问题)

---

## 1. 项目概述

本项目是一个基于 React 的**后台管理平台前端项目**，使用现代化的技术栈构建，提供用户管理、内容管理等核心功能。

### 1.1 项目特点

- ⚡️ **快速开发**：使用 Vite 构建工具，HMR 热更新极速
- 🎨 **UI 组件库**：集成 Ant Design 6.x，开箱即用的企业级 UI
- 🔒 **类型安全**：TypeScript 全栈类型保护
- 📦 **状态管理**：Zustand 轻量级状态管理（待集成）
- 🛣️ **路由管理**：React Router v7 最新版

---

## 2. 技术栈

### 2.1 核心依赖

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 19.2.0 | UI 框架 |
| TypeScript | 5.9.3 | 类型系统 |
| Vite | 7.2.4 | 构建工具 |
| Ant Design | 6.1.1 | UI 组件库 |
| React Router | 7.10.1 | 路由管理 |
| Axios | 1.13.2 | HTTP 请求库 |
| Zustand | - | 状态管理（待安装）|
| Less | 4.5.1 | CSS 预处理器 |

### 2.2 开发工具

- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **pnpm**: 包管理工具

---

## 3. 项目结构

```
endWork/
├── src/
│   ├── api/                    # API 接口层
│   │   ├── client.ts          # Axios 客户端封装
│   │   ├── config.ts          # API 配置（BaseURL等）
│   │   ├── types.ts           # API 通用类型定义
│   │   └── index.ts           # 统一导出
│   │
│   ├── components/            # 全局公共组件
│   │   ├── dashborard-layout.tsx  # 后台布局组件
│   │   ├── header.tsx             # 顶部导航栏
│   │   ├── side-bar.tsx           # 侧边栏菜单
│   │   └── index.module.less      # 组件样式
│   │
│   ├── pages/                 # 页面组件
│   │   ├── login/             # 登录页面
│   │   │   └── index.tsx
│   │   ├── users/             # 用户管理页面
│   │   │   ├── index.tsx      # 页面主文件
│   │   │   ├── api.ts         # 该页面专属 API
│   │   │   ├── components/    # 页面级组件（待扩展）
│   │   │   └── hooks/         # 页面级 Hooks（待扩展）
│   │   └── routes.tsx         # 子路由配置
│   │
│   ├── store/                 # 全局状态管理
│   │   └── index.ts           # Zustand Store（待实现）
│   │
│   ├── hooks/                 # 全局自定义 Hooks
│   │   └── index.ts           # （待扩展）
│   │
│   ├── App.tsx                # 根组件
│   ├── main.tsx               # 应用入口
│   ├── routes.tsx             # 根路由配置
│   ├── theme.ts               # Ant Design 主题配置
│   └── index.css              # 全局样式
│
├── .prettierrc                # Prettier 配置
├── .prettierignore            # Prettier 忽略文件
├── eslint.config.js           # ESLint 配置
├── vite.config.ts             # Vite 配置
├── tsconfig.json              # TypeScript 配置（根）
├── tsconfig.app.json          # TypeScript 应用配置
├── package.json               # 项目依赖
└── README.md                  # 项目说明
```

### 3.1 目录详解

#### 📁 `src/api/` - API 接口层

**作用**：统一管理所有后端接口请求

- **`client.ts`**: 
  - 封装 Axios 实例
  - 统一请求/响应拦截器
  - 全局错误处理（通过 Ant Design 的 notification 组件）

- **`config.ts`**:
  ```typescript
  export const API_CONFIG = {
    baseUrl: 'http://localhost:8000/api/v1',
    timeout: 10000,
    withCredentials: true,
  }
  ```

- **`types.ts`**:
  ```typescript
  // 统一的 API 响应格式
  export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
  }
  ```

**使用示例**：
```typescript
import { apiClient } from '@/api'

// GET 请求
const users = await apiClient.get<User[]>('/users')

// POST 请求
const result = await apiClient.post<Response, Payload>('/users', payload)
```

---

#### 📁 `src/components/` - 全局组件

**作用**：存放跨页面复用的公共组件

**当前组件**：

1. **`dashborard-layout.tsx`** - 后台主布局
   - 组合了 Sidebar 和 Header
   - 使用 `<Outlet />` 渲染子路由

2. **`side-bar.tsx`** - 侧边栏菜单
   - 菜单配置数组 `menuItems`
   - 自动路由跳转和高亮
   - 支持折叠/展开

3. **`header.tsx`** - 顶部导航栏
   - 用户信息展示
   - 消息通知（Badge）
   - 下拉菜单（个人中心、退出登录）

**组件规范**：
- 使用 `.module.less` 模块化样式
- 使用 TypeScript 接口定义 Props
- 导出默认组件

---

#### 📁 `src/pages/` - 页面组件

**作用**：每个页面一个文件夹，包含页面相关的所有资源

**目录结构规范**：
```
pages/
└── [页面名]/
    ├── index.tsx          # 页面主组件（必须）
    ├── api.ts             # 该页面的 API 接口（推荐）
    ├── components/        # 页面级组件（可选）
    │   └── UserModal.tsx
    ├── hooks/             # 页面级 Hooks（可选）
    │   └── useUserList.ts
    └── types.ts           # 页面级类型定义（可选）
```

**示例 - 用户管理页面**：

`pages/users/index.tsx`:
```typescript
import { Table, Button } from 'antd'
import { find } from './api'  // 引入同级 API

export default function Users() {
  // 页面逻辑
  const handleFind = async () => {
    const response = await find()
  }
  
  return <Table ... />
}
```

`pages/users/api.ts`:
```typescript
import { apiClient } from '@/api'

// 导出该页面的所有 API 方法
export const find = () => apiClient.get<User[]>('/users')
export const create = (data: User) => apiClient.post('/users', data)
export const update = (id: string, data: User) => apiClient.post(`/users/${id}`, data)
export const remove = (id: string) => apiClient.post(`/users/${id}/delete`, {})
```

---

#### 📁 `src/store/` - 状态管理

**作用**：使用 Zustand 管理全局状态

**计划结构**：
```
store/
├── index.ts           # 导出所有 Store
├── useUserStore.ts    # 用户信息 Store
└── useAuthStore.ts    # 认证状态 Store
```

**示例（待实现）**：
```typescript
// store/useAuthStore.ts
import { create } from 'zustand'

interface AuthState {
  token: string | null
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  login: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null }),
}))
```

---

#### 📁 `src/routes.tsx` - 路由配置

**作用**：定义应用的路由结构

```typescript
import { createBrowserRouter } from 'react-router-dom'
import DashborardLayout from '@/components/dashborard-layout'
import Login from '@/pages/login'
import { routes as childRoutes } from '@/pages/routes'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashborardLayout />,  // 主布局
    children: [...childRoutes],     // 子路由
  },
  {
    path: '/login',
    element: <Login />,
  }
])
```

**子路由配置** (`pages/routes.tsx`):
```typescript
import Users from './users'

export const routes = [
  {
    path: '/users',
    element: <Users />,
  },
  // 新增页面在这里添加
]
```

---

## 4. 开发规范

### 4.1 代码风格

**已配置 Prettier**，规则如下：

```json
{
  "semi": false,              // 不使用分号
  "singleQuote": true,        // 使用单引号
  "tabWidth": 2,              // 缩进 2 空格
  "trailingComma": "es5",     // 尾随逗号
  "printWidth": 100,          // 每行最大 100 字符
  "arrowParens": "always"     // 箭头函数总是带括号
}
```

**格式化命令**：
```bash
# 格式化所有代码
pnpm format

# 检查代码格式
pnpm format:check
```

---

### 4.2 命名规范

#### 文件命名

| 类型 | 命名规则 | 示例 |
|------|----------|------|
| 组件文件 | kebab-case | `user-modal.tsx` |
| 页面文件 | kebab-case | `login/index.tsx` |
| 工具文件 | kebab-case | `format-date.ts` |
| 类型文件 | kebab-case | `user-types.ts` |
| 样式文件 | `.module.less` | `index.module.less` |

#### 变量/函数命名

```typescript
// ✅ 推荐
const userName = 'Alice'                    // 驼峰命名
const MAX_COUNT = 100                       // 常量大写
function handleClick() {}                   // 事件处理器前缀 handle
function fetchUserList() {}                 // 数据请求前缀 fetch

// ❌ 不推荐
const user_name = 'Alice'                   // 不使用下划线
const maxcount = 100                        // 常量不明确
function clickHandler() {}                  // 命名不清晰
```

#### 组件命名

```typescript
// ✅ PascalCase 大驼峰
function UserModal() {}
export default function UserList() {}

// ❌ camelCase 小驼峰
function userModal() {}
```

---

### 4.3 TypeScript 规范

#### 类型定义

```typescript
// ✅ 推荐：使用 interface 定义对象类型
interface User {
  id: string
  name: string
  email: string
}

// ✅ 推荐：使用 type 定义联合类型
type Status = 'active' | 'banned' | 'pending'

// ✅ 推荐：为组件 Props 定义类型
interface UserCardProps {
  user: User
  onEdit: (user: User) => void
}

export default function UserCard({ user, onEdit }: UserCardProps) {
  // ...
}
```

#### 避免使用 `any`

```typescript
// ❌ 不推荐
const data: any = await fetchData()

// ✅ 推荐：使用具体类型
const data: User[] = await fetchData()

// ✅ 推荐：实在不确定用 unknown
const data: unknown = await fetchData()
if (isUser(data)) {
  // 类型守卫
}
```

---

### 4.4 组件开发规范

#### 组件结构

```typescript
import { useState, useEffect } from 'react'
import { Button } from 'antd'
import styles from './index.module.less'

// 1. 类型定义
interface Props {
  title: string
}

// 2. 组件定义
export default function MyComponent({ title }: Props) {
  // 3. State 声明
  const [count, setCount] = useState(0)
  
  // 4. 副作用
  useEffect(() => {
    // ...
  }, [])
  
  // 5. 事件处理器
  const handleClick = () => {
    setCount(count + 1)
  }
  
  // 6. 渲染逻辑
  return (
    <div className={styles.container}>
      <h1>{title}</h1>
      <Button onClick={handleClick}>Count: {count}</Button>
    </div>
  )
}
```

#### Hooks 使用顺序

```typescript
// ✅ 推荐顺序
const navigate = useNavigate()              // 1. 路由 Hooks
const { token } = useAuthStore()            // 2. Store Hooks
const [data, setData] = useState([])        // 3. State Hooks
const fetchData = useCallback(() => {}, []) // 4. 记忆化 Hooks

useEffect(() => {}, [])                     // 5. Effect Hooks（最后）
```

---

### 4.5 API 调用规范

#### 页面级 API 定义

```typescript
// pages/users/api.ts
import { apiClient } from '@/api'

export interface User {
  id: string
  name: string
  email: string
}

// 导出函数，不导出类
export const findUsers = () => {
  return apiClient.get<User[]>('/users')
}

export const createUser = (data: Omit<User, 'id'>) => {
  return apiClient.post<User, typeof data>('/users', data)
}
```

#### 组件中调用

```typescript
import { findUsers } from './api'

export default function Users() {
  const [loading, setLoading] = useState(false)
  
  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await findUsers()
      // 处理数据
    } catch (error) {
      // 错误已被 apiClient 拦截器处理
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchData()
  }, [])
}
```

---

### 4.6 样式规范

#### 使用 CSS Modules

```typescript
// ✅ 推荐：使用 .module.less
import styles from './index.module.less'

function MyComponent() {
  return <div className={styles.container}>内容</div>
}
```

```less
// index.module.less
.container {
  padding: 16px;
  
  .title {
    font-size: 18px;
    font-weight: bold;
  }
}
```

#### 优先使用 Ant Design 主题变量

```less
.container {
  // ✅ 使用 Ant Design 的 Less 变量
  padding: @padding-md;
  background: @primary-color;
  
  // ❌ 避免硬编码颜色
  // background: #1890ff;
}
```

---

### 4.7 路径别名

**已配置 `@` 指向 `src/` 目录**

```typescript
// ✅ 推荐：使用别名
import { apiClient } from '@/api'
import UserModal from '@/components/user-modal'
import { useAuthStore } from '@/store'

// ❌ 不推荐：相对路径过长
import { apiClient } from '../../../api'
```

---

## 5. 快速开始

### 5.1 环境要求

- Node.js >= 20
- pnpm >= 10

### 5.2 安装依赖

```bash
# 克隆项目后
cd endWork

# 安装依赖
pnpm install
```

### 5.3 启动开发服务器

```bash
pnpm dev
```

浏览器访问：`http://localhost:5173`

### 5.4 其他命令

```bash
# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

---

## 6. 核心功能开发指南

### 6.1 新增页面

**步骤 1**：创建页面目录

```bash
mkdir -p src/pages/products
```

**步骤 2**：创建页面主文件

```typescript
// src/pages/products/index.tsx
export default function Products() {
  return (
    <div>
      <h1>产品管理</h1>
    </div>
  )
}
```

**步骤 3**：添加路由

```typescript
// src/pages/routes.tsx
import Products from './products'

export const routes = [
  {
    path: '/users',
    element: <Users />,
  },
  {
    path: '/products',  // 新增
    element: <Products />,
  },
]
```

**步骤 4**：添加菜单项

```typescript
// src/components/side-bar.tsx
const menuItems = [
  // ... 其他菜单
  {
    key: '/products',
    label: '产品管理',
    icon: <AppstoreOutlined />,
  },
]
```

---

### 6.2 添加 API 接口

**步骤 1**：定义接口函数

```typescript
// src/pages/products/api.ts
import { apiClient } from '@/api'

export interface Product {
  id: string
  name: string
  price: number
}

export const fetchProducts = () => {
  return apiClient.get<Product[]>('/products')
}

export const createProduct = (data: Omit<Product, 'id'>) => {
  return apiClient.post<Product, typeof data>('/products', data)
}
```

**步骤 2**：在组件中使用

```typescript
import { useEffect, useState } from 'react'
import { fetchProducts } from './api'

export default function Products() {
  const [data, setData] = useState([])
  
  useEffect(() => {
    fetchProducts().then((res) => {
      setData(res.data)
    })
  }, [])
  
  return <Table dataSource={data} />
}
```

---

### 6.3 使用 Ant Design 组件

**常用组件**：

```typescript
import {
  Table,       // 数据表格
  Button,      // 按钮
  Input,       // 输入框
  Form,        // 表单
  Modal,       // 弹窗
  message,     // 消息提示
  notification,// 通知提醒
  Space,       // 间距
  Tag,         // 标签
} from 'antd'
```

**示例 - 表格 + 弹窗**：

```typescript
import { Table, Button, Modal, Form, Input } from 'antd'

export default function Users() {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  
  const handleSubmit = async () => {
    const values = await form.validateFields()
    // 提交数据
    setOpen(false)
  }
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>新增</Button>
      <Table ... />
      
      <Modal
        title="新增用户"
        open={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
      >
        <Form form={form}>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
```

---

### 6.4 状态管理（Zustand）

**待实现 - 参考示例**：

```typescript
// store/useAuthStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
)
```

**使用**：

```typescript
import { useAuthStore } from '@/store'

function Header() {
  const { user, logout } = useAuthStore()
  
  return (
    <div>
      <span>{user?.name}</span>
      <Button onClick={logout}>退出</Button>
    </div>
  )
}
```

---

### 6.5 自定义 Hooks

**示例 - 数据加载 Hook**：

```typescript
// hooks/useRequest.ts
import { useState, useEffect } from 'react'

export function useRequest<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    setLoading(true)
    fetcher()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])
  
  return { data, loading, error }
}
```

**使用**：

```typescript
import { useRequest } from '@/hooks/useRequest'
import { fetchUsers } from './api'

function Users() {
  const { data, loading } = useRequest(fetchUsers)
  
  return <Table dataSource={data} loading={loading} />
}
```

---

## 7. 常见问题

### 7.1 API 请求失败没有提示？

**原因**：`apiClient` 的 notification 实例未注入

**解决**：确保 `App.tsx` 中正确注入

```typescript
// App.tsx
import { App as AntdApp } from 'antd'
import { apiClient } from '@/api/client'

function AppContent() {
  const { notification } = AntdApp.useApp()
  
  useEffect(() => {
    apiClient.setNotificationApi(notification)
  }, [notification])
  
  return <RouterProvider router={router} />
}
```

---

### 7.2 路径别名 `@/` 无法识别？

**原因**：TypeScript 或 Vite 配置缺失

**解决**：

1. 检查 `tsconfig.app.json`：
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

2. 检查 `vite.config.ts`：
```typescript
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

---

### 7.3 Less 样式不生效？

**原因**：未使用 `.module.less` 后缀

**解决**：
```typescript
// ✅ 正确
import styles from './index.module.less'
<div className={styles.container}>

// ❌ 错误
import './index.less'
<div className="container">
```

---

### 7.4 如何配置后端 API 地址？

**方法 1**：直接修改配置文件

```typescript
// src/api/config.ts
export const API_CONFIG = {
  baseUrl: 'https://api.example.com/v1',  // 修改为真实地址
  timeout: 10000,
}
```

**方法 2**（推荐）：使用环境变量

1. 创建 `.env.development`：
```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

2. 创建 `.env.production`：
```bash
VITE_API_BASE_URL=https://api.example.com/v1
```

3. 修改 `config.ts`：
```typescript
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
}
```

---

### 7.5 如何处理跨域问题？

**开发环境**：配置 Vite 代理

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

**生产环境**：由后端配置 CORS 响应头

---

## 8. 团队协作

### 8.1 Git 提交规范

使用 **Conventional Commits** 规范：

```bash
# 功能开发
git commit -m "feat: 添加用户管理页面"

# Bug 修复
git commit -m "fix: 修复登录页面跳转问题"

# 样式调整
git commit -m "style: 优化表格样式"

# 文档更新
git commit -m "docs: 更新开发文档"

# 重构代码
git commit -m "refactor: 重构 API Client"
```

### 8.2 分支管理

```bash
main          # 主分支（稳定版本）
  └─ dev      # 开发分支
      ├─ feature/user-management    # 功能分支
      ├─ feature/auth-system
      └─ bugfix/login-issue         # Bug 修复分支
```

### 8.3 代码审查检查项

- [ ] 代码符合 ESLint 和 Prettier 规范
- [ ] TypeScript 类型定义完整
- [ ] 无 `console.log` 等调试代码
- [ ] 组件结构清晰，可复用性强
- [ ] API 调用有错误处理
- [ ] 提交信息清晰明确

---

## 9. 附录

### 9.1 推荐 VSCode 插件

- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **TypeScript Importer** - 自动导入类型
- **Auto Import** - 自动导入模块
- **Less IntelliSense** - Less 语法提示

### 9.2 学习资源

- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Ant Design 组件库](https://ant.design/components/overview-cn/)
- [Zustand 文档](https://zustand-demo.pmnd.rs/)
- [React Router 文档](https://reactrouter.com/)

---

## 📞 联系方式

如有问题，请联系项目负责人或在团队群中讨论。

**文档版本**: v1.0.0  
**最后更新**: 2024-12-16

