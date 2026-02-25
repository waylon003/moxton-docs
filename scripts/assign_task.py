#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
任务自动分配脚本

用法:
    python assign_task.py FRONTEND-001
    python assign_task.py --list
    python assign_task.py --scan
"""

import os
import sys
import re
from pathlib import Path

# Windows 控制台编码设置
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 配置
MOXTON_DOCS = Path(r"E:\moxton-docs")
TASKS_DIR = MOXTON_DOCS / "01-tasks"
ACTIVE_DIR = TASKS_DIR / "active"

# 项目映射
PROJECT_MAP = {
    "FRONTEND": {
        "name": "nuxt-moxton",
        "path": Path(r"E:\nuxt-moxton"),
        "agent": "oh-my-claudecode:executor"
    },
    "BACKEND": {
        "name": "moxton-lotapi",
        "path": Path(r"E:\moxton-lotapi"),
        "agent": "oh-my-claudecode:executor"
    },
    "ADMIN": {
        "name": "moxton-lotadmin",
        "path": Path(r"E:\moxton-lotadmin"),
        "agent": "oh-my-claudecode:executor"
    },
}


def list_active_tasks():
    """列出所有活跃任务"""
    print(f"\n[LIST] Active Tasks in {ACTIVE_DIR}:")
    print("-" * 60)

    tasks = sorted(ACTIVE_DIR.glob("*.md"))
    if not tasks:
        print("  (No active tasks)")
        return []

    task_list = []
    for task_file in tasks:
        # 解析任务信息
        match = re.match(r"^(FRONTEND|BACKEND|ADMIN|SHARED)-(\d+)-(.+)\.md$", task_file.name)
        if match:
            project, number, title = match.groups()
            task_list.append({
                "file": task_file,
                "project": project,
                "number": number,
                "title": title,
                "id": f"{project}-{number}"
            })

    for task in task_list:
        print(f"  [{task['id']}] {task['title']}")
        print(f"    Project: {task['project']} | File: {task['file'].name}")

    return task_list


def scan_tasks():
    """扫描并建议任务分配"""
    print("\n[SCAN] Scanning active tasks...\n")

    tasks = list_active_tasks()
    if not tasks:
        return

    print("\n[SUGGEST] Recommended assignments:")
    print("-" * 60)

    suggestions = {}
    for task in tasks:
        project = task["project"]
        if project not in suggestions:
            suggestions[project] = []
        suggestions[project].append(task)

    for project, project_tasks in suggestions.items():
        if project in PROJECT_MAP:
            info = PROJECT_MAP[project]
            print(f"\n[AGENT] {project} Agent -> {info['name']}")
            print(f"   Work Dir: {info['path']}")
            print(f"   Pending Tasks:")
            for task in project_tasks:
                print(f"     - {task['id']}: {task['title']}")


def assign_task(task_id):
    """分配任务给对应的 agent"""
    print(f"\n[ASSIGN] Assigning task: {task_id}")
    print("-" * 60)

    # 查找任务文件
    match = re.match(r"^(FRONTEND|BACKEND|ADMIN|SHARED)-(\d+)", task_id)
    if not match:
        print(f"[ERROR] Invalid task ID format: {task_id}")
        print("        Correct format: FRONTEND-001, BACKEND-002, ADMIN-003")
        return False

    project = match.group(1)
    number = match.group(2)

    # 查找任务文件
    task_files = list(ACTIVE_DIR.glob(f"{project}-{number}-*.md"))
    if not task_files:
        print(f"[ERROR] Task not found: {task_id}")
        print(f"        Search path: {ACTIVE_DIR}")
        return False

    task_file = task_files[0]
    print(f"[OK] Found task file: {task_file.name}")

    # 检查项目映射
    if project not in PROJECT_MAP:
        print(f"[ERROR] Unknown project type: {project}")
        return False

    project_info = PROJECT_MAP[project]
    print(f"\n[INFO] Task Details:")
    print(f"   Project: {project}")
    print(f"   Target: {project_info['name']}")
    print(f"   Work Dir: {project_info['path']}")
    print(f"   Agent: {project_info['agent']}")

    # 读取任务内容
    try:
        content = task_file.read_text(encoding="utf-8")
        print(f"\n[PREVIEW] Task content:")
        print("   " + "-" * 56)
        # 显示前 10 行
        lines = content.split("\n")[:10]
        for line in lines:
            print(f"   {line}")
        if len(content.split("\n")) > 10:
            print("   ...")
        print("   " + "-" * 56)
    except Exception as e:
        print(f"[ERROR] Failed to read task file: {e}")
        return False

    # 生成分配指令
    print(f"\n[CMD] Assignment command:")
    print(f"   Execute in Claude Code:")
    print(f"   ")
    print(f"   Task(")
    print(f"     subagent_type='{project_info['agent']}',")
    print(f"     prompt='Read and implement the task at:\\n\\n{task_file}\\n\\nSee file for details.',")
    print(f"     model='sonnet'")
    print(f"   )")
    print(f"   ")
    print(f"   Or simply say:")
    print(f"   '@{project} please implement {task_id}'")

    return True


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python assign_task.py --list           # List all active tasks")
        print("  python assign_task.py --scan           # Scan and suggest assignments")
        print("  python assign_task.py FRONTEND-001     # Assign specific task")
        return

    command = sys.argv[1]

    if command == "--list":
        list_active_tasks()
    elif command == "--scan":
        scan_tasks()
    else:
        assign_task(command)


if __name__ == "__main__":
    main()
