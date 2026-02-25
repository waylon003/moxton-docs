# 任务工作流（含执行器锁）

## 目标

在 `moxton-docs` 中以 Team Lead 方式协调多角色并行开发，并防止 Codex/Claude 双机制同时触发。

## 目录约定

- `01-tasks/backlog/`：待办
- `01-tasks/active/`：进行中
- `01-tasks/completed/`：已完成
- `01-tasks/ACTIVE-RUNNER.md`：执行器锁（codex / claude / none）
- `01-tasks/TASK-LOCKS.json`：任务级锁（每个任务唯一持有者）

## 角色映射

- `SHOP-FE` -> `E:\nuxt-moxton`
- `ADMIN-FE` -> `E:\moxton-lotadmin`
- `BACKEND` -> `E:\moxton-lotapi`
- `BUG-*` -> backend 处理

## 标准流程

### 模式 A：Execution（有 active 未完成任务）
- Team Lead 直接进入分派/监控/QA 闭环
- 向用户确认：是否现在开始创建团队执行这些任务

### 模式 B：Planning（无 active 未完成任务）
- Team Lead 先讨论需求并编写开发计划
- 再按模板拆分到角色目录
- 向用户确认：是否现在开始创建团队执行这些任务

1. 创建任务文件到 `01-tasks/active/<role-dir>/`
   - 或用模板自动拆分：
   - `python scripts/assign_task.py --split-request "<requirement text>"`
2. 查看当前锁：`python scripts/assign_task.py --show-lock`
3. 设置本次执行器：
   - Codex: `python scripts/assign_task.py --lock codex`
   - Claude: `python scripts/assign_task.py --lock claude`
4. 给目标任务加锁：
   - `python scripts/assign_task.py --lock-task <TASK-ID> --task-owner team-lead`
5. 扫描任务：`python scripts/assign_task.py --scan`
6. 启动对应机制：
   - Codex: `python scripts/assign_task.py --write-brief`
   - Claude: 走 `.claude/hooks/agent-teams-runner.js` 自动流程（仅当锁为 claude）
7. QA 通过后先征得用户确认，再移到 `completed/` 并更新 `01-tasks/STATUS.md`
8. 任务结束后释放锁：`python scripts/assign_task.py --unlock-task <TASK-ID>`

## 约束

- Team Lead 负责调度，不直接跨仓实现功能代码。
- 危险操作需审批。
- 若执行器锁不匹配，脚本或 hook 会拒绝触发。
- 若任务级锁缺失或锁归属不匹配，脚本会拒绝分派该任务。
