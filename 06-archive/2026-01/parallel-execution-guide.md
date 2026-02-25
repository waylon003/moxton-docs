# 三端并行开发工作指南

> **主会话位置**: E:\moxton-lotapi
> **架构模式**: 单会话 + 多子代理并行

## 🏗️ 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│  主会话 (E:\moxton-lotapi) - 协调中心                      │
│                                                             │
│  职责:                                                       │
│  - 接收用户需求                                              │
│  - 分解任务为三端工作项                                      │
│  - 并行启动子代理                                            │
│  - 收集结果并汇总                                            │
│  - 更新统一文档 (E:\moxton-docs)                            │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ 子代理 A     │  │ 子代理 B     │  │ 子代理 C     │     │
│  │ 后端开发     │  │ 前端开发     │  │ 后台开发     │     │
│  │ E:\moxton-   │  │ E:\nuxt-    │  │ E:\moxton-   │     │
│  │   lotapi     │  │   moxton    │  │   lotadmin   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         ↓                ↓                ↓                 │
│  通过绝对路径访问各项目文件，共享状态到 moxton-docs        │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 基础并行模式

### 模式 1: 三端同时开发新功能

```javascript
// 场景：实现一个新的"商品收藏"功能

// === 子代理 A: 后端 API ===
Task({
  subagent_type: "oh-my-claudecode:executor",
  model: "sonnet",
  prompt: `
    === 任务：后端收藏功能开发 ===

    工作目录: E:\\moxton-lotapi (当前目录)

    任务:
    1. 读取 E:\\moxton-docs\\api\\products.md 了解现有 API
    2. 在 src/models/ 创建 favoriteModel.ts
    3. 在 src/controllers/ 创建 favoriteController.ts
    4. 在 src/routes/ 添加 favorite.ts 路由
    5. 更新 prisma/schema.prisma 添加 Favorite 表
    6. 运行 npm run prisma:push
    7. 更新 API 文档 E:\\moxton-docs\\api\\favorites.md

    API 端点:
    - POST /favorites (添加收藏)
    - DELETE /favorites/:id (取消收藏)
    - GET /favorites (获取收藏列表)

    完成后报告实现的端点和文档路径。
  `
});

// === 子代理 B: 前端集成 ===
Task({
  subagent_type: "oh-my-claudecode:executor",
  model: "sonnet",
  prompt: `
    === 任务：前端收藏功能集成 ===

    工作目录: E:\\nuxt-moxton
    API 文档: E:\\moxton-docs\\api\\favorites.md

    任务:
    1. 等待后端 API 完成（检查 E:\\moxton-docs\\api\\favorites.md 是否存在）
    2. 创建 composables/useFavorites.ts
    3. 创建 components/FavoriteButton.vue
    4. 创建 pages/favorites/index.vue
    5. 集成到商品详情页
    6. 添加收藏状态持久化

    完成后报告实现的组件和页面。
  `,
  run_in_background: true
});

// === 子代理 C: 后台管理 ===
Task({
  subagent_type: "oh-my-claudecode:executor",
  model: "sonnet",
  prompt: `
    === 任务：后台收藏管理功能 ===

    工作目录: E:\\moxton-lotadmin
    API 文档: E:\\moxton-docs\\api\\favorites.md

    任务:
    1. 等待后端 API 完成
    2. 创建 src/service/api/favorite.ts
    3. 创建 src/views/manage/favorite/index.vue
    4. 实现收藏商品列表和统计
    5. 添加收藏数据导出功能

    完成后报告实现的管理功能。
  `,
  run_in_background: true
});
```

---

### 模式 2: 后端先行，前端跟进

```javascript
// 场景：后端 API 变更需要前端适配

// === 步骤 1: 后端更新 API ===
Task({
  subagent_type: "oh-my-claudecode:executor",
  model: "sonnet",
  prompt: `
    === 任务：更新订单 API 响应格式 ===

    工作目录: E:\\moxton-lotapi

    变更需求: 将订单列表的 list 字段改为 items

    任务:
    1. 修改 src/controllers/orderController.ts
    2. 更新响应转换逻辑
    3. 更新 API 文档 E:\\moxton-docs\\api\\orders.md
    4. 在 E:\\moxton-docs\\api\\orders.md 添加 ⚠️ BREAKING CHANGE 标记
    5. 创建 E:\\moxton-docs\\migration-guides\\order-api-v2.md 迁移指南

    完成后标记任务为完成。
  `
});

// === 步骤 2: 等待后端完成后并行更新前端 ===
// (在前端和后台的 prompt 中检查文档是否标记为完成)
```

---

### 模式 3: 独立任务并行

```javascript
// 场景：三个项目各自独立的优化任务

Task({
  subagent_type: "oh-my-claudecode:executor",
  model: "sonnet",
  prompt: `
    === 任务：后端性能优化 ===

    工作目录: E:\\moxton-lotapi

    任务: 优化商品查询接口性能
    1. 添加数据库索引
    2. 实现查询结果缓存
    3. 优化响应时间到 < 100ms
  `
});

Task({
  subagent_type: "oh-my-claudecode:executor",
  model: "sonnet",
  prompt: `
    === 任务：前端 UI 优化 ===

    工作目录: E:\\nuxt-moxton

    任务: 优化商品列表页加载体验
    1. 实现虚拟滚动
    2. 添加骨架屏
    3. 优化图片懒加载
  `
});

Task({
  subagent_type: "oh-my-claudecode:executor",
  model: "sonnet",
  prompt: `
    === 任务：后台数据统计优化 ===

    工作目录: E:\\moxton-lotadmin

    任务: 优化数据统计图表
    1. 添加数据导出功能
    2. 优化大数据量渲染
    3. 添加实时数据刷新
  `
});
```

---

## 📋 任务状态协调

### 使用共享状态文件

```javascript
// === 主会话创建任务状态 ===
Write({
  file_path: "E:\\moxton-docs\\task-state.json",
  content: JSON.stringify({
    "taskId": "feature-favorites-001",
    "status": "in_progress",
    "tasks": {
      "backend": {
        "status": "pending",
        "assignedTo": "agent-a",
        "output": "E:\\moxton-docs\\api\\favorites.md"
      },
      "frontend": {
        "status": "pending",
        "assignedTo": "agent-b",
        "dependsOn": ["backend"],
        "output": "E:\\nuxt-moxton\\composables\\useFavorites.ts"
      },
      "admin": {
        "status": "pending",
        "assignedTo": "agent-c",
        "dependsOn": ["backend"],
        "output": "E:\\moxton-lotadmin\\src\\views\\manage\\favorite\\"
      }
    },
    "sharedContext": {
      "apiBaseUrl": "http://localhost:3033",
      "apiVersion": "v1"
    }
  }, null, 2)
});

// === 子代理更新状态 ===
Task({
  subagent_type: "oh-my-claudecode:executor",
  prompt: `
    任务开始前:
    1. 读取 E:\\moxton-docs\\task-state.json
    2. 检查依赖任务是否完成
    3. 将你的任务状态改为 "in_progress"

    完成后:
    4. 将状态改为 "completed"
    5. 添加完成时间戳
  `
});
```

---

## 🎯 实际场景示例

### 场景：修复购物车价格显示问题

```javascript
// === 问题描述 ===
// 前端发现购物车价格显示不正确，需要三端协作修复

// === 步骤 1: 后端诊断 ===
Task({
  subagent_type: "oh-my-claudecode:architect",
  model: "sonnet",
  prompt: `
    === 任务：诊断购物车价格计算问题 ===

    工作目录: E:\\moxton-lotapi

    任务:
    1. 读取 src/controllers/cartController.ts 价格计算逻辑
    2. 检查购物车响应格式 (E:\\moxton-docs\\api\\cart.md)
    3. 分析价格计算公式
    4. 检查是否有价格同步问题
    5. 生成诊断报告: E:\\moxton-docs\\issues\\cart-price-issue.md

    报告应包含:
    - 问题根因分析
    - 修复方案
    - 是否需要前端/后台配合
  `
});

// === 步骤 2: 并行修复 ===
// 根据诊断结果，并行启动修复任务
```

---

## 🔧 高级技巧

### 技巧 1: 链式任务

```javascript
// 后端完成 → 触发前端和后台
Task({
  subagent_type: "oh-my-claudecode:executor",
  prompt: `
    后端任务完成后:
    1. 更新 E:\\moxton-docs\\task-state.json 标记完成
    2. 创建完成标记文件 E:\\moxton-docs\\.backend-completed
    3. 通知其他任务可以开始
  `
});
```

### 技巧 2: 条件等待

```javascript
Task({
  subagent_type: "oh-my-claudecode:executor",
  prompt: `
    前端任务:
    1. 检查 E:\\moxton-docs\\api\\new-feature.md 是否存在
    2. 如果不存在，等待并每 30 秒检查一次
    3. 文档存在后开始开发
  `
});
```

### 技巧 3: 结果汇总

```javascript
// 主会话收集所有子代理结果
const backendResult = await TaskOutput({
  task_id: "backend-task-id",
  block: true
});

const frontendResult = await TaskOutput({
  task_id: "frontend-task-id",
  block: true
});

const adminResult = await TaskOutput({
  task_id: "admin-task-id",
  block: true
});

// 生成汇总报告
Write({
  file_path: "E:\\moxton-docs\\completion-report.md",
  content: `
# 功能开发完成报告

## 后端实现
${backendResult}

## 前端实现
${frontendResult}

## 后台实现
${adminResult}
  `
});
```

---

## 📊 并行执行模板

```javascript
// === 通用并行执行模板 ===

function executeParallelTask(featureName, tasks) {
  const results = [];

  // 并行启动所有任务
  for (const task of tasks) {
    const result = Task({
      subagent_type: task.agentType || "oh-my-claudecode:executor",
      model: task.model || "sonnet",
      prompt: task.prompt,
      run_in_background: true
    });
    results.push(result);
  }

  // 收集结果
  return Promise.all(results.map(r =>
    TaskOutput({ task_id: r, block: true })
  ));
}

// === 使用示例 ===
executeParallelTask("商品收藏功能", [
  {
    name: "backend",
    agentType: "oh-my-claudecode:executor",
    prompt: "后端收藏功能开发..."
  },
  {
    name: "frontend",
    agentType: "oh-my-claudecode:executor",
    prompt: "前端收藏功能集成..."
  },
  {
    name: "admin",
    agentType: "oh-my-claudecode:executor",
    prompt: "后台收藏管理..."
  }
]);
```

---

## ⚡ 性能优化

### 1. 选择合适的模型

| 任务复杂度 | 推荐模型 | 用途 |
|-----------|----------|------|
| 简单文件读写 | `haiku` | 配置更新、文档读取 |
| 标准开发任务 | `sonnet` | 功能实现、Bug 修复 |
| 复杂架构设计 | `opus` | 系统重构、性能优化 |

### 2. 合理使用后台模式

```javascript
// ✅ 适合后台运行
Task({ run_in_background: true });  // 长时间任务
Task({ run_in_background: true });  // 独立任务

// ❌ 不适合后台运行
Task({ run_in_background: false }); // 需要立即结果的
Task({ run_in_background: false }); // 有依赖关系的
```

---

## 🎓 最佳实践

1. **明确工作目录**: 始终在 prompt 中指明绝对路径
2. **使用统一文档**: 所有 API 定义在 `E:\moxton-docs`
3. **状态共享**: 通过文件系统共享任务状态
4. **错误处理**: 每个子代理处理自己的错误
5. **结果验证**: 主会话验证子代理的输出

---

**开始使用**: 从"模式 1: 三端同时开发新功能"开始尝试！
