#!/bin/bash
# 任务分配演示脚本

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Moxton 任务分配系统演示 ===${NC}\n"

# 1. 显示当前活跃任务
echo -e "${YELLOW}📋 当前活跃任务:${NC}"
cd "E:/moxton-docs/01-tasks/active"
ls -1 *.md 2>/dev/null | while read file; do
    echo "  - $file"
done

echo ""

# 2. 提示用户如何分配任务
echo -e "${GREEN}🚀 如何分配任务:${NC}"
echo ""
echo "方式 1: 使用 @提及"
echo "  @FRONTEND 请实现 FRONTEND-001 任务"
echo "  @BACKEND 请实现 BACKEND-002 任务"
echo "  @ADMIN 请实现 ADMIN-003 任务"
echo ""
echo "方式 2: 使用 /assign 命令"
echo "  /assign FRONTEND-001"
echo "  /assign BACKEND-002"
echo "  /assign ADMIN-003"
echo ""

# 3. 显示 agent 映射
echo -e "${YELLOW}🤖 Agent 映射:${NC}"
echo "  FRONTEND → nuxt-moxton (E:\\nuxt-moxton)"
echo "  BACKEND  → moxton-lotapi (E:\\moxton-lotapi)"
echo "  ADMIN    → moxton-lotadmin (E:\\moxton-lotadmin)"
echo ""

# 4. 显示任务状态
echo -e "${YELLOW}📊 任务状态统计:${NC}"
cd "E:/moxton-docs/01-tasks"
active_count=$(ls -1 active/*.md 2>/dev/null | wc -l)
completed_count=$(ls -1 completed/*.md 2>/dev/null | wc -l)
backlog_count=$(ls -1 backlog/*.md 2>/dev/null | wc -l)

echo "  活跃: $active_count"
echo "  已完成: $completed_count"
echo "  待办: $backlog_count"
echo ""

echo -e "${BLUE}=== 演示完成 ===${NC}"
echo "💡 提示: 在 moxton-docs 目录下启动 Claude Code 开始使用"
