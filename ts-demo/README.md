# 任务管理前端

这是全栈学习项目中的前端应用，基于 React、TypeScript、Vite、Ant Design 和 Zustand 实现。

当前前端已经从早期 mock 数据版本升级为真实接口版本，任务数据、分类数据和登录状态都通过后端 API 获取和更新。

## 技术栈

- React 19
- TypeScript
- Vite
- Ant Design
- Zustand
- Fetch API

## 当前功能

### 登录注册

- 支持用户注册。
- 支持用户登录。
- 登录成功后保存 JWT token 到 `localStorage`。
- 刷新页面后会根据 token 请求 `/auth/me` 恢复当前用户。
- token 失效或接口返回 `401` 时，会清除登录态并回到登录页。
- 支持退出登录，退出后清空用户状态、任务状态和分类状态。

### 页面结构

- 登录 / 注册页：用于用户认证。
- 工作台：展示任务统计和三列任务看板。
- 任务列表：展示完整任务表格，支持筛选、分页和任务操作。
- 归档记录：展示已完成任务，支持查看详情和恢复任务。

### 任务管理

- 任务数据通过 `src/api/taskApi.ts` 调用后端接口。
- Zustand 中的 `taskStore` 负责管理任务列表。
- 支持获取任务列表。
- 支持新增任务。
- 支持编辑任务。
- 支持删除任务，删除前有确认弹窗。
- 支持任务状态流转：
  - `todo` -> `doing`
  - `doing` -> `done`
  - `done` -> `todo`
- 新增和编辑共用 `TaskModal` 组件。
- 任务弹窗支持标题、描述、优先级、状态和分类字段。

### 任务列表

- 支持关键词搜索，匹配任务标题和描述。
- 支持按任务状态筛选。
- 支持按任务优先级筛选。
- 支持按任务分类筛选。
- 支持重置筛选条件。
- 表格每页显示 8 条数据。
- 使用 Ant Design `Pagination` 组件进行分页。
- 表格列包含：
  - 任务标题
  - 状态
  - 优先级
  - 分类
  - 创建时间
  - 更新时间
  - 操作

### 工作台

- 展示全部任务、待处理、进行中、已完成数量。
- 按任务状态展示三列看板。
- 任务卡片支持优先级展示。
- 任务卡片按优先级和更新时间排序。
- 待处理任务显示“开始”按钮。
- 进行中任务显示“完成”按钮。
- 已完成任务不显示状态流转按钮。

### 归档记录

- 自动筛选状态为 `done` 的任务。
- 展示已完成任务数量。
- 统计本周归档任务数量。
- 支持查看任务详情。
- 支持把已完成任务恢复为 `doing`。

### 分类

- 分类数据通过 `src/api/categoryApi.ts` 调用后端接口。
- Zustand 中的 `categoryStore` 负责管理分类列表。
- 登录后会自动拉取当前用户的分类。
- 任务新增和编辑时可以选择分类。
- 任务列表中展示任务所属分类。
- 当前前端暂未提供独立的分类管理页面，分类创建、编辑和删除接口已经封装在 `categoryApi` 和 `categoryStore` 中。

## 目录结构

```text
src/
  api/
    authApi.ts
    categoryApi.ts
    http.ts
    taskApi.ts
  components/
    AppLayout.tsx
    SingleTask.tsx
    StateCard.tsx
    TaskColumn.tsx
    TaskModal.tsx
  store/
    authStore.ts
    categoryStore.ts
    taskStore.ts
  types/
    activeView.ts
    auth.ts
    category.ts
    task.ts
  view/
    ArchiveView.tsx
    AuthView.tsx
    DashboardView.tsx
    TaskListView.tsx
```

## 本地运行

安装依赖：

```cmd
npm install
```

启动开发服务器：

```cmd
npm run dev
```

默认前端地址：

```text
http://localhost:5173
```

构建项目：

```cmd
npm run build
```

预览构建结果：

```cmd
npm run preview
```

## 后端地址

默认请求后端：

```text
http://localhost:3000
```

如需修改后端地址，可以在前端环境变量中配置：

```env
VITE_API_BASE_URL=http://localhost:3000
```

## 启动顺序

建议先启动后端：

```cmd
cd /d E:\vscode\fullstack\task-server
npm run start:dev
```

再启动前端：

```cmd
cd /d E:\vscode\fullstack\ts-demo
npm run dev
```

## 当前限制

- 分页目前在前端本地完成，后端暂未实现分页查询参数。
- 分类管理接口已经封装，但前端暂未做独立分类管理页面。
- token 暂存在 `localStorage`，适合作为当前练习阶段的最小可用方案。
- 当前还没有文件上传、消息通知、协作成员、标签等扩展功能。

## 已完成学习重点

- React 页面组件和通用组件拆分。
- TypeScript 业务类型定义。
- Ant Design 表格、表单、弹窗、确认框、分页等组件使用。
- Zustand 管理认证、任务、分类等跨页面状态。
- 前端请求封装、错误处理和 JWT 请求头注入。
- 前后端联调：登录、任务 CRUD、状态流转、分类绑定。
