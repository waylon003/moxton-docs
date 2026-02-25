# Moxton 文档指挥中心

本仓库是三个代码仓的共享知识库与任务编排中心，不存放业务源码。

- `E:\nuxt-moxton`（SHOP-FE）
- `E:\moxton-lotadmin`（ADMIN-FE）
- `E:\moxton-lotapi`（BACKEND）

内容覆盖：任务拆分、Team Lead 编排、API 文档、集成指南、验收记录。

## Team Lead 规则

在 `E:\moxton-docs` 启动 Codex 时，默认身份必须是 **Team Lead**。

只允许两种模式：

1. `Execution`：`01-tasks/active/*` 有未完成任务，进入建队与执行。
2. `Planning`：无活跃任务，先讨论需求，再按模板拆分任务。

Team Lead 只负责分派、监控、协调；下游角色负责具体开发实现。

## 目录结构

- `01-tasks/` 任务系统（`backlog/`、`active/`、`completed/`、模板、锁）
- `02-api/` 后端 API 文档
- `03-guides/` 集成与 QA 指南
- `04-projects/` 三仓协同文档
- `05-verification/` 验收报告
- `.codex/agents/` Codex 角色提示词与中继协议
- `.claude/` Claude 兼容资产（保留）
- `scripts/assign_task.py` 编排入口（拆分、锁、doctor、brief）

## 快速开始

在 `E:\moxton-docs` 执行：

```bash
python scripts/assign_task.py --standard-entry
python scripts/assign_task.py --doctor
python scripts/assign_task.py --show-lock
```

规划态（拆分需求）：

```bash
python scripts/assign_task.py --split-request "<需求文本>"
```

执行态（建队入口）：

```bash
python scripts/assign_task.py --scan
python scripts/assign_task.py --write-brief
```

## 锁机制

为避免双机制误触发，使用两层锁：

1. 执行器锁：`01-tasks/ACTIVE-RUNNER.md`
2. 任务级锁：`01-tasks/TASK-LOCKS.json`

常用命令：

```bash
python scripts/assign_task.py --lock codex
python scripts/assign_task.py --lock-task <TASK-ID> --task-owner team-lead
python scripts/assign_task.py --show-task-locks --task-lock-ttl-hours 24
python scripts/assign_task.py --reap-stale-locks --task-lock-ttl-hours 24
```

## 多代理编排

核心文件：

- `.codex/agents/team-lead.md`
- `.codex/agents/protocol.md`
- `04-projects/CODEX-TEAM-BRIEF.md`

执行流程：

1. Team Lead 创建/更新任务文件。
2. Team Lead 并行分派各角色 dev/qa 子代理。
3. 跨角色消息通过 Team Lead 中继（`[ROUTE]` 协议）。
4. QA 回传 PASS/FAIL 与证据。
5. Team Lead 征得用户确认后再移动到 `completed/`。

## QA 基线

详见 `03-guides/qa-tooling-stack.md`。

- SHOP-FE / ADMIN-FE：Playwright（`test:e2e`）
- BACKEND：Vitest + API 测试（`test:api`）

MCP 预检：

```bash
codex mcp list
```

期望至少包含 `playwright` 与 `vitest`。

## Windows 编码保护（建议）

为避免 PowerShell 中文乱码，建议每次会话执行：

```bash
powershell -ExecutionPolicy Bypass -File scripts/enable_utf8_session.ps1
powershell -ExecutionPolicy Bypass -File scripts/utf8_doctor.ps1
```

## 相关文档

- `AGENTS.md` 仓库工作规则
- `CODEX.md` Codex Team Lead 上下文
- `QUICKSTART.md` 命令速查
- `01-tasks/STATUS.md` 任务总览
- `04-projects/CODEX-AGENT-TEAMS.md` 迁移说明
