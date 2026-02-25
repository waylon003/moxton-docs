# 快速开始（Codex / Claude 双机制）

本仓库是三个代码仓的共享任务中台：
- `E:\nuxt-moxton`
- `E:\moxton-lotadmin`
- `E:\moxton-lotapi`

## 1) 进入文档仓

```bash
cd E:\moxton-docs
```

## 2) 查看当前执行器锁（强烈建议先做）

```bash
python scripts/assign_task.py --show-lock
```

## 2.0) 自然语言入口（推荐）

```bash
.\teamlead.cmd 请编写订单支付状态查询接口
.\teamlead.cmd -Doctor 请开始创建团队执行当前任务
```

说明：
- `teamlead.cmd` 会以 `NoProfile` 启动 PowerShell，再调用 `scripts/team_lead_start.ps1`。
- 有活跃任务时自动进入 `Execution`；无活跃任务时自动进入 `Planning` 并模板拆分。

## 2.1) 查看 Team Lead 标准模式（执行态 / 规划态）

```bash
python scripts/assign_task.py --standard-entry
```

## 2.2) 一键自检（建议每次会话先执行）

```bash
python scripts/assign_task.py --doctor
```

自检会检查：
- runner lock / task lock / 过期锁
- 模板与角色提示词是否缺失
- 三个代码仓路径与 QA 脚本是否就绪
- Codex MCP 配置（playwright/vitest）是否存在

## 2.3) UTF-8 session guard (recommended)

```bash
powershell -ExecutionPolicy Bypass -File scripts/enable_utf8_session.ps1
powershell -ExecutionPolicy Bypass -File scripts/utf8_doctor.ps1
```

If the doctor reports warnings, keep using explicit UTF-8 for file writes in PowerShell commands.

## 3) 选择本次执行器（避免双机制误触发）

Codex:
```bash
python scripts/assign_task.py --lock codex
```

Claude:
```bash
python scripts/assign_task.py --lock claude
```

解锁（不建议长期使用）：
```bash
python scripts/assign_task.py --lock none
```

## 4) 扫描活跃任务

```bash
python scripts/assign_task.py --scan
```

## 5) 给即将执行的任务加任务级锁（强烈建议）

```bash
python scripts/assign_task.py --show-task-locks
python scripts/assign_task.py --lock-task SHOP-FE-001 --task-owner team-lead
```

任务完成后解锁：
```bash
python scripts/assign_task.py --unlock-task SHOP-FE-001
python scripts/assign_task.py --reap-stale-locks --task-lock-ttl-hours 24
```

## 6) Codex 多代理并行入口

```bash
python scripts/assign_task.py --write-brief
python scripts/assign_task.py --intake "请开始创建团队执行当前任务"
```

使用以下文件启动 Team Lead：
- `04-projects/CODEX-TEAM-BRIEF.md`
- `.codex/agents/team-lead.md`
- `.codex/agents/protocol.md`
- `.codex/agents/doc-updater.md`（后端 API 变更时触发）
- `03-guides/qa-tooling-stack.md`（QA 工具栈与命令基线）

建议在每次会话启动后先检查 MCP：
```bash
codex mcp list
```
期望至少有：
- `playwright`（`@playwright/mcp`）
- `vitest`（`@djankies/vitest-mcp`）

## 7) 单任务分派（要求该任务已被当前 runner 锁定）

Codex:
```bash
python scripts/assign_task.py SHOP-FE-001 --provider codex
```

Claude 兼容输出:
```bash
python scripts/assign_task.py SHOP-FE-001 --provider claude
```

## 8) 收口

1. QA 通过后先由 Team Lead 向你汇报。
2. 你确认后再移动任务文件到 `01-tasks/completed/`。
3. 更新 `01-tasks/STATUS.md`。

## 兼容说明

- `.claude/*` 保留可用。
- `.codex/*` 是当前默认主流程。
- `01-tasks/ACTIVE-RUNNER.md` 是共享执行器锁，两个机制都会读取。
- `01-tasks/TASK-LOCKS.json` 是任务级锁，未持锁任务不可分派。

## 可选：一条需求自动拆分为模板化任务

```bash
python scripts/assign_task.py --split-request "实现支付状态全链路：后端新增状态接口，admin 新增状态管理，shop 展示支付状态"
python scripts/assign_task.py --intake "请编写订单支付状态查询接口"
```

可指定角色：
```bash
python scripts/assign_task.py --split-request-file req.md --split-roles SHOP-FE,ADMIN-FE,BACKEND
```
