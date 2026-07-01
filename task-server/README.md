# 任务管理后端 API

这是全栈学习项目中的后端服务，基于 NestJS、Prisma 和 PostgreSQL 实现。

当前后端已经从早期内存数组版本升级为数据库版本，支持用户注册登录、JWT 鉴权、任务 CRUD、任务分类和用户数据隔离。

## 技术栈

- Node.js
- NestJS
- TypeScript
- PostgreSQL
- Prisma
- bcrypt
- JWT
- Passport
- class-validator
- Jest

## 当前功能

### 用户认证

- 用户注册：`POST /auth/register`
- 用户登录：`POST /auth/login`
- 获取当前用户：`GET /auth/me`
- 注册时使用 bcrypt 保存密码 hash，不保存明文密码。
- 登录成功后返回 JWT `accessToken`。
- `GET /auth/me` 和业务接口需要携带 `Authorization: Bearer accessToken`。

### 任务管理

- 获取当前用户任务列表：`GET /task`
- 获取任务详情：`GET /task/:id`
- 创建任务：`POST /task`
- 更新任务：`PATCH /task/:id`
- 删除任务：`DELETE /task/:id`
- 状态流转：`PATCH /task/:id/status/next`

任务状态流转规则：

```text
todo -> doing -> done -> todo
```

### 分类管理

- 获取当前用户分类列表：`GET /category`
- 创建分类：`POST /category`
- 更新分类：`PATCH /category/:id`
- 删除分类：`DELETE /category/:id`

分类规则：

- 分类属于当前登录用户。
- 同一个用户下分类名称不能重复。
- 任务可以绑定分类，也可以保持未分类。
- 删除分类时不会删除任务，任务会自动变成未分类。

### 用户数据隔离

- 每个任务都绑定当前登录用户。
- 每个分类都绑定当前登录用户。
- A 用户不能查询、更新、删除 B 用户的任务。
- A 用户不能使用 B 用户的分类。
- 访问不存在或不属于当前用户的数据时，返回 `404`。

### 参数校验和错误处理

- 全局开启 `ValidationPipe`。
- 未定义字段会被拒绝。
- 参数格式错误返回 `400`。
- 未登录或 token 无效返回 `401`。
- 数据不存在返回 `404`。
- 分类名称重复返回 `409`。

## 数据模型

当前 Prisma 模型包含：

- `User`
- `Task`
- `Category`
- `TaskStatus`
- `TaskLevel`

关系：

```text
User 1 --- n Task
User 1 --- n Category
Category 1 --- n Task
```

说明：

- 一个用户可以拥有多条任务。
- 一个用户可以拥有多个分类。
- 一条任务只属于一个用户。
- 一条任务可以属于一个分类，也可以不属于任何分类。

完整数据库说明见：

```text
docs/数据库说明.md
```

## 目录结构

```text
src/
  auth/
    decorators/
    dto/
    guards/
    strategies/
    types/
    auth.controller.ts
    auth.module.ts
    auth.service.ts
  category/
    dto/
    category.controller.ts
    category.module.ts
    category.service.ts
  prisma/
    prisma.module.ts
    prisma.service.ts
  task/
    dto/
    task.controller.ts
    task.module.ts
    task.service.ts
  types/
    task.ts
  main.ts
  app.module.ts
docs/
  接口说明.md
  数据库说明.md
prisma/
  migrations/
  schema.prisma
  seed-dev.sql
```

## 环境变量

后端依赖本地环境变量，配置文件位于：

```text
.env
```

至少需要：

```env
DATABASE_URL=你的 PostgreSQL 连接字符串
JWT_SECRET=本地开发密钥
JWT_EXPIRES_IN=7d
```

不要把真实连接字符串、密钥或 token 写入 README、提交记录或代码注释。

## 本地运行

安装依赖：

```cmd
npm install
```

生成 Prisma Client：

```cmd
npx prisma generate
```

执行数据库迁移：

```cmd
npx prisma migrate dev
```

写入开发 seed 数据：

```cmd
npx prisma db execute --file prisma/seed-dev.sql
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

## 常用接口

认证接口：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/auth/register` | 注册 |
| POST | `/auth/login` | 登录 |
| GET | `/auth/me` | 获取当前用户 |

任务接口：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/task` | 获取任务列表 |
| GET | `/task/:id` | 获取任务详情 |
| POST | `/task` | 创建任务 |
| PATCH | `/task/:id` | 更新任务 |
| DELETE | `/task/:id` | 删除任务 |
| PATCH | `/task/:id/status/next` | 流转到下一个状态 |

分类接口：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/category` | 获取分类列表 |
| POST | `/category` | 创建分类 |
| PATCH | `/category/:id` | 更新分类 |
| DELETE | `/category/:id` | 删除分类 |

完整请求参数和响应示例见：

```text
docs/接口说明.md
```

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

- 任务列表接口暂未实现后端分页、排序和复杂查询参数。
- 分类接口已经完成，前端当前只用于任务绑定和筛选，暂未做独立分类管理页面。
- 当前没有 refresh token，token 过期后需要重新登录。
- 当前没有角色权限、团队协作、文件上传和标签功能。

## 已完成学习重点

- NestJS 模块拆分、Controller、Service、DTO。
- 使用 Prisma 管理 PostgreSQL 数据模型和迁移。
- 使用 bcrypt 处理密码 hash。
- 使用 JWT 和 Passport 实现登录认证。
- 使用 Guard 保护业务接口。
- 使用当前用户信息实现任务和分类的数据隔离。
- 使用 NestJS 内置异常完成统一错误处理。
- 使用接口文档指导 Postman 和前端联调。
