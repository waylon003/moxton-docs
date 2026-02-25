# 任务自动分配系统

## 🎯 目标

当在 `moxton-docs` 目录下更新任务文档时，对应的 agent 自动识别并领取任务。

## 📋 工作流程

### 1. 任务创建

在 `E:\moxton-docs\01-tasks\` 下创建任务：

```bash
# 从模板创建新任务
cd E:\moxton-docs
cp 01-tasks/templates/tech-spec.md 01-tasks/active/FRONTEND-001-new-feature.md
```

### 2. 任务分配

**方式 A: 手动触发 agent**

```
@FRONTEND 请实现 FRONEND-001 任务
@BACKEND 请实现 BACKEND-002 任务
@ADMIN 请实现 ADMIN-003 任务
```

**方式 B: 使用 /assign 命令**

```
/assign FRONTEND-001
```

### 3. Agent 自动启动

对应的 agent 会：
1. 读取任务文档
2. 切换到对应项目目录
3. 开始执行任务

## 🤖 可用的 Agent

| Agent | 项目 | 触发方式 | 工作目录 |
|-------|------|----------|----------|
| @FRONTEND | nuxt-moxton | 提及 @FRONTEND | E:\nuxt-moxton |
| @BACKEND | moxton-lotapi | 提及 @BACKEND | E:\moxton-lotapi |
| @ADMIN | moxton-lotadmin | 提及 @ADMIN | E:\moxton-lotadmin |

## 💡 使用示例

### 示例 1: 创建并分配前端任务

```bash
# 1. 在 moxton-docs 中创建任务
cd E:\moxton-docs
# 编辑 01-tasks/active/FRONTEND-001-payment-integration.md

# 2. 在 Claude Code 中触发
@FRONTEND 请查看 01-tasks/active/FRONTEND-001-payment-integration.md 并开始实现
```

### 示例 2: 批量分配任务

```
@FRONTEND 处理所有 FRONTEND 开头的任务
@BACKEND 处理所有 BACKEND 开头的任务
@ADMIN 处理所有 ADMIN 开头的任务
```

### 示例 3: 自动任务发现

```
/scan-tasks
```

这会：
1. 扫描 `01-tasks/active/` 目录
2. 列出所有待处理任务
3. 建议哪个 agent 应该处理哪个任务

## 🔧 配置

### 在各项目的 CLAUDE.md 中添加

每个项目的 `CLAUDE.md` 已经包含：

```markdown
## Documentation Repository

**中心文档仓库**: `E:\moxton-docs`

查看任务文档：
- [进行中的任务](E:\moxton-docs\01-tasks\active\)
- [待办任务](E:\moxton-docs\01-tasks\backlog\)
- [已完成的任务](E:\moxton-docs\01-tasks\completed\)
```

这样任何 agent 都知道去哪里查找任务。

## 📊 任务状态流转

```
backlog/ → active/ → completed/
   ↓         ↓          ↓
 待办     进行中      已完成
```

当 agent 完成任务后：
1. 更新任务文档中的状态为 "已完成"
2. 将文件从 `active/` 移动到 `completed/`
3. 更新 `01-tasks/STATUS.md`

## 🚀 快速开始

### 第一次使用

1. **启动主会话**（在 moxton-docs）
   ```bash
   cd E:\moxton-docs
   claude-code .
   ```

2. **创建或查看任务**
   - 查看 `01-tasks/STATUS.md`
   - 或创建新任务

3. **分配给 agent**
   ```
   @FRONTEND 请实现 FRONTEND-001 任务
   ```

4. **Agent 自动开始**
   - Agent 会读取任务文档
   - 切换到对应项目目录
   - 开始实现

### 日常使用

```
# 查看任务状态
/status

# 分配新任务
@FRONTEND 开始 FRONTEND-002

# 查看所有活跃任务
/tasks active
```

## 🎨 最佳实践

1. **任务文档规范**
   - 使用统一的模板
   - 包含清晰的验收标准
   - 指定项目代码（FRONTEND/BACKEND/ADMIN）

2. **命名规范**
   - `FRONTEND-001-feature-name.md`
   - `BACKEND-002-api-endpoint.md`
   - `ADMIN-003-page-optimization.md`

3. **状态同步**
   - Agent 完成后自动更新状态
   - 定期检查 `01-tasks/STATUS.md`

4. **文档优先**
   - 先更新文档，再触发 agent
   - Agent 从文档读取任务详情
   - 完成后更新文档

## 🔍 故障排查

### Agent 没有响应

1. 检查任务文档是否在 `01-tasks/active/`
2. 确认文件名格式正确（FRONTEND-001-xxx.md）
3. 确认项目中 @MENTION 正确

### Agent 找不到任务

1. 确认 CLAUDE.md 中有文档仓库路径
2. 检查路径是否正确（`E:\moxton-docs`）
3. 尝试使用完整路径触发

## 📝 总结

这个系统的核心思想是：

1. **文档驱动** - 一切从文档开始
2. **自动分配** - 根据任务代码自动找对应的 agent
3. **状态追踪** - 集中的任务状态管理
4. **跨项目协调** - 从一个地方管理三个项目

通过这种方式，你可以：
- 在 moxton-docs 统一管理所有任务
- 通过 @提及 或命令自动分配工作
- 让 agent 自动开始执行
- 追踪所有任务的进度
