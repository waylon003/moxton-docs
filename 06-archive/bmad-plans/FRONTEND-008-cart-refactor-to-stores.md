# Tech-Spec: 将 composables\useCart.ts 重构成 Stores

**创建时间:** 2025-12-17
**状态:** 已完成
**完成时间:** 2025-12-17

## 概述

### 问题陈述
当前购物车逻辑使用 `composables/useCart.ts` 实现，虽然功能完整但存在状态管理不够集中、缺乏持久化等问题。需要将其重构为 Pinia store 以提供更好的状态管理和开发体验。

### 解决方案
创建新的 `stores/cart.ts` Pinia store，将所有购物车相关状态和逻辑迁移到 store 中。保持现有的 `composables/useCart.ts` 接口作为新 store 的包装器，确保向后兼容性，现有组件无需修改。

### 范围 (包含/不包含)

**包含:**
- 创建新的 `stores/cart.ts` Pinia store
- 将所有状态和逻辑从 useCart 迁移到新 store
- 重构 `composables/useCart.ts` 为 store 包装器
- 保持所有现有接口和功能不变
- 维持与现有 cartUI 和 checkout stores 的兼容性

**不包含:**
- 修改现有组件代码
- 改变 API 接口
- 修改 cartUI 和 checkout stores
- UI 界面变更

## 开发上下文

### 代码库模式
- **状态管理:** 使用 Pinia 进行集中式状态管理
- **组合式 API:** 保留 composable 包装器模式
- **服务层:** CartService 处理所有 API 调用
- **类型安全:** 完整的 TypeScript 类型定义
- **错误处理:** 乐观更新和错误回滚机制

### 需要引用的文件
- `composables/useCart.ts` - 现有接口和业务逻辑
- `stores/cartUI.ts` - UI 状态管理模式参考
- `services/cartService.ts` - API 服务调用模式
- `types/cart.ts` - 完整的类型定义

### 技术决策
1. **Store 模式:** 使用 Pinia setup 语法 (与 cartUI store 保持一致)
2. **接口兼容:** 保持现有 useCart 函数签名完全不变
3. **状态结构:** 直接映射现有状态到 store state
4. **异步处理:** 保持现有的 async/await 模式和错误处理
5. **依赖注入:** 继续使用 CartService 进行 API 调用

## 实施计划

### 任务

- [x] 任务 1: 创建 stores/cart.ts Pinia store
- [x] 任务 2: 迁移所有状态到 store state
- [x] 任务 3: 迁移所有 getters 和 computed properties
- [x] 任务 4: 迁移所有 actions 和 methods
- [x] 任务 5: 重构 composables/useCart.ts 为包装器
- [x] 任务 6: 验证功能完整性和接口兼容性

### 验收标准

- [x] AC 1: Given 创建了新的 stores/cart.ts，When 检查代码结构，Then 符合 Pinia setup 语法模式
- [x] AC 2: Given 调用 useCart() 接口，When 执行所有方法，Then 行为与重构前完全一致
- [x] AC 3: Given 现有组件使用 useCart，When 重构后运行，Then 无需任何修改即可正常工作
- [x] AC 4: Given 购物车状态变更，When 多个组件使用，Then 状态正确同步
- [x] AC 5: Given API 调用成功/失败，When 执行购物车操作，Then 错误处理和乐观更新正常工作

## 额外上下文

### 依赖关系
- **cartUI store:** 需要继续集成以管理 UI 状态
- **CartService:** 作为 API 层继续使用
- **类型定义:** 使用 types/cart.ts 中的完整类型

### 测试策略
1. **接口兼容性测试:** 确保所有现有调用方式正常工作
2. **状态同步测试:** 验证多组件状态一致性
3. **错误处理测试:** 确保乐观更新和错误回滚机制正常
4. **边界情况测试:** 测试空购物车、网络错误等场景

### 注意事项
- 必须保持与 cartUI store 的紧密集成
- 注意处理 guestId 和购物车过期逻辑
- 确保所有计算属性 (itemsCount, totalAmount 等) 正确映射
- 保持现有的批量操作支持
- 维护购物车验证功能