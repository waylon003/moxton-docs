# 快速开始：任务自动分配系统

## 🚀 30秒快速开始

> 💡 **新用户提示**: 如果你是第一次接手 Moxton 项目，建议先阅读 [.claude/skills/development-plan-guide.md](.claude/skills/development-plan-guide.md) 了解如何编写开发计划。

### 1. 启动主会话

在 moxton-docs 目录启动 Claude Code：

```bash
cd E:\moxton-docs
claude-code .
```

### 2. 查看可用任务

**方式 A: 使用脚本**
```bash
python scripts/assign_task.py --list
```

**方式 B: 直接查看**
- 打开 `01-tasks/STATUS.md`
- 或查看 `01-tasks/active/` 目录

### 3. 分配任务

**最简单的方式：**

```
@FRONTEND 请实现 FRONTEND-007 任务
```

**或使用具体命令：**

```
Task(
  subagent_type='oh-my-claudecode:executor',
  prompt='阅读并实现 E:\moxton-docs\01-tasks\active\FRONTEND-007-checkout-address-integration.md',
  model='sonnet'
)
```

---

## 📋 当前可用任务

### 前端任务 (FRONTEND)
- **FRONTEND-007**: checkout-address-integration
- **FRONTEND-008**: cart-refactor-to-stores
- **FRONTEND-009**: frontend-stripe-elements

### 后端任务 (BACKEND)
- **BACKEND-002**: order-address-optimization
- **BACKEND-003**: backend-stripe-elements
- **BACKEND-004**: order-payment-integration-fix

### 管理后台任务 (ADMIN)
- 查看 `01-tasks/backlog/ADMIN-*.md`

---

## 💡 使用示例

### 示例 1: 分配前端任务

```
@FRONTEND 请实现 FRONTEND-007：结账地址集成
```

Agent 会：
1. 读取任务文档
2. 切换到 `E:\nuxt-moxton`
3. 开始实现功能

### 示例 2: 分配后端任务

```
@BACKEND 请实现 BACKEND-003：Stripe Elements 后端集成
```

Agent 会：
1. 读取任务文档
2. 切换到 `E:\moxton-lotapi`
3. 开始实现 API

### 示例 3: 批量分配

```
请分配所有待处理的 FRONTEND 任务
```

---

## 🔧 工具命令

### Python 脚本

```bash
# 列出所有活跃任务
python scripts/assign_task.py --list

# 扫描并建议分配
python scripts/assign_task.py --scan

# 查看特定任务详情
python scripts/assign_task.py FRONTEND-007
```

### 状态查看

```bash
# 查看任务状态总览
cat 01-tasks/STATUS.md

# 查看项目状态
cat 04-projects/nuxt-moxton.md
cat 04-projects/moxton-lotapi.md
cat 04-projects/moxton-lotadmin.md
```

---

## 🎯 任务状态流转

```
backlog/ → active/ → completed/
   ↓         ↓          ↓
  待办     进行中     已完成
```

### 移动任务

```bash
# 将任务从 backlog 移到 active
mv 01-tasks/backlog/FRONTEND-010-*.md 01-tasks/active/

# 将完成的任务移到 completed
mv 01-tasks/active/FRONTEND-007-*.md 01-tasks/completed/
```

---

## ✨ 最佳实践

1. **文档优先** - 先在 `01-tasks/` 创建任务文档
2. **清晰命名** - 使用 `FRONTEND-001-feature-name.md` 格式
3. **状态同步** - 完成后更新 `01-tasks/STATUS.md`
4. **从 moxton-docs 启动** - 保持主会话在文档仓库

---

## 📚 更多文档

### 任务相关
- [.claude/skills/development-plan-guide.md](.claude/skills/development-plan-guide.md) - 开发计划编写指南
- [.claude/skills/examples/](.claude/skills/examples/) - 任务编写示例
- [01-tasks/STATUS.md](01-tasks/STATUS.md) - 任务状态总览

### 项目相关
- [04-projects/](04-projects/) - 项目协调状态
- [02-api/](02-api/) - API 文档
- [.claude/agents/](.claude/agents/) - AI 角色定义
