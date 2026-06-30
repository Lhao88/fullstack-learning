INSERT INTO "User" ("id", "email", "password", "nickname", "createdAt", "updatedAt")
VALUES (
  'dev-user-001',
  'dev@example.com',
  '$2b$10$hM0MgPC4NDpQyK8YwcY07emdwT7zDQCldyY1TGnzRiitwvR/5PNeC',
  '测试用户',
  '2026-06-23 09:00:00',
  '2026-06-28 20:00:00'
)
ON CONFLICT ("email") DO UPDATE SET
  "password" = EXCLUDED."password",
  "nickname" = EXCLUDED."nickname",
  "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "Task" ("id", "title", "description", "status", "level", "createdAt", "updatedAt", "userId")
VALUES
  ('seed-task-001', '完成 Prisma 初始化', '安装 Prisma 并完成 schema.prisma 的基础配置。', 'done', 'high', '2026-06-23 09:20:00', '2026-06-23 11:10:00', 'dev-user-001'),
  ('seed-task-002', '确认 PostgreSQL 连接', '使用 Docker PostgreSQL 验证 DATABASE_URL 可以正常连接。', 'done', 'high', '2026-06-23 11:30:00', '2026-06-23 12:15:00', 'dev-user-001'),
  ('seed-task-003', '设计用户模型', '在 Prisma schema 中定义 User 模型字段和唯一邮箱。', 'done', 'medium', '2026-06-23 14:00:00', '2026-06-23 15:05:00', 'dev-user-001'),
  ('seed-task-004', '设计任务模型', '在 Prisma schema 中定义 Task 模型和用户关系。', 'done', 'high', '2026-06-24 09:10:00', '2026-06-24 10:40:00', 'dev-user-001'),
  ('seed-task-005', '执行数据库迁移', '运行 migrate dev 创建 User 和 Task 数据表。', 'done', 'high', '2026-06-24 11:00:00', '2026-06-24 11:35:00', 'dev-user-001'),
  ('seed-task-006', '查看 Prisma Studio', '打开 Prisma Studio 检查表结构和字段类型。', 'doing', 'medium', '2026-06-24 14:20:00', '2026-06-24 16:00:00', 'dev-user-001'),
  ('seed-task-007', '封装 PrismaService', '在 NestJS 中创建 PrismaService 统一管理数据库连接。', 'doing', 'high', '2026-06-25 09:30:00', '2026-06-25 11:20:00', 'dev-user-001'),
  ('seed-task-008', '改造任务列表查询', '把 findAll 从内存数组改为 Prisma 查询。', 'doing', 'high', '2026-06-25 13:00:00', '2026-06-25 15:15:00', 'dev-user-001'),
  ('seed-task-009', '改造任务详情查询', '使用用户 id 和任务 id 查询当前用户自己的任务。', 'doing', 'medium', '2026-06-25 16:00:00', '2026-06-25 17:05:00', 'dev-user-001'),
  ('seed-task-010', '改造任务新增接口', '创建任务时自动绑定测试用户。', 'todo', 'high', '2026-06-26 09:00:00', '2026-06-26 09:00:00', 'dev-user-001'),
  ('seed-task-011', '改造任务更新接口', '更新任务标题、描述、状态和优先级，并刷新更新时间。', 'todo', 'medium', '2026-06-26 10:30:00', '2026-06-26 10:45:00', 'dev-user-001'),
  ('seed-task-012', '改造任务删除接口', '使用 Prisma 删除任务，并保留 404 错误处理。', 'todo', 'medium', '2026-06-26 14:00:00', '2026-06-26 14:00:00', 'dev-user-001'),
  ('seed-task-013', '改造状态流转接口', '把任务状态按 todo、doing、done 顺序流转。', 'todo', 'high', '2026-06-26 16:10:00', '2026-06-26 16:20:00', 'dev-user-001'),
  ('seed-task-014', '创建 Auth 模块', '生成 auth module、controller 和 service。', 'todo', 'high', '2026-06-27 09:15:00', '2026-06-27 09:15:00', 'dev-user-001'),
  ('seed-task-015', '设计注册 DTO', '定义注册接口需要的 email、password 和 nickname。', 'todo', 'medium', '2026-06-27 10:40:00', '2026-06-27 11:05:00', 'dev-user-001'),
  ('seed-task-016', '设计登录 DTO', '定义登录接口需要的 email 和 password。', 'todo', 'medium', '2026-06-27 13:30:00', '2026-06-27 13:30:00', 'dev-user-001'),
  ('seed-task-017', '实现密码加密', '使用 bcrypt 保存加密后的用户密码。', 'todo', 'high', '2026-06-27 15:20:00', '2026-06-27 15:20:00', 'dev-user-001'),
  ('seed-task-018', '实现 JWT 登录', '登录成功后返回 accessToken 和用户基础信息。', 'todo', 'high', '2026-06-28 09:00:00', '2026-06-28 09:30:00', 'dev-user-001'),
  ('seed-task-019', '保护任务接口', '给任务接口加 JWT Guard，未登录返回 401。', 'todo', 'high', '2026-06-28 11:10:00', '2026-06-28 11:10:00', 'dev-user-001'),
  ('seed-task-020', '更新数据库说明文档', '记录 User、Task 表结构和常用 Prisma 命令。', 'todo', 'low', '2026-06-28 16:00:00', '2026-06-28 17:25:00', 'dev-user-001')
ON CONFLICT ("id") DO UPDATE SET
  "title" = EXCLUDED."title",
  "description" = EXCLUDED."description",
  "status" = EXCLUDED."status",
  "level" = EXCLUDED."level",
  "createdAt" = EXCLUDED."createdAt",
  "updatedAt" = EXCLUDED."updatedAt",
  "userId" = EXCLUDED."userId";
