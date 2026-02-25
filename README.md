# Moxton Docs Command Center

This repository is the shared documentation and orchestration hub for three codebases:

- `E:\nuxt-moxton` (SHOP-FE)
- `E:\moxton-lotadmin` (ADMIN-FE)
- `E:\moxton-lotapi` (BACKEND)

It does not contain product source code. It contains task planning, team orchestration docs, API docs, guides, and verification reports.

## Team Lead Rule

When Codex runs in `E:\moxton-docs`, it must act as **Team Lead** by default.

Only two modes are valid:

1. `Execution` mode: there are active tasks in `01-tasks/active/*`.
2. `Planning` mode: no active tasks, then split new requirements into template tasks.

Team Lead coordinates and delegates. Downstream role agents implement code.

## Repository Structure

- `01-tasks/` task system (`backlog/`, `active/`, `completed/`, templates, locks)
- `02-api/` backend API docs
- `03-guides/` integration and QA guides
- `04-projects/` cross-repo coordination docs
- `05-verification/` QA verification reports
- `.codex/agents/` Codex role prompts and protocol
- `.claude/` legacy Claude workflow assets
- `scripts/assign_task.py` task split, lock, dispatch, doctor

## Quick Start

Run from `E:\moxton-docs`:

```bash
python scripts/assign_task.py --standard-entry
python scripts/assign_task.py --doctor
python scripts/assign_task.py --show-lock
```

If planning is needed:

```bash
python scripts/assign_task.py --split-request "<requirement text>"
```

If execution is needed:

```bash
python scripts/assign_task.py --scan
python scripts/assign_task.py --write-brief
```

## Locking Model

Two lock layers are used to avoid dual-runner conflicts:

1. Runner lock: `01-tasks/ACTIVE-RUNNER.md`
2. Task lock: `01-tasks/TASK-LOCKS.json`

Common commands:

```bash
python scripts/assign_task.py --lock codex
python scripts/assign_task.py --lock-task <TASK-ID> --task-owner team-lead
python scripts/assign_task.py --show-task-locks --task-lock-ttl-hours 24
python scripts/assign_task.py --reap-stale-locks --task-lock-ttl-hours 24
```

## Multi-Agent Orchestration

Use:

- `.codex/agents/team-lead.md`
- `.codex/agents/protocol.md`
- `04-projects/CODEX-TEAM-BRIEF.md`

Flow:

1. Team Lead creates/updates task files.
2. Team Lead dispatches role dev/qa agents in parallel.
3. Cross-agent communication is relayed by Team Lead using route envelopes.
4. QA returns PASS/FAIL evidence.
5. Team Lead asks user before moving tasks to `completed/`.

## QA Baseline

See `03-guides/qa-tooling-stack.md`.

- SHOP-FE / ADMIN-FE: Playwright-based QA (`test:e2e`)
- BACKEND: Vitest + API tests (`test:api`)

MCP preflight:

```bash
codex mcp list
```

Expected servers include `playwright` and `vitest`.

## UTF-8 Session Guard

If you use PowerShell on Windows, run:

```bash
powershell -ExecutionPolicy Bypass -File scripts/enable_utf8_session.ps1
powershell -ExecutionPolicy Bypass -File scripts/utf8_doctor.ps1
```

This prevents console/pipeline encoding issues that can produce mojibake.

## Related Docs

- `AGENTS.md` repository operating rules
- `CODEX.md` Codex Team Lead runtime context
- `QUICKSTART.md` practical command walk-through
- `01-tasks/STATUS.md` task status summary
- `04-projects/CODEX-AGENT-TEAMS.md` migration notes
