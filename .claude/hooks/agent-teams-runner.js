#!/usr/bin/env node

/**
 * Agent Teams 并行开发执行器
 *
 * 当用户确认执行开发时，自动创建 Agent Team 并分配任务给三个项目
 */

const fs = require('fs');
const path = require('path');

/**
 * 读取 Agent 提示词文件
 */
function readAgentPrompt(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8');
    }
  } catch (error) {
    // 文件读取失败，返回 null
  }
  return null;
}

/**
 * 扫描 01-tasks/active/ 下的任务
 */
function scanTasks(cwd) {
  const roles = {
    'SHOP-FE': {
      dir: path.join(cwd, '01-tasks', 'active', 'shop-frontend'),
      workDir: 'E:\\nuxt-moxton',
      name: 'shop-fe',
      agentType: 'general-purpose',
      systemPrompt: readAgentPrompt(path.join(cwd, '.claude', 'agents', 'shop-frontend.md')),
      qaName: 'shop-fe-qa',
      qaWorkDir: 'E:\\nuxt-moxton',
      qaPrompt: readAgentPrompt(path.join(cwd, '.claude', 'agents', 'shop-fe-qa.md'))
    },
    'ADMIN-FE': {
      dir: path.join(cwd, '01-tasks', 'active', 'admin-frontend'),
      workDir: 'E:\\moxton-lotadmin',
      name: 'admin-fe',
      agentType: 'general-purpose',
      systemPrompt: readAgentPrompt(path.join(cwd, '.claude', 'agents', 'admin-frontend.md')),
      qaName: 'admin-fe-qa',
      qaWorkDir: 'E:\\moxton-lotadmin',
      qaPrompt: readAgentPrompt(path.join(cwd, '.claude', 'agents', 'admin-fe-qa.md'))
    },
    'BACKEND': {
      dir: path.join(cwd, '01-tasks', 'active', 'backend'),
      workDir: 'E:\\moxton-lotapi',
      name: 'backend',
      agentType: 'general-purpose',
      systemPrompt: readAgentPrompt(path.join(cwd, '.claude', 'agents', 'backend.md')),
      qaName: 'backend-qa',
      qaWorkDir: 'E:\\moxton-lotapi',
      qaPrompt: readAgentPrompt(path.join(cwd, '.claude', 'agents', 'backend-qa.md'))
    }
  };

  const tasksByRole = {};

  for (const [roleCode, config] of Object.entries(roles)) {
    try {
      if (fs.existsSync(config.dir)) {
        const files = fs.readdirSync(config.dir);
        const taskFiles = files.filter(f => f.endsWith('.md') && f.startsWith(roleCode));

        if (taskFiles.length > 0) {
          tasksByRole[roleCode] = {
            ...config,
            tasks: taskFiles.map(f => ({
              file: f,
              path: path.join(config.dir, f)
            }))
          };
        }
      }
    } catch (error) {
      // 目录不存在或为空，跳过
    }
  }

  return tasksByRole;
}

/**
 * 生成团队创建指令
 */
function generateTeamInstruction(tasksByRole, cwd) {
  const roles = Object.keys(tasksByRole);
  const totalMembers = roles.length * 2; // 每个角色 1 个开发 + 1 个 QA
  const teamLeadPrompt = readAgentPrompt(path.join(cwd, '.claude', 'agents', 'team-lead.md'));

  let instruction = `请创建一个名为 "moxton-development" 的 Agent Team。\n\n`;

  instruction += `## Team Lead（你）\n`;
  instruction += `- 工作目录: ${cwd}\n`;
  instruction += `- 系统提示词: .claude/agents/team-lead.md\n`;
  instruction += `- 职责: 协调团队、分配任务、监督进度，**不直接编写代码**\n\n`;

  instruction += `## 队友 (${totalMembers} 个)\n\n`;

  for (const [roleCode, config] of Object.entries(tasksByRole)) {
    const taskList = config.tasks.map(t => t.file).join(', ');

    // 开发工程师
    instruction += `### ${config.name} (${roleCode}) - 开发\n`;
    instruction += `- 工作目录: ${config.workDir}\n`;
    instruction += `- 任务: ${taskList}\n`;
    instruction += `- 系统提示词: .claude/agents/${roleCode.toLowerCase().replace('-', '-')}.md\n`;
    instruction += `- 职责: 阅读 ${config.workDir}/CLAUDE.md 了解项目规范\n\n`;

    // QA 测试工程师
    instruction += `### ${config.qaName} (${roleCode}) - 测试\n`;
    instruction += `- 工作目录: ${config.qaWorkDir}\n`;
    instruction += `- 任务: 测试 ${config.name} 完成的功能\n`;
    instruction += `- 系统提示词: .claude/agents/${config.qaName}.md\n`;
    instruction += `- 职责: 使用 MCP 工具测试功能，检查接口和错误\n\n`;
  }

  instruction += `### Team Lead 工作流程\n`;
  instruction += `1. 你作为 Team Lead，**不要直接修改代码文件**\n`;
  instruction += `2. 分析任务，将任务文档分配给对应的开发队友\n`;
  instruction += `3. 开发队友完成后，分配给对应的 QA 队友测试\n`;
  instruction += `4. 使用 "@队友-名 请执行任务：{任务路径}" 的格式分配\n`;
  instruction += `5. QA 测试通过后，标记任务完成\n\n`;

  instruction += `### 测试验收流程\n`;
  instruction += `开发队友完成 → QA 队友测试 → 汇报结果 → Team Lead 确认\n\n`;

  instruction += `### 重要提醒\n`;
  instruction += `- 你的工作目录是 ${cwd}，**不要切换到项目目录**\n`;
  instruction += `- 你是指挥官，不是士兵！让队友去执行开发和测试\n`;
  instruction += `- 只负责协调、分配、审查，不负责写代码或测试\n`;

  return instruction;
}

// 主逻辑：从 stdin 读取 JSON 输入
let inputData = '';

process.stdin.on('data', (chunk) => {
  inputData += chunk;
});

process.stdin.on('end', () => {
  try {
    const input = JSON.parse(inputData);

    // 检查是否在 moxton-docs 目录下
    const cwd = input.cwd || '';
    if (!cwd.includes('moxton-docs')) {
      process.exit(0);
    }

    // 获取用户消息
    const userMessage = (input.prompt || '').toLowerCase();

    // 检测执行意图的关键词（更精确，避免误触发）
    const executeKeywords = [
      '开始执行', '开始开发', '执行开发',
      'execute', 'start', 'implement',
      '创建团队', 'agent team', '并行开发',
      '创建agent team', '创建agent', 'team'
    ];

    const shouldExecute = executeKeywords.some(keyword =>
      userMessage.includes(keyword)
    );

    if (!shouldExecute) {
      process.exit(0);
    }

    // 扫描任务
    const tasksByRole = scanTasks(cwd);

    if (Object.keys(tasksByRole).length === 0) {
      const output = {
        message: '⚠️ 没有找到可执行的任务',
        suggestion: '请在 01-tasks/active/ 下的角色目录中创建任务文档'
      };
      console.log(JSON.stringify(output));
      process.exit(0);
    }

    // 返回团队创建指令
    const instruction = generateTeamInstruction(tasksByRole, cwd);
    const taskSummary = Object.entries(tasksByRole).map(([role, config]) =>
      `${role}: ${config.tasks.map(t => t.file).join(', ')}`
    ).join('\n');

    // 使用正确的 UserPromptSubmit JSON 格式
    const output = {
      hookSpecificOutput: {
        "hookEventName": "UserPromptSubmit",
        "additionalContext": `🚀 检测到开发执行意图，准备创建 Agent Team\n\n## 发现的任务\n${taskSummary}\n\n## 团队创建指令\n${instruction}`
      }
    };

    // 输出 JSON 格式
    console.log(JSON.stringify(output));
    process.exit(0);

  } catch (error) {
    // 错误时静默退出，避免干扰正常使用
    // console.error('Hook error:', error.message);
    process.exit(0);
  }
});
