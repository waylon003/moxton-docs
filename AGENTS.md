# Repository Guidelines

## Startup Identity
When running in `E:\moxton-docs`, Codex must act as **Team Lead** by default.
Team Lead coordinates and delegates; downstream roles implement code.
Team Lead uses only two modes: `Execution` (existing active tasks) or `Planning` (new requirement split).

## Project Structure & Module Organization
This repository is a documentation and task-coordination hub for three codebases. Source code is not stored here.
- `01-tasks/`: Work items organized by status (`backlog/`, `active/`, `completed/`) and by role (`shop-frontend`, `admin-frontend`, `backend`).
- `02-api/`: Backend API documentation (module specs such as auth, cart, orders).
- `03-guides/`: Integration guides (for example Stripe Elements).
- `04-projects/`: Coordination notes for each codebase (`nuxt-moxton`, `moxton-lotadmin`, `moxton-lotapi`).
- `05-verification/`: QA and verification reports.
- `.claude/agents/` and `.claude/skills/`: legacy Claude prompts and templates.
- `.codex/agents/`: Codex role prompts for Team Lead/developer/QA orchestration.
- `.codex/agents/protocol.md`: Team Lead relay protocol for inter-agent messaging.
- `.codex/agents/doc-updater.md`: API documentation updater role.
- `03-guides/qa-tooling-stack.md`: default QA stack and command baselines for each role.

The actual code lives outside this repo:
- `E:\nuxt-moxton`
- `E:\moxton-lotadmin`
- `E:\moxton-lotapi`

## Build, Test, and Development Commands
There is no build system in this repository. Maintenance commands are task/documentation oriented:
```bash
python scripts/assign_task.py --list          # list active tasks
python scripts/assign_task.py --standard-entry   # show Team Lead standard mode
python scripts/assign_task.py --scan          # scan active tasks by role
python scripts/assign_task.py --show-lock     # show active runner lock
python scripts/assign_task.py --lock codex    # lock workflow to codex
python scripts/assign_task.py --lock claude   # lock workflow to claude
python scripts/assign_task.py --show-task-locks   # show task-level locks
python scripts/assign_task.py --lock-task SHOP-FE-001 --task-owner team-lead
python scripts/assign_task.py --unlock-task SHOP-FE-001
python scripts/assign_task.py --show-task-locks --task-lock-ttl-hours 24
python scripts/assign_task.py --reap-stale-locks --task-lock-ttl-hours 24
python scripts/assign_task.py --doctor
powershell -ExecutionPolicy Bypass -File scripts/enable_utf8_session.ps1
powershell -ExecutionPolicy Bypass -File scripts/utf8_doctor.ps1
python scripts/assign_task.py --split-request "<requirement text>"  # auto split by templates
python scripts/assign_task.py --intake "<natural language request>" # auto planning/execution intent
python scripts/assign_task.py --team-prompt   # print codex bootstrap prompt
python scripts/assign_task.py --write-brief   # generate 04-projects/CODEX-TEAM-BRIEF.md
.\teamlead.cmd 请编写订单支付状态查询接口     # natural-language Team Lead entry
codex mcp list                                # check MCP tool servers (playwright/vitest)
cat 01-tasks/STATUS.md                        # view status summary
```

## Coding Style & Naming Conventions
This repository is Markdown-first. Keep edits concise and consistent with existing docs.
- Task files use `ROLE-NNN-short-slug.md`, for example:
  - `SHOP-FE-001-stripe-elements-integration.md`
  - `ADMIN-FE-003-order-history-ui.md`
  - `BACKEND-005-keyword-search-fix.md`
- Keep `01-tasks/STATUS.md` in sync with task file moves between `backlog/`, `active/`, and `completed/`.

## Testing Guidelines
No automated tests run in this repository.
- Validation is documentation-based.
- Update `05-verification/` reports when QA/testing is performed in the code repositories.

## Commit & Pull Request Guidelines
If this directory is mirrored into Git:
- Use clear imperative commits with task IDs, for example `BACKEND-003: update Stripe API guide`.
- PRs should reference the related task file, summarize doc changes, and note required updates to `01-tasks/STATUS.md`.

## Agent Workflow Notes
Task assignment is agent-driven. Standard workflow:
1. Create or update a task file under `01-tasks/`.
2. Set active runner lock before execution:
   - `python scripts/assign_task.py --lock codex`
   - `python scripts/assign_task.py --lock claude`
3. Lock each task before assigning it to downstream agents:
   - `python scripts/assign_task.py --lock-task <TASK-ID> --task-owner team-lead`
4. In codex-cli, generate and execute the team brief:
   - `python scripts/assign_task.py --write-brief`
   - follow `04-projects/CODEX-TEAM-BRIEF.md`
5. After user confirmation, move task files to `completed/` and update `01-tasks/STATUS.md`.

Template split option:
- Team Lead can split one high-level requirement into role task files using templates:
  - `python scripts/assign_task.py --split-request "<requirement text>"`
