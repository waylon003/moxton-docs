# Tech-Spec: 购物车删除接口重构

**创建时间:** 2025-12-12
**状态:** 已完成 (已通过代码审查并修复所有问题)

## 概述

### 问题陈述
当前购物车模块的删除功能使用错误的API实现方式。`removeFromCart` 方法使用批量更新接口并将数量设为0来实现删除，而不是使用专用的删除接口。同时缺少清空购物车和批量删除功能的前端调用。

### 解决方案
重构购物车删除功能，使用正确的API接口：
- 单个删除：使用 `DELETE /cart/item/:itemId`
- 清空购物车：使用 `DELETE /cart/clear`
- 批量删除：使用 `DELETE /cart/batch`

### 范围（包含/不包含）
**包含：**
- 重构 `removeFromCart` 方法使用正确的删除API
- 添加 `clearCart` 方法到 useCart composable
- 添加 `batchRemoveFromCart` 方法支持批量删除
- 更新相关的UI组件以支持新功能
- 保持现有的错误处理和加载状态模式

**不包含：**
- 修改购物车添加和更新功能
- 修改后端API接口
- 重构其他购物车功能

## 开发上下文

### 代码库模式
- **架构：** Nuxt 3 + TypeScript + Composition API
- **服务层：** 使用 CartService 类封装所有API调用
- **状态管理：** 使用 ref/reactive 进行响应式状态管理
- **错误处理：** 统一的 try-catch 模式，用户友好的错误消息
- **加载状态：** 结合 CartUIStore 管理UI状态

### 需要参考的文件
- `services/cartService.ts` - 已实现正确的API方法
- `composables/useCart.ts` - 需要重构的主要文件
- `stores/toast.ts` - Toast通知系统
- `components/shop/ProductCard.vue` - 可能需要更新
- `pages/shop/index.vue` - 购物车页面

### 技术决策
1. **API使用策略：** 直接调用 CartService 中已实现的正确API方法
2. **状态更新策略：** API成功后更新本地状态，失败时回滚
3. **批量操作：** 支持单个和批量删除，提供一致的用户体验
4. **向后兼容：** 保持现有方法签名，只修改内部实现

## 实现计划

### 任务

- [x] 任务1: 重构 removeFromCart 方法使用 DELETE API
- [x] 任务2: 添加 clearCart 方法到 useCart composable
- [x] 任务3: 添加 batchRemoveFromCart 方法
- [x] 任务4: 更新类型定义和导出
- [x] 任务5: 测试所有删除功能

### 验收标准

- [x] AC1: Given 用户点击单个商品删除按钮 When 调用 removeFromCart Then 使用 DELETE /cart/item/:itemId API 并从本地状态中移除该商品
- [x] AC2: Given 用户点击清空购物车按钮 When 调用 clearCart Then 使用 DELETE /cart/clear API 并清空本地购物车状态
- [x] AC3: Given 用户选择多个商品并点击批量删除 When 调用 batchRemoveFromCart Then 使用 DELETE /cart/batch API 并从本地状态中移除指定商品
- [x] AC4: Given API调用失败 Then 显示错误Toast并保持原有状态不变
- [x] AC5: Given 删除操作进行中 Then 显示加载状态并禁用相关UI操作

## 额外上下文

### 依赖项
- CartService 已经实现了所需的API方法
- Toast通知系统用于用户反馈
- CartUIStore 用于UI状态管理

### 测试策略
- 手动测试单个删除功能
- 手动测试清空购物车功能
- 手动测试批量删除功能
- 验证错误处理和加载状态

### 注意事项
- 需要保持与现有UI组件的兼容性
- 确保游客模式和用户模式都能正常工作
- 注意本地状态与API响应的同步