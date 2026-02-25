# 三端并行任务模板

> **直接复制使用** - 根据场景选择对应模板

---

## 模板 1: 新功能全栈开发

### 场景：实现"商品评价"功能

```javascript
// === 复制这段代码执行 ===

// 启动后端任务
Task({
  subagent_type: "oh-my-claudecode:executor",
  model: "sonnet",
  prompt: `
=== 任务：商品评价后端 API ===

工作目录: E:\\moxton-lotapi

任务:
1. 更新 prisma/schema.prisma 添加 Review 表:
   - id, productId, userId, rating, comment, images
   - status (1:显示 0:隐藏)
   - createdAt, updatedAt

2. 创建 src/models/reviewModel.ts

3. 创建 src/controllers/reviewController.ts
   端点:
   - GET /reviews/product/:productId (获取商品评价)
   - POST /reviews (创建评价)
   - PUT /reviews/:id (更新评价)
   - DELETE /reviews/:id (删除评价)
   - GET /reviews/admin (管理员评价列表)

4. 创建 src/routes/review.ts

5. 运行 npm run prisma:push

6. 更新 API 文档: E:\\moxton-docs\\api\\reviews.md
  `,
  run_in_background: true
});

// 启动前端任务（等待后端）
Task({
  subagent_type: "oh-my-claudecode:executor",
  model: "sonnet",
  prompt: `
=== 任务：商品评价前端集成 ===

工作目录: E:\\nuxt-moxton

前置条件:
1. 等待后端完成（检查 E:\\moxton-docs\\api\\reviews.md 是否存在）
2. 读取 API 文档了解接口

任务:
1. 创建 composables/useReviews.ts
   - useProductReviews() - 获取商品评价
   - createReview() - 创建评价
   - updateReview() - 更新评价
   - deleteReview() - 删除评价

2. 创建 components/review/ReviewList.vue
3. 创建 components/review/ReviewForm.vue
4. 创建 components/review/ReviewCard.vue
5. 集成到商品详情页
6. 添加评价星星评分组件

完成后报告实现情况。
  `,
  run_in_background: true
});

// 启动后台任务（等待后端）
Task({
  subagent_type: "oh-my-claudecode:executor",
  model: "sonnet",
  prompt: `
=== 任务：评价后台管理 ===

工作目录: E:\\moxton-lotadmin

前置条件:
1. 等待后端完成
2. 读取 API 文档

任务:
1. 创建 src/service/api/review.ts

2. 创建 src/views/manage/review/index.vue
   - 评价列表（支持商品筛选、状态筛选）
   - 批量审核/隐藏
   - 回复功能

3. 添加到路由和菜单

完成后报告实现情况。
  `,
  run_in_background: true
});
```

---

## 模板 2: API 变更同步

### 场景：修改用户信息字段

```javascript
// === 后端：修改字段 ===
Task({
  subagent_type: "oh-my-claudecode:executor",
  model: "sonnet",
  prompt: `
=== 任务：修改用户信息字段 ===

工作目录: E:\\moxton-lotapi

变更: 用户表新增 "nickname" 字段，移除 "firstName/lastName"

任务:
1. 更新 prisma/schema.prisma
2. 运行 npm run prisma:push
3. 修改 src/controllers/authController.ts
4. 修改 src/models/userModel.ts
5. 更新 API 文档 E:\\moxton-docs\\api\\auth.md
   - 添加 ⚠️ BREAKING CHANGE 标记
   - 标注字段变更

完成后更新文档。
  `
});

// === 前端：适配变更 ===
Task({
  subagent_type: "oh-my-claudecode:executor",
  model: "sonnet",
  prompt: `
=== 任务：适配用户信息字段变更 ===

工作目录: E:\\nuxt-moxton

任务:
1. 等待后端 API 文档更新
2. 读取 E:\\moxton-docs\\api\\auth.md 中的变更说明
3. 修改用户信息表单组件
   - 移除 firstName/lastName 字段
   - 添加 nickname 字段
4. 更新 TypeScript 类型定义
5. 更新所有使用用户信息的地方

完成后测试验证。
  `,
  run_in_background: true
});

// === 后台：适配变更 ===
Task({
  subagent_type: "oh-my-claudecode:executor",
  model: "sonnet",
  prompt: `
=== 任务：后台适配用户字段变更 ===

工作目录: E:\\moxton-lotadmin

任务:
1. 等待后端 API 更新
2. 读取变更文档
3. 修改用户管理表单
4. 更新用户列表显示
5. 更新 TypeScript 类型

完成后测试验证。
  `,
  run_in_background: true
});
```

---

## 模板 3: Bug 修复协作

### 场景：修复订单状态更新问题

```javascript
// === 后端：诊断和修复 ===
Task({
  subagent_type: "oh-my-claudecode:architect",
  model: "sonnet",
  prompt: `
=== 任务：诊断订单状态更新问题 ===

问题描述: 前端反馈订单状态更新后没有生效

工作目录: E:\\moxton-lotapi

诊断步骤:
1. 读取 src/controllers/orderController.ts 状态更新逻辑
2. 检查事务处理是否正确
3. 检查数据库操作是否执行
4. 检查响应格式是否正确
5. 生成诊断报告

如果发现问题，实现修复方案。
诊断报告保存到: E:\\moxton-docs\\issues\\order-status-diagnosis.md
  `
});

// === 前端：验证修复 ===
Task({
  subagent_type: "oh-my-claudecode:executor",
  model: "sonnet",
  prompt: `
=== 任务：验证订单状态更新修复 ===

工作目录: E:\\nuxt-moxton

任务:
1. 等待后端修复完成
2. 读取诊断报告了解修复内容
3. 更新前端订单状态更新逻辑
4. 测试状态更新功能
5. 确认问题已解决

完成后报告验证结果。
  `,
  run_in_background: true
});
```

---

## 模板 4: 性能优化并行

### 场景：整体性能优化

```javascript
// === 三端并行优化 ===

Task({
  subagent_type: "oh-my-claudecode:executor",
  model: "sonnet",
  prompt: `
=== 任务：后端性能优化 ===

工作目录: E:\\moxton-lotapi

优化目标: API 响应时间 < 200ms

任务:
1. 分析慢查询（添加日志）
2. 优化数据库索引
3. 实现查询结果缓存
4. 优化 N+1 查询问题
5. 压缩响应数据

完成后提供优化报告。
  `,
  run_in_background: true
});

Task({
  subagent_type: "oh-my-claudecode:executor",
  model: "sonnet",
  prompt: `
=== 任务：前端性能优化 ===

工作目录: E:\\nuxt-moxton

优化目标: 页面加载时间 < 2s

任务:
1. 实现路由懒加载
2. 优化图片加载（压缩、懒加载）
3. 实现虚拟滚动（长列表）
4. 添加骨架屏
5. 优化包体积（Tree Shaking）

完成后提供优化报告。
  `,
  run_in_background: true
});

Task({
  subagent_type: "oh-my-claudecode:executor",
  model: "sonnet",
  prompt: `
=== 任务：后台性能优化 ===

工作目录: E:\\moxton-lotadmin

优化目标: 大数据量列表流畅渲染

任务:
1. 实现虚拟滚动
2. 优化表格渲染性能
3. 添加分页加载
4. 实现数据导出（异步）
5. 优化图表渲染

完成后提供优化报告。
  `,
  run_in_background: true
});
```

---

## 模板 5: 文档同步更新

### 场景：API 变更后更新所有文档

```javascript
// === 并行更新三端文档 ===

Task({
  subagent_type: "oh-my-claudecode:writer",
  model: "haiku",
  prompt: `
=== 任务：更新后端 API 文档 ===

工作目录: E:\\moxton-lotapi

任务:
1. 扫描 src/controllers/ 下所有控制器
2. 提取 API 端点定义
3. 更新 E:\\moxton-docs\\api\\ 对应模块文档
4. 确保请求/响应格式与代码一致
5. 添加字段注释

完成后更新文档列表。
  `
});

Task({
  subagent_type: "oh-my-claudecode:writer",
  model: "haiku",
  prompt: `
=== 任务：更新前端集成文档 ===

工作目录: E:\\nuxt-moxton

任务:
1. 读取 E:\\moxton-docs\\api\\ 最新 API 文档
2. 更新项目内的 API 调用示例
3. 更新 TypeScript 类型定义
4. 更新组件使用说明

完成后更新文档列表。
  `,
  run_in_background: true
});

Task({
  subagent_type: "oh-my-claudecode:writer",
  model: "haiku",
  prompt: `
=== 任务：更新后台集成文档 ===

工作目录: E:\\moxton-lotadmin

任务:
1. 读取 E:\\moxton-docs\\api\\ 最新 API 文档
2. 更新 src/service/api/ 下的服务文件
3. 更新 TypeScript 类型定义
4. 更新页面使用说明

完成后更新文档列表。
  `,
  run_in_background: true
});
```

---

## 使用说明

### 步骤 1: 选择模板
根据你的需求选择对应模板

### 步骤 2: 复制代码
直接复制模板中的 Task 调用代码

### 步骤 3: 修改内容
根据实际情况修改 prompt 中的任务描述

### 步骤 4: 执行
粘贴到主会话中执行

### 步骤 5: 监控
- 查看子代理输出
- 检查 `E:\moxton-docs\task-state.json` 状态
- 验证各项目输出

---

**提示**: 所有模板都在主会话 (E:\moxton-lotapi) 中执行！
