# 任务管理后端 API

这是全栈与 App 开发学习路线第二周的后端练习项目，基于 NestJS 实现任务管理 REST API。

当前项目暂时使用内存数组保存任务数据，重点练习 NestJS 的模块拆分、Controller、Service、DTO、参数校验、错误处理、CORS 和接口测试流程。第三周会继续接入 PostgreSQL 和 Prisma，把内存数据升级为数据库持久化。

## 技术栈

- Node.js
- NestJS
- TypeScript
- class-validator
- class-transformer
- Jest

## 已完成功能

- 创建 NestJS 后端项目。
- 创建任务模块 `TaskModule`。
- 使用 Controller 定义任务接口。
- 使用 Service 处理任务业务逻辑。
- 使用内存数组模拟任务数据。
- 定义任务类型：
  - `TaskStatus`
  - `TaskLevel`
  - `TaskItem`
- 定义 DTO：
  - `CreateTaskDto`
  - `UpdateTaskDto`
- 开启全局参数校验 `ValidationPipe`。
- 使用 NestJS 内置 `NotFoundException` 处理 404 错误。
- 开启 CORS，允许前端开发服务访问。
- 实现任务状态自动流转接口。
- 编写接口说明文档。

## 项目结构

```text
src/
  main.ts
  app.module.ts
  task/
    dto/
      create-task.dto.ts
      update-task.dto.ts
    task.controller.ts
    task.module.ts
    task.service.ts
  types/
    task.ts
docs/
  接口说明.md
```

## 本地运行

安装依赖：

```cmd
npm install
```

启动开发服务：

```cmd
npm run start:dev
```

默认服务地址：

```text
http://localhost:3000
```

## 构建与测试

构建项目：

```cmd
npm run build
```

运行测试：

```cmd
npm test
```

## 接口列表

当前任务接口统一使用 `/task` 前缀。

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/task` | 获取任务列表 |
| GET | `/task/:id` | 获取任务详情 |
| POST | `/task` | 创建任务 |
| PATCH | `/task/:id` | 更新任务 |
| DELETE | `/task/:id` | 删除任务 |
| PATCH | `/task/:id/status/next` | 流转到下一个状态 |

完整请求参数和响应示例见：

```text
docs/接口说明.md
```

## 请求示例

创建任务：

```http
POST /task
Content-Type: application/json
```

```json
{
  "title": "学习 NestJS Controller",
  "description": "理解 Controller 如何接收请求并调用 Service",
  "level": "high"
}
```

更新任务：

```http
PATCH /task/task-001
Content-Type: application/json
```

```json
{
  "title": "更新任务标题",
  "level": "medium"
}
```

状态流转：

```http
PATCH /task/task-001/status/next
```

状态流转规则：

```text
todo -> in-progress -> done -> todo
```

## 参数校验

创建任务时：

- `title` 必须是非空字符串。
- `description` 必须是非空字符串。
- `level` 必须是 `high`、`medium`、`low` 之一。

更新任务时：

- 支持部分更新。
- `status` 如果传入，必须是 `todo`、`in-progress`、`done` 之一。
- 传入 DTO 中没有定义的字段会被拒绝。

## 错误处理

查询、更新、删除不存在的任务时，会返回 404：

```json
{
  "message": "任务不存在",
  "error": "Not Found",
  "statusCode": 404
}
```

参数校验失败时，会返回 400。

## CORS

当前后端允许本地 Vite 前端访问：

```text
http://localhost:5173
```

配置位置：

```text
src/main.ts
```

## 当前限制

- 任务数据暂时保存在内存数组中。
- 服务重启后，新增、编辑、删除的数据会恢复到初始状态。
- 当前还没有用户注册、登录和鉴权。
- 当前还没有数据库、分页、排序和复杂查询。
- 当前接口路径使用 `/task`，后续如果希望更符合 REST 命名习惯，可以统一调整为 `/tasks`。

## 后续计划

- 接入 PostgreSQL。
- 使用 Prisma 管理数据库模型和迁移。
- 增加用户注册、登录和 JWT 鉴权。
- 让不同用户只能访问自己的任务。
- 前端 React 项目改为从后端 API 获取任务数据。
- 补充接口测试记录和更完整的异常场景测试。
