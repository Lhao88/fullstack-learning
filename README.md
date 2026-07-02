# Fullstack Learning

这是一个从前端任务看板逐步扩展出来的全栈练习项目，目前已经包含 React 前端、NestJS 后端、PostgreSQL 数据库、JWT 认证、RBAC 权限、文件上传、Swagger 文档和 Docker 基础配置。

## 项目结构

```text
fullstack/
  ts-demo/       React + TypeScript 前端
  task-server/   NestJS + Prisma 后端
  codex-notes/   学习计划、任务清单和阶段说明
  docker-compose.yml
```

## 当前能力

- 普通用户注册、登录、退出登录。
- access token + refresh token 登录认证。
- bcrypt 密码加密，数据库不保存明文密码。
- 普通用户只能管理自己的任务和分类。
- 任务支持新增、编辑、删除、状态流转、归档和分类筛选。
- 普通用户可以上传头像。
- 超级管理员拥有独立管理后台。
- 超级管理员可以查看用户列表、用户详情、启用或禁用用户。
- 超级管理员可以查看和维护全部用户的分类。
- 后端提供 Swagger / OpenAPI 文档。
- 后端提供统一异常响应和基础请求日志。
- 项目提供 Dockerfile 和 docker-compose 基础配置。

## 本地开发启动

### 1. 启动数据库

你可以使用本地 PostgreSQL，也可以使用 Docker 启动 PostgreSQL。

如果使用当前仓库的 Docker Compose：

```cmd
docker compose up -d postgres
```

当前 `docker-compose.yml` 中 PostgreSQL 默认映射到宿主机 `5433`。

### 2. 启动后端

```cmd
cd /d E:\vscode\fullstack\task-server
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db execute --file prisma/seed-dev.sql
npm run start:dev
```

后端默认地址：

```text
http://localhost:3000
```

Swagger 地址：

```text
http://localhost:3000/api-docs
```

### 3. 启动前端

```cmd
cd /d E:\vscode\fullstack\ts-demo
npm install
npm run dev
```

前端默认地址：

```text
http://localhost:5173
```

## Docker 启动

从项目根目录执行：

```cmd
docker compose up --build
```

这会根据 `docker-compose.yml` 构建并启动 PostgreSQL、后端和前端。

注意：

- `docker compose up --build` 不会删除数据库 volume。
- `docker compose down -v` 会删除 volume，数据库数据会丢失。
- 上传文件映射到 `task-server/uploads/`，不要提交到 Git。

## 验证命令

后端：

```cmd
cd /d E:\vscode\fullstack\task-server
npm run build
npm test
```

前端：

```cmd
cd /d E:\vscode\fullstack\ts-demo
npm run build
```

## 文档入口

- 前端说明：`ts-demo/README.md`
- 后端说明：`task-server/README.md`
- 接口说明：`task-server/docs/接口说明.md`
- 数据库说明：`task-server/docs/数据库说明.md`
- 第五周任务清单：`codex-notes/第五周真实业务化增强/第五周任务清单.md`

## 安全提醒

- 不要提交 `.env` 中的真实数据库密码和 JWT 密钥。
- 不要把 token、refresh token、密码写入日志或文档。
- refresh token 在数据库中只保存 hash。
- 权限必须以后端校验为准，前端隐藏入口只是体验优化。
