# Codex CLI Agent Teams Migration

This document defines the Codex-first workflow that replaces Claude-specific Agent Teams hooks.

## Goal

Reproduce the same operating model in `codex-cli`:
- one Team Lead coordinator in `E:\moxton-docs`
- parallel developer agents by role
- role-specific QA verification
- role-to-role communication relayed by Team Lead
- docs-driven task lifecycle
- Team Lead is coordination-only (no direct code implementation)
- Team Lead may inspect all code repos in read-only mode for coordination decisions

## Key Files

- Team prompts: `.codex/agents/`
- Relay protocol: `.codex/agents/protocol.md`
- Doc updater role: `.codex/agents/doc-updater.md`
- QA stack baseline: `03-guides/qa-tooling-stack.md`
- Task scanner and dispatcher: `scripts/assign_task.py`
- Active tasks: `01-tasks/active/{shop-frontend|admin-frontend|backend}/`
- Task-level lock file: `01-tasks/TASK-LOCKS.json`

## Quick Start (Codex)

1. Open codex-cli in `E:\moxton-docs`.
2. Set runner lock to codex:
   - `python scripts/assign_task.py --lock codex`
3. (Optional) Split one requirement into template-based role tasks:
   - `python scripts/assign_task.py --split-request "<requirement text>"`
4. Lock tasks before dispatch:
   - `python scripts/assign_task.py --lock-task <TASK-ID> --task-owner team-lead`
   - (optional cleanup) `python scripts/assign_task.py --reap-stale-locks --task-lock-ttl-hours 24`
5. Scan active tasks:
   - `python scripts/assign_task.py --scan`
5.1 Run one-shot readiness checks:
   - `python scripts/assign_task.py --doctor`
6. Generate team brief:
   - `python scripts/assign_task.py --write-brief`
7. Ask Codex Team Lead to run parallel execution using the brief:
   - `04-projects/CODEX-TEAM-BRIEF.md`
8. Require native Multi-agents orchestration and route envelopes for inter-agent messages.

## Single Task Dispatch

- Codex style:
  - `python scripts/assign_task.py SHOP-FE-001 --provider codex`
- Claude compatibility (legacy):
  - `python scripts/assign_task.py SHOP-FE-001 --provider claude`

## Team Bootstrap Prompt

Print a ready-to-paste bootstrap prompt for codex-cli:

```bash
python scripts/assign_task.py --team-prompt
```

## Migration Notes

- `.claude/hooks/agent-teams-runner.js` remains as legacy compatibility.
- New default orchestration entrypoint is `scripts/assign_task.py` with `--team-prompt` or `--write-brief`.
- Shared lock file `01-tasks/ACTIVE-RUNNER.md` is read by both codex and claude flows.
- Task naming now follows role prefixes:
  - `SHOP-FE-*`
  - `ADMIN-FE-*`
  - `BACKEND-*`
  - `BUG-*` (backend folder)
