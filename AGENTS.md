# Repository Guidelines

## Project Structure & Module Organization
This repository is a documentation and task‑coordination hub for three codebases. Source code is not stored here.
- `01-tasks/`: Work items organized by status (`backlog/`, `active/`, `completed/`) and by role (shop frontend, admin frontend, backend).
- `02-api/`: Backend API documentation (module specs such as auth, cart, orders).
- `03-guides/`: Integration guides (e.g., Stripe Elements).
- `04-projects/`: Coordination notes for each codebase (`nuxt-moxton`, `moxton-lotadmin`, `moxton-lotapi`).
- `05-verification/`: QA and verification reports.
- `.claude/agents/` and `.claude/skills/`: agent prompts and task templates.

The actual code lives outside this repo (e.g., `E:\nuxt-moxton`, `E:\moxton-lotadmin`, `E:\moxton-lotapi`).

## Build, Test, and Development Commands
There is no build system in this repo. Typical maintenance commands focus on task automation:
```bash
python scripts/assign_task.py --list   # list active tasks
python scripts/assign_task.py --scan   # scan tasks and suggest assignments
cat 01-tasks/STATUS.md                 # view task status summary
```

## Coding Style & Naming Conventions
This repo is Markdown‑first. Keep edits concise and consistent with existing docs.
- Task files use `ROLE-NNN-short-slug.md` (e.g., `FRONTEND-007-checkout-address-integration.md`).
- Keep task status in `01-tasks/STATUS.md` in sync with file moves between `backlog/`, `active/`, and `completed/`.

## Testing Guidelines
No automated tests run in this repository. Validation is documentation‑based:
- Update `05-verification/` reports when QA/testing is performed in the code repositories.

## Commit & Pull Request Guidelines
This directory is not a Git repository (no `.git` history to reference). If this repo is mirrored into Git:
- Use clear, imperative commits and include task IDs (e.g., `BACKEND-003: update Stripe API guide`).
- PRs should reference the related task file, summarize doc changes, and note any required updates to `01-tasks/STATUS.md`.

## Agent Workflow Notes
Task assignment is agent‑driven. Standard workflow:
1. Create/update a task file under `01-tasks/`.
2. Assign it via an @mention or `/assign`.
3. Move the task file to `completed/` and update `01-tasks/STATUS.md` when done.
