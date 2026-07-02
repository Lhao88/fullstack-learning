# 任务管理前端

基于 React、TypeScript、Vite、Ant Design 和 Zustand 的任务管理前端应用。

## 技术栈

- React
- TypeScript
- Vite
- Ant Design
- Zustand
- Fetch API

## 当前功能

### 认证

- 注册。
- 登录。
- 退出登录。
- access token + refresh token 存储到 `localStorage`。
- 请求遇到 `401` 时会尝试使用 refresh token 刷新并重试一次。
- refresh token 失效后清空登录态并回到登录页。
- 未登录时只能看到登录 / 注册页面。

### 普通用户

- 工作台任务看板。
- 任务列表。
- 归档记录。
- 任务新增、编辑、删除。
- 任务状态流转。
- 任务关键词、状态、优先级、分类筛选。
- 每页 8 条的分页。
- 分类绑定与展示。
- 管理自己的分类，支持新增、编辑、删除。
- 侧边栏头像展示和上传。

### 超级管理员

- 登录后只显示管理后台。
- 查看用户列表。
- 查看用户详情。
- 启用 / 禁用用户。
- 查看和维护全部用户的分类。
- 普通用户不会看到管理后台入口。

### 请求封装

- 统一封装 `baseURL`。
- 自动携带 `Authorization` 请求头。
- 自动处理 JSON 请求和响应。
- access token 过期后自动尝试 refresh token。
- refresh token 失效后清空本地登录态。

## 本地启动

```cmd
npm install
npm run dev
```

默认地址：

```text
http://localhost:5173
```

构建：

```cmd
npm run build
```

预览：

```cmd
npm run preview
```

## 后端地址

默认请求：

```text
http://localhost:3000
```

如需修改：

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Docker 基础

前端目录提供 `Dockerfile`，项目根目录提供 `docker-compose.yml`。

```cmd
cd /d E:\vscode\fullstack
docker compose up --build
```

前端容器会把 Vite 构建产物交给 Nginx 托管。

本地日常开发建议使用 `npm run dev`，Docker 更适合模拟部署和整体联调。

## 主要目录

```text
src/
  api/
    adminApi.ts
    authApi.ts
    categoryApi.ts
    http.ts
    taskApi.ts
    uploadApi.ts
  components/
  store/
  types/
  view/
```

## 主要页面

- `AuthView.tsx`：登录和注册。
- `DashboardView.tsx`：普通用户工作台。
- `TaskListView.tsx`：任务列表、筛选、分页和任务操作。
- `ArchiveView.tsx`：归档任务。
- `CategoryManageView.tsx`：普通用户分类管理。
- `AdminUserListView.tsx`：超级管理员用户管理。
- `AdminCategoryManageView.tsx`：超级管理员全局分类管理。

## 当前限制

- 分页仍在前端本地完成，后端暂未提供分页查询参数。
- 分类管理先支持基础 CRUD，暂不支持排序、图标和多级分类。
- token 暂存在 `localStorage`，适合作为当前练习阶段的最小可用方案。
