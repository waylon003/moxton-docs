---
name: development-plan-guide
description: 指导 AI 如何为 Moxton 项目编写正确的开发计划，理解项目角色分工，确定任务归属，使用正确的模板和命名规范
---

# 开发计划编写指南

## 概述

指导 AI 如何为 Moxton 项目编写正确的开发计划。这个 skill 帮助 AI 理解项目角色分工，确定任务归属，使用正确的模板和命名规范。

## 使用场景

当以下情况发生时，应该参考此 skill：
- 用户询问"如何编写开发计划？"
- 用户询问"这个任务应该给谁做？"
- 正在创建新的任务文档
- 需要确定任务的角色归属

---

## 项目角色概览

Moxton 项目有 3 个核心角色，每个角色负责不同的项目和技术栈：

| 角色 | 代码 | 项目 | 工作目录 | 技术栈 |
|------|------|------|----------|--------|
| 独立站前端工程师 | `SHOP-FE` | nuxt-moxton | `E:\nuxt-moxton` | Nuxt 3 + Vue 3 + TypeScript + Reka UI + UnoCSS |
| CRUD前端工程师 | `ADMIN-FE` | moxton-lotadmin | `E:\moxton-lotadmin` | Vue 3 + TypeScript + SoybeanAdmin + Naive UI |
| 后端工程师 | `BACKEND` | moxton-lotapi | `E:\moxton-lotapi` | Node.js + Koa + TypeScript + Prisma + MySQL |

---

## 任务归属决策树

使用以下决策树来确定任务应该分配给哪个角色：

```
用户需求
    │
    ├─ 涉及商城用户界面？（产品展示、购物车、结账、支付页面）
    │   └─ 是 → SHOP-FE
    │
    ├─ 涉及后台管理界面？（商品管理、订单管理、用户权限、数据统计）
    │   └─ 是 → ADMIN-FE
    │
    ├─ 涉及 API 接口或数据库？（CRUD 操作、业务逻辑、数据存储）
    │   └─ 是 → BACKEND
    │
    └─ 涉及多个角色？
        └─ 创建主任务 + 按角色拆分子任务
```

### 角色任务特征

#### SHOP-FE（独立站前端）
**典型任务：**
- 商城页面开发（首页、产品页、分类页）
- 购物车功能
- 结账流程
- 支付集成（Stripe 等）
- 用户界面交互
- 响应式布局

**判断关键词：** 商城、产品、购物车、结账、支付、用户界面、页面

#### ADMIN-FE（CRUD前端）
**典型任务：**
- 商品管理界面
- 订单管理界面
- 用户权限管理
- 数据统计和报表
- 后台仪表板
- 表单和列表组件

**判断关键词：** 管理、后台、仪表板、统计、报表、CRUD

#### BACKEND（后端）
**典型任务：**
- API 接口开发
- 数据库设计和迁移
- 认证和授权
- 业务逻辑实现
- 第三方服务集成
- 数据处理和存储

**判断关键词：** API、接口、数据库、后端、服务、逻辑

---

## 任务目录结构

```
E:\moxton-docs\01-tasks\
├── active/
│   ├── shop-frontend/      # SHOP-FE 任务
│   ├── admin-frontend/     # ADMIN-FE 任务
│   └── backend/            # BACKEND 任务
├── backlog/
│   ├── shop-frontend/
│   ├── admin-frontend/
│   └── backend/
├── completed/
│   ├── shop-frontend/
│   ├── admin-frontend/
│   └── backend/
└── templates/
    ├── tech-spec-shop-frontend.md
    ├── tech-spec-admin-frontend.md
    └── tech-spec-backend.md
```

---

## 命名规范

### 格式

```
[角色代码]-[序号]-[任务标题].md
```

### 示例

| 角色 | 文件名示例 |
|------|-----------|
| SHOP-FE | `SHOP-FE-001-stripe-integration.md` |
| SHOP-FE | `SHOP-FE-002-shopping-cart-refactor.md` |
| ADMIN-FE | `ADMIN-FE-001-product-management.md` |
| ADMIN-FE | `ADMIN-FE-002-order-list-page.md` |
| BACKEND | `BACKEND-001-payment-api.md` |
| BACKEND | `BACKEND-002-user-authentication.md` |

### 命名规则

1. **角色代码**：使用大写代码（SHOP-FE、ADMIN-FE、BACKEND）
2. **序号**：三位数字，从 001 开始递增
3. **任务标题**：小写字母，单词用连字符连接
4. **文件扩展名**：`.md`

---

## 任务模板使用指南

### 选择正确的模板

| 角色 | 模板文件 | 路径 |
|------|----------|------|
| SHOP-FE | `tech-spec-shop-frontend.md` | `01-tasks/templates/` |
| ADMIN-FE | `tech-spec-admin-frontend.md` | `01-tasks/templates/` |
| BACKEND | `tech-spec-backend.md` | `01-tasks/templates/` |

### 创建任务步骤

```bash
# 1. 复制对应角色的模板
cp E:\moxton-docs\01-tasks\templates\tech-spec-shop-frontend.md \
   E:\moxton-docs\01-tasks\active\shop-frontend\SHOP-FE-001-new-feature.md

# 2. 编辑任务文档，填写以下部分：
#    - 概述（问题陈述、解决方案、范围）
#    - 开发上下文（现有实现、依赖项）
#    - 技术方案（架构设计、数据模型、API 调用）
#    - 实施步骤
#    - 验收标准
#    - 风险和注意事项

# 3. 更新 STATUS.md
```

---

## 任务拆分指南

### 单角色任务

当任务只涉及一个角色时：

1. 确定角色归属
2. 在对应角色的 `active/` 目录创建任务
3. 使用该角色的模板
4. 直接编写技术规格

**示例：**
```
需求：实现 Stripe 支付集成
→ 角色：SHOP-FE
→ 位置：01-tasks/active/shop-frontend/SHOP-FE-001-stripe-integration.md
```

### 跨角色任务

当任务涉及多个角色时：

1. **创建主任务文档**（放在 `01-tasks/active/` 根目录）
2. **按角色拆分子任务**
3. **每个子任务使用对应角色的模板**
4. **在主任务中引用所有子任务**

**示例结构：**
```
01-tasks/active/
├── FEATURE-001-complete-order-flow.md (主任务)
└── shop-frontend/
    ├── SHOP-FE-001-checkout-page.md
    └── SHOP-FE-002-payment-integration.md
```

**主任务模板：**
```markdown
# FEATURE-001: 完整订单流程

## 概述
实现从浏览产品到支付完成的完整订单流程。

## 子任务

### 前端任务
- [SHOP-FE-001](./shop-frontend/SHOP-FE-001-checkout-page.md) - 结账页面
- [SHOP-FE-002](./shop-frontend/SHOP-FE-002-payment-integration.md) - 支付集成

### 后端任务
- [BACKEND-001](./backend/BACKEND-001-order-api.md) - 订单 API
- [BACKEND-002](./backend/BACKEND-002-payment-api.md) - 支付 API

## 依赖关系
```

---

## 快速检查清单

创建任务前，确认以下各项：

- [ ] **确定角色归属** - 使用决策树确定任务属于哪个角色
- [ ] **选择正确目录** - 任务将放在 `active/` 下的哪个子目录
- [ ] **使用正确模板** - 根据角色选择对应的模板文件
- [ ] **命名符合规范** - 格式：`[角色代码]-[序号]-[任务标题].md`
- [ ] **填写完整内容** - 概述、技术方案、实施步骤、验收标准
- [ ] **更新 STATUS.md** - 记录新任务的创建

---

## 示例场景

### 场景 1：商城支付功能

**需求：** 实现 Stripe 支付集成

**分析：**
- 涉及商城用户界面 → SHOP-FE
- 需要调用支付 API → 涉及后端

**决策：** 跨角色任务

**任务结构：**
```
01-tasks/active/
├── FEATURE-001-stripe-payment.md (主任务)
├── shop-frontend/
│   └── SHOP-FE-001-stripe-elements-integration.md
└── backend/
    └── BACKEND-001-stripe-api-endpoint.md
```

### 场景 2：商品管理页面

**需求：** 实现后台商品管理界面

**分析：**
- 涉及后台管理界面 → ADMIN-FE

**决策：** 单角色任务（ADMIN-FE）

**任务位置：**
```
01-tasks/active/admin-frontend/ADMIN-FE-001-product-management.md
```

### 场景 3：支付 API 开发

**需求：** 开发支付处理 API

**分析：**
- 涉及 API 接口和业务逻辑 → BACKEND

**决策：** 单角色任务（BACKEND）

**任务位置：**
```
01-tasks/active/backend/BACKEND-001-payment-api.md
```

---

## 相关文档

| 文档 | 路径 | 说明 |
|------|------|------|
| 任务状态 | `01-tasks/STATUS.md` | 当前任务统计 |
| 角色定义 | `.claude/agents/` | AI 角色提示词 |
| API 文档 | `02-api/` | 后端 API 规范 |
| 项目状态 | `04-projects/` | 三端项目状态 |

---

## 技巧和最佳实践

1. **先阅读现有任务** - 查看 `active/` 和 `completed/` 中的任务，了解写作风格
2. **保持验收标准可测试** - 每个验收标准都应该能被验证
3. **注明依赖关系** - 如果任务依赖其他任务或 API，明确说明
4. **使用具体文件路径** - 在技术方案中引用具体的文件路径
5. **考虑边界情况** - 在风险部分列出可能的边界情况
6. **更新相关文档** - 创建任务后更新 STATUS.md

---

## 故障排查

### 问题：不确定任务归属

**解决方案：**
1. 使用决策树逐步判断
2. 参考上述"角色任务特征"
3. 查看现有类似任务属于哪个角色

### 问题：任务涉及多个角色

**解决方案：**
1. 创建主任务文档描述整体需求
2. 按角色拆分为多个子任务
3. 在主任务中明确子任务之间的关系

### 问题：不确定如何拆分任务

**解决方案：**
1. 按技术边界拆分（前端 vs 后端）
2. 按功能模块拆分（支付、订单、用户等）
3. 确保每个任务可以独立完成和测试
