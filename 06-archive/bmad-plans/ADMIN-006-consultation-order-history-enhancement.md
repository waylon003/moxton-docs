# Tech-Spec: 订单操作历史功能优化

**创建时间:** 2025-12-16
**状态:** 已完成

## 概述

### 问题陈述

当前订单操作历史功能存在以下问题：
1. 存在不需要的操作筛选和管理员筛选功能
2. 状态变更显示逻辑需要优化：当 newStatus 和 oldStatus 不一致时应使用状态映射，而非直接使用 description

### 解决方案

优化订单历史显示逻辑，移除不必要的筛选控件，改进状态变更描述的生成规则。

### 范围（In/Out）

**范围内：**
- 修改 `renderHistoryContent` 函数中的字段使用逻辑
- 移除操作筛选和管理员筛选控件
- 优化状态变更描述的显示规则

**范围外：**
- API接口修改
- 数据库结构变更
- 其他订单管理功能

## 开发上下文

### 代码库模式

- **组件结构**：使用 `<script setup>` 和 Composition API
- **UI框架**：Naive UI 组件库
- **状态管理**：使用 ref 和 computed 进行响应式状态管理
- **API集成**：使用自定义的 @sa/axios 包
- **类型定义**：完整的 TypeScript 类型系统

### 需要引用的文件

- `src/views/consultation-order/modules/consultation-order-history.vue` - 主要修改文件
- `src/service/api/consultation-order.ts` - API类型定义和服务

### 技术决策

1. **状态映射优先级**：当存在状态变更时，优先使用映射后的状态文本
2. **筛选功能移除**：完全移除筛选控件，简化用户界面
3. **向后兼容**：保持现有数据结构和API接口不变

## 实施计划

### 任务

- [x] 任务1: 修改状态变更显示逻辑
  - 更新 `renderHistoryContent` 函数中的 `STATUS_CHANGED` 处理逻辑
  - 当 `newStatus !== oldStatus` 且都不为空时，使用状态映射生成描述
  - 当状态一致或为空时，使用 `description` 字段

- [x] 任务2: 移除筛选控件
  - 删除操作筛选下拉框 (第222-235行)
  - 删除管理员筛选下拉框 (第229-235行)
  - 移除相关的响应式数据和监听器

- [x] 任务3: 清理相关代码
  - 移除 `filterParams` 相关的状态和逻辑
  - 移除 `actionOptions` 和 `adminOptions` 配置
  - 清理筛选相关的监听器

- [x] 任务4: 样式优化
  - 调整移除筛选后的布局
  - 确保移动端响应式显示正常

### 验收标准

- [x] AC1: 当 newStatus 和 oldStatus 不一致且不为空时，显示格式为"订单状态从 [旧状态] 变更为 [新状态]"
- [x] AC2: 当 newStatus 和 oldStatus 一致或都为空时，显示 description 字段内容
- [x] AC3: 页面不再显示操作筛选和管理员筛选控件
- [x] AC4: 移除筛选后，历史记录显示所有相关记录
- [x] AC5: 保持其他操作类型（NOTES_ADDED, ORDER_CREATED等）的显示逻辑不变

## 附加上下文

### 依赖项

- Vue 3.5.24
- Naive UI 2.43.1
- TypeScript 5.9.3
- 现有的 consultation-order API 服务

### 测试策略

1. **功能测试**：验证不同状态变更场景的显示正确性
2. **UI测试**：确认筛选控件已完全移除，布局正常
3. **响应式测试**：在各种屏幕尺寸下验证显示效果
4. **边界情况测试**：测试空状态、异常数据等情况

### 备注

- 保持现有的API调用结构不变
- 确保向后兼容性，不要破坏现有功能
- 状态映射使用现有的 `statusMap` 配置
- 移除筛选后，默认显示所有历史记录