#!/usr/bin/env node

/**
 * Claude compatibility hook for Agent Teams.
 * Reads active tasks and generates Team Lead orchestration context.
 * Respects both runner lock and task-level locks.
 */

const fs = require('fs');
const path = require('path');

function readActiveRunner(cwd) {
  try {
    const lockPath = path.join(cwd, '01-tasks', 'ACTIVE-RUNNER.md');
    if (!fs.existsSync(lockPath)) return 'none';
    const text = fs.readFileSync(lockPath, 'utf-8');
    const match = text.match(/^\s*runner\s*:\s*(.+)\s*$/im);
    if (!match) return 'none';
    const runner = String(match[1] || '').trim().toLowerCase();
    if (runner === 'codex' || runner === 'claude' || runner === 'none') {
      return runner;
    }
  } catch (_error) {
    return 'none';
  }
  return 'none';
}

function readTaskLocks(cwd) {
  try {
    const filePath = path.join(cwd, '01-tasks', 'TASK-LOCKS.json');
    if (!fs.existsSync(filePath)) return {};
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const locks = raw && typeof raw === 'object' ? raw.locks : {};
    if (!locks || typeof locks !== 'object') return {};

    const normalized = {};
    for (const [taskId, entry] of Object.entries(locks)) {
      if (!entry || typeof entry !== 'object') continue;
      normalized[String(taskId).trim().toUpperCase()] = {
        runner: String(entry.runner || '').trim().toLowerCase(),
        owner: String(entry.owner || '').trim(),
        state: String(entry.state || '').trim().toLowerCase()
      };
    }
    return normalized;
  } catch (_error) {
    return {};
  }
}

function hasExecutionIntent(promptText) {
  const text = String(promptText || '').toLowerCase();
  const keywords = [
    '开始执行', '开始开发', '执行开发',
    'create team', 'agent team', 'parallel',
    'execute', 'start', 'implement', 'team'
  ];
  return keywords.some((k) => text.includes(k.toLowerCase()));
}

function taskIdFromFileName(name) {
  const base = String(name || '').replace(/\.md$/i, '');
  const match = base.match(/^([A-Z]+(?:-[A-Z]+)?-\d+)-/i);
  return match ? match[1].toUpperCase() : '';
}

function scanTasks(cwd, taskLocks) {
  const roles = {
    'SHOP-FE': {
      dir: path.join(cwd, '01-tasks', 'active', 'shop-frontend'),
      workDir: 'E:\\nuxt-moxton',
      devName: 'shop-fe',
      qaName: 'shop-fe-qa',
      devPrompt: '.claude/agents/shop-frontend.md',
      qaPrompt: '.claude/agents/shop-fe-qa.md',
      prefixes: ['SHOP-FE-']
    },
    'ADMIN-FE': {
      dir: path.join(cwd, '01-tasks', 'active', 'admin-frontend'),
      workDir: 'E:\\moxton-lotadmin',
      devName: 'admin-fe',
      qaName: 'admin-fe-qa',
      devPrompt: '.claude/agents/admin-frontend.md',
      qaPrompt: '.claude/agents/admin-fe-qa.md',
      prefixes: ['ADMIN-FE-']
    },
    'BACKEND': {
      dir: path.join(cwd, '01-tasks', 'active', 'backend'),
      workDir: 'E:\\moxton-lotapi',
      devName: 'backend',
      qaName: 'backend-qa',
      devPrompt: '.claude/agents/backend.md',
      qaPrompt: '.claude/agents/backend-qa.md',
      prefixes: ['BACKEND-', 'BUG-']
    }
  };

  const result = {};

  for (const [roleCode, cfg] of Object.entries(roles)) {
    try {
      if (!fs.existsSync(cfg.dir)) continue;
      const files = fs.readdirSync(cfg.dir)
        .filter((f) => f.endsWith('.md'))
        .filter((f) => cfg.prefixes.some((prefix) => f.startsWith(prefix)))
        .filter((f) => {
          const taskId = taskIdFromFileName(f);
          const lock = taskLocks[taskId];
          return !!(lock && lock.runner === 'claude');
        });
      if (files.length === 0) continue;

      result[roleCode] = {
        ...cfg,
        tasks: files.map((f) => ({
          file: f,
          path: path.join(cfg.dir, f)
        }))
      };
    } catch (_error) {
      // ignore role read errors
    }
  }

  return result;
}

function buildTeamInstruction(tasksByRole, cwd) {
  const lines = [];
  lines.push('Please create a Claude Agent Team for moxton development.');
  lines.push('');
  lines.push('Team Lead:');
  lines.push(`- workdir: ${cwd}`);
  lines.push('- prompt: .claude/agents/team-lead.md');
  lines.push('- do not code directly, coordinate only');
  lines.push('');
  lines.push('Members by role:');

  for (const [roleCode, cfg] of Object.entries(tasksByRole)) {
    const taskList = cfg.tasks.map((t) => t.file).join(', ');
    lines.push(`- ${roleCode}`);
    lines.push(`  - dev: ${cfg.devName}`);
    lines.push(`  - qa: ${cfg.qaName}`);
    lines.push(`  - repo: ${cfg.workDir}`);
    lines.push(`  - dev prompt: ${cfg.devPrompt}`);
    lines.push(`  - qa prompt: ${cfg.qaPrompt}`);
    lines.push(`  - tasks: ${taskList}`);
  }

  lines.push('');
  lines.push('Execution flow:');
  lines.push('1) Team Lead assigns tasks to role dev agent.');
  lines.push('2) Dev agent implements in target repo and reports back.');
  lines.push('3) Team Lead assigns QA verification.');
  lines.push('4) QA reports PASS/FAIL to Team Lead.');
  lines.push('5) Team Lead asks user before marking docs completed.');

  return lines.join('\n');
}

function toTaskSummary(tasksByRole) {
  return Object.entries(tasksByRole)
    .map(([role, cfg]) => `${role}: ${cfg.tasks.map((t) => t.file).join(', ')}`)
    .join('\n');
}

let inputData = '';
process.stdin.on('data', (chunk) => {
  inputData += chunk;
});

process.stdin.on('end', () => {
  try {
    const input = JSON.parse(inputData || '{}');
    const cwd = input.cwd || '';
    if (!String(cwd).includes('moxton-docs')) {
      process.exit(0);
    }

    const runner = readActiveRunner(cwd);
    if (runner !== 'none' && runner !== 'claude') {
      process.exit(0);
    }

    if (!hasExecutionIntent(input.prompt || '')) {
      process.exit(0);
    }

    const taskLocks = readTaskLocks(cwd);
    const tasksByRole = scanTasks(cwd, taskLocks);
    if (Object.keys(tasksByRole).length === 0) {
      const output = {
        hookSpecificOutput: {
          hookEventName: 'UserPromptSubmit',
          additionalContext:
            'No active task locked for runner=claude in 01-tasks/TASK-LOCKS.json.'
        }
      };
      console.log(JSON.stringify(output));
      process.exit(0);
    }

    const summary = toTaskSummary(tasksByRole);
    const instruction = buildTeamInstruction(tasksByRole, cwd);

    const output = {
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext:
          `Detected execution intent for Claude Agent Teams.\n\n` +
          `Active locked tasks:\n${summary}\n\n` +
          `Team instruction:\n${instruction}`
      }
    };

    console.log(JSON.stringify(output));
    process.exit(0);
  } catch (_error) {
    process.exit(0);
  }
});
