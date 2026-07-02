# 任务管理后端 API

基于 NestJS、Prisma 和 PostgreSQL 的任务管理后端服务。

## 技术栈

- NestJS
- TypeScript
- PostgreSQL
- Prisma
- bcrypt
- JWT + Refresh Token
- Passport
- Multer
- Swagger / OpenAPI
- Jest

## 当前功能

### 认证与权限

- 用户注册、登录、退出登录。
- bcrypt 密码 hash，不保存明文密码。
- access token + refresh token 登录认证。
- refresh token hash 存储，刷新时轮换，退出时失效。
- 普通用户与超级管理员两种角色。
- 用户支持启用 / 禁用状态。
- 被禁用用户不能登录，也不能继续访问受保护接口。
- RBAC 角色守卫保护管理员接口。

### 任务与分类

- 任务 CRUD。
- 任务状态流转。
- 普通用户任务数据隔离。
- 普通用户只能查看和操作自己的任务。
- 普通用户分类 CRUD。
- 创建和更新任务时会校验分类是否属于当前用户。

### 文件与头像

- 图片上传接口。
- 用户头像上传接口。
- 只允许 `png`、`jpg`、`webp`。
- 单文件大小限制为 2MB。
- 上传文件保存在本地 `uploads/` 目录。

### 管理后台接口

- 超级管理员用户管理接口。
- 超级管理员分类管理接口。
- 管理员可以查看用户列表、用户详情、启用和禁用用户。
- 管理员可以查看和维护全部用户的分类。

### 工程能力

- Swagger / OpenAPI 接口文档。
- 统一异常响应。
- 基础请求日志。
- 关键接口单元测试。
- Dockerfile 和 Docker Compose 基础支持。

## 常用地址

```text
API:     http://localhost:3000
Swagger: http://localhost:3000/api-docs
```

## 环境变量

创建本地 `.env`，至少包含：

```env
DATABASE_URL="PostgreSQL 连接字符串"
JWT_SECRET="本地 access token 密钥"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="本地 refresh token 密钥"
JWT_REFRESH_EXPIRES_IN="7d"
```

不要把真实连接字符串、密钥、token 提交到 Git。

## 本地启动

```cmd
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db execute --file prisma/seed-dev.sql
npm run start:dev
```

如果数据库容器被重建导致表结构消失，可以重新执行：

```cmd
npx prisma migrate dev
npx prisma db execute --file prisma/seed-dev.sql
```

## 构建和测试

```cmd
npm run build
npm test
```

## Docker 基础

项目根目录提供了 `docker-compose.yml`，后端目录提供了 `Dockerfile`。

```cmd
cd /d E:\vscode\fullstack
docker compose up --build
```

上传文件目录会挂载到：

```text
task-server/uploads/
```

注意：

- 容器内后端访问数据库时使用服务名 `postgres`，不是 `localhost`。
- `docker compose up --build` 会重建镜像，但不会删除数据库 volume。
- `docker compose down -v` 会删除数据库 volume，数据会丢失。

## 核心接口

Auth：

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/avatar`

Task：

- `GET /task`
- `GET /task/:id`
- `POST /task`
- `PATCH /task/:id`
- `DELETE /task/:id`
- `PATCH /task/:id/status/next`

Category：

- `GET /category`
- `POST /category`
- `PATCH /category/:id`
- `DELETE /category/:id`

Upload：

- `POST /upload/image`

Admin：

- `GET /admin/users`
- `GET /admin/users/:id`
- `PATCH /admin/users/:id/status`
- `GET /admin/categories`
- `POST /admin/categories`
- `PATCH /admin/categories/:id`
- `DELETE /admin/categories/:id`

完整说明见：

```text
docs/接口说明.md
docs/数据库说明.md
```

## 测试覆盖重点

- 登录返回 refresh token。
- refresh token 轮换和 logout 失效。
- 禁用用户不能登录。
- 普通用户不能访问管理员接口。
- 任务接口按当前用户隔离。
- 创建任务时不能使用其他用户的分类。
- 非图片上传会被拒绝。
