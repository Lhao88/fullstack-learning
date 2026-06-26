# 全栈与 App 开发 1.5 个月学习路线

> 时间安排：约 6 周，每天 8 小时  
> 当前基础：已学习前端基础、Vue 基础、React 基础  
> 目标方向：全栈开发 + App 开发

## 一、总目标

6 周后完成一个可以放进作品集的完整项目：

**习惯打卡 / 任务管理全栈系统**

建议包含：

- Web 管理端
- 移动 App 客户端
- 后端 API
- 数据库
- 登录注册
- 权限控制
- 图片上传
- 数据统计
- 项目 README
- 本地启动说明

## 二、推荐技术栈

### 主路线

- 语言：TypeScript
- Web 前端：React + Next.js
- App：Expo + React Native
- 后端：NestJS
- 数据库：PostgreSQL
- ORM：Prisma
- 请求：Axios 或 fetch
- 状态管理：Zustand
- UI：Tailwind CSS / shadcn/ui / Ant Design 任选其一
- 测试：Vitest + Supertest
- 部署：Vercel + Render / Railway / Fly.io + Supabase / Neon

### 如果更想继续 Vue

- Web 前端：Vue 3 + Vite + Pinia
- 管理后台：Vue 3 + Element Plus
- 后端、数据库、App 路线保持不变

App 方向仍建议先使用 Expo + React Native，因为可以复用 React 和 TypeScript 经验。

## 三、每天学习节奏

每天 8 小时建议拆分为：

- 2 小时：学习新知识，看官方文档、课程或文章
- 4 小时：写代码，完成当天功能
- 1 小时：调试、查错、补边界情况
- 1 小时：整理笔记、提交 Git、复盘问题

每天都要有代码产出，不建议只看课不动手。

## 四、第 1 周：工程化与 TypeScript

### 学习目标

让前端代码从“能写页面”过渡到“能写项目”。

### 重点内容

- TypeScript 基础
- interface、type、泛型、联合类型、工具类型
- Git 基础工作流
- npm / pnpm
- Vite 项目结构
- ESLint / Prettier
- HTTP 基础
- RESTful 接口概念
- 前端目录组织
- 组件拆分
- 请求封装
- 本地存储

### 实战练习

完成一个 TypeScript 前端任务看板。

功能要求：

- 新增任务
- 编辑任务
- 删除任务
- 标记完成
- 搜索任务
- 按状态筛选
- 使用 localStorage 保存数据
- 组件拆分清晰

### 本周产出

- 一个可运行的 TypeScript 前端小项目
- 至少 10 次 Git 提交
- 一份项目 README

## 五、第 2 周：Node 后端与 API

### 学习目标

能独立写出基础 REST API。

### 重点内容

- Node.js 基础
- 异步编程
- NestJS 基础
- Module
- Controller
- Service
- DTO
- 参数校验
- 统一错误处理
- RESTful API 设计
- JWT 登录认证
- CORS
- 环境变量

### 实战练习

给第 1 周任务看板增加后端。

API 建议：

- 用户注册
- 用户登录
- 获取当前用户信息
- 获取任务列表
- 创建任务
- 更新任务
- 删除任务
- 标记任务完成

### 本周产出

- 一个 NestJS 后端项目
- 一套任务管理 REST API
- 使用 Postman / Apifox / Thunder Client 完成接口测试
- 一份接口说明文档

## 六、第 3 周：数据库与完整 CRUD

### 学习目标

打通前端、后端、数据库，形成真正的全栈项目。

### 重点内容

- PostgreSQL 基础
- 表、字段、主键、外键
- 一对多关系
- Prisma schema
- Prisma migration
- Prisma client
- 用户表设计
- 任务表设计
- 分类表设计
- 标签表设计
- 分页
- 搜索
- 排序
- 登录态保存
- 路由守卫

### 实战练习

把任务系统升级为数据库版本。

功能要求：

- 注册登录
- JWT 鉴权
- 用户只能访问自己的任务
- 任务 CRUD
- 分类管理
- 标签管理
- 分页查询
- 关键词搜索
- 按状态筛选

### 本周产出

- 前端、后端、数据库完整打通
- Prisma migration 文件
- 数据库表结构说明
- 能用真实账号登录并管理数据

## 七、第 4 周：真实业务能力增强

### 学习目标

让项目从练习项目变成更接近真实业务的项目。

### 重点内容

- 文件上传
- 用户头像
- 图片存储
- RBAC 权限
- 普通用户与管理员
- Swagger / OpenAPI
- 日志
- 异常处理
- 接口测试
- Docker 基础
- 部署基础

### 实战练习

增加 Web 管理后台。

后台功能：

- 用户列表
- 用户详情
- 启用 / 禁用用户
- 任务数据统计
- 管理员查看全部任务
- 普通用户只能查看自己的任务
- 上传头像
- Swagger 接口文档

### 本周产出

- 一个 Web 管理端
- 后端权限控制
- 文件上传能力
- Swagger 文档
- 至少 5 到 10 个关键接口测试

## 八、第 5 周：App 开发

### 学习目标

把已有全栈项目扩展到移动 App。

### 重点内容

- Expo 项目创建
- React Native 基础组件
- View
- Text
- Image
- ScrollView
- FlatList
- Pressable
- TextInput
- Expo Router 或 React Navigation
- 移动端布局
- 表单处理
- Token 存储
- 调用后端 API
- 图片选择
- 相机 / 相册
- App 调试

### 实战练习

给任务系统做 App 客户端。

App 功能：

- 登录
- 注册
- 查看任务列表
- 新增任务
- 编辑任务
- 删除任务
- 标记完成
- 上传头像
- 查看个人统计

### 本周产出

- 一个 Expo App
- App 能调用自己的后端接口
- App 和 Web 使用同一套用户系统
- App 至少完成核心任务管理流程

## 九、第 6 周：毕业项目整合

### 学习目标

完成一个可以展示、复盘、写进简历的完整项目。

### 项目建议

项目名称：

**习惯打卡 + 任务管理系统**

核心模块：

- 用户注册登录
- 用户个人信息
- 任务管理
- 习惯打卡
- 分类 / 标签
- 连续打卡天数
- 完成率统计
- 趋势图表
- Web 管理后台
- App 用户端
- 后端 API
- 数据库
- 权限控制
- 图片上传

### 本周任务

- 整理代码结构
- 修复主要 bug
- 补充 README
- 补充启动说明
- 补充接口说明
- 补充数据库结构说明
- 截图展示核心页面
- 尝试部署前端
- 尝试部署后端
- 尝试使用云数据库

### 本周产出

- 一个完整作品集项目
- 一份清晰 README
- 一套本地启动命令
- 项目截图
- 项目功能清单
- 技术栈说明
- 后续优化计划

## 十、每周验收标准

| 周数 | 验收标准 |
| --- | --- |
| 第 1 周 | 有一个 TypeScript 前端任务看板 |
| 第 2 周 | 有一个可用的后端 REST API |
| 第 3 周 | 前端、后端、数据库完整打通 |
| 第 4 周 | 有认证、权限、上传、接口文档和测试 |
| 第 5 周 | App 能登录并调用后端 API |
| 第 6 周 | 完成一个可展示的全栈 + App 项目 |

## 十一、建议项目目录

```text
fullstack-habit-task/
  apps/
    web/
    mobile/
  server/
  docs/
    api.md
    database.md
    deployment.md
  README.md
```

也可以拆成三个仓库：

```text
habit-task-web/
habit-task-mobile/
habit-task-server/
```

如果是学习阶段，建议先放在一个 monorepo 里，方便统一管理。

## 十二、学习时不要分散精力

这 1.5 个月不建议同时深挖太多方向。

暂时不要同时学习：

- Vue
- React
- Next.js
- Nuxt
- Flutter
- uni-app
- Java
- Go
- Spring Boot

当前最重要的是练熟：

- 页面怎么组织
- 组件怎么拆分
- 接口怎么设计
- 数据库表怎么建
- 登录权限怎么做
- Web 和 App 怎么共用同一套后端
- 项目怎么从 0 做到能展示

## 十三、每日复盘模板

每天学习结束后，可以记录：

```md
## 日期

### 今天完成了什么

- 

### 今天遇到的问题

- 

### 怎么解决的

- 

### 明天要做什么

- 

### 今日 Git 提交

- 
```

## 十四、优先级提醒

如果时间不够，优先保证：

1. 登录注册
2. 任务 CRUD
3. 数据库持久化
4. Web 端完整流程
5. App 端核心流程
6. README 和截图

如果还有余力，再做：

1. 权限系统
2. 文件上传
3. 数据统计
4. 自动化测试
5. 部署
6. UI 打磨

