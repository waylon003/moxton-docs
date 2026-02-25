# Tech-Spec: 咨询订单管理删除功能实现

**创建时间:** 2025-12-12
**状态:** 准备开发
**项目:** Moxton LotAdmin - IoT设备电商管理系统

## 概述

### 问题陈述
咨询订单管理页面目前缺少删除功能，而后端API已经实现了完整的逻辑删除机制。需要添加与商品页面完全一致的删除功能。

### 解决方案
**完全复制商品页面的删除功能实现**，包括：
- 相同的UI布局和操作流程
- 相同的确认对话框样式和文案
- 相同的批量删除操作逻辑

### 范围（包含/不包含）

**包含：**
- ✅ 咨询订单单个删除功能（参照商品页面）
- ✅ 咨询订单批量删除功能（参照商品页面）
- ✅ 删除确认对话框（完全一致）
- ✅ 表格操作列的编辑/删除按钮
- ✅ 顶部批量操作按钮
- ✅ 删除后数据自动刷新

**不包含：**
- ❌ 任何与商品页面不一致的功能
- ❌ 恢复删除的咨询订单功能
- ❌ 已删除咨询订单列表页面

## 开发上下文

### 参考实现 - 商品页面删除功能

**文件位置：** `src/views/product/index.vue`

**关键UI元素：**
1. **表格操作列** - 每行包含编辑和删除按钮
2. **批量操作按钮** - 顶部"批量删除"按钮，选中时启用
3. **删除确认对话框** - 统一的确认样式

**关键代码模式：**
```typescript
// 单个删除确认
dialog.warning({
  title: '确认删除',
  content: `确定要删除商品"${product.name}"吗？此操作不可恢复。`,
  positiveText: '确认删除',
  onPositiveClick: () => { /* 删除逻辑 */ }
});

// 批量删除确认
dialog.warning({
  title: '确认删除',
  content: `确定要删除选中的 ${checkedRowKeys.value.length} 个商品吗？此操作不可恢复。`,
  positiveText: '确认删除',
  onPositiveClick: () => { /* 批量删除逻辑 */ }
});
```

### API实现模式

**参考文件：** `src/service/api/product.ts`

**删除API方法：**
```typescript
// 单个删除
export function fetchDeleteProduct(id: string) {
  return request<{ success: boolean }>({
    url: `/products/${id}`,
    method: 'delete'
  });
}

// 批量删除
export function fetchBatchDeleteProducts(productIds: string[]) {
  return request<{
    deleted: number;
    failed: string[];
    message: string;
  }>({
    url: '/products/batch',
    method: 'delete',
    data: { productIds }
  });
}
```

## 实现计划

### 任务分解

**任务1: API服务层扩展**
- [ ] 在 `consultation-order.ts` 中添加 `fetchDeleteConsultationOrder` 方法
  - API路径: `/customers/inquiries/:id`
  - 方法: DELETE
  - 返回: `{ success: boolean }`

- [ ] 在 `consultation-order.ts` 中添加 `fetchBatchDeleteConsultationOrders` 方法
  - API路径: `/customers/inquiries/batch`
  - 方法: DELETE
  - 参数: `{ orderIds: string[] }`
  - 返回: `{ deleted: number; failed: string[]; message: string }`

**任务2: UI组件功能实现**
- [ ] 在咨询订单表格中添加操作列（复制商品页面的操作列）
- [ ] 添加删除图标按钮（Trash图标）
- [ ] 实现单个删除的确认对话框（完全复制商品页面的文案和样式）

**任务3: 批量删除功能**
- [ ] 确保TableHeaderOperation组件支持批量删除
- [ ] 实现批量删除确认对话框（复制商品页面的实现）
- [ ] 添加批量删除的加载状态和结果提示

**任务4: 删除逻辑集成**
- [ ] 在 `useTableOperate` hook中集成删除功能
- [ ] 确保删除后调用 `getData()` 刷新数据
- [ ] 处理删除成功和失败的用户反馈

### 验收标准

- [ ] **AC1**: 咨询订单表格每行都有删除按钮，样式与商品页面一致
- [ ] **AC2**: 点击单个删除按钮显示确认对话框，文案与商品页面一致
- [ ] **AC3**: 选择多个咨询订单时，批量删除按钮启用，与商品页面行为一致
- [ ] **AC4**: 删除成功后显示成功消息，列表自动刷新
- [ ] **AC5**: 批量删除显示详细结果："成功删除X项，失败Y项"

## 关键实现细节

### API路径映射
根据API文档，咨询删除接口路径：
- 单个删除: `DELETE /customers/inquiries/:id`
- 批量删除: `DELETE /customers/inquiries/batch`

### UI一致性要求
- **删除按钮**: 使用相同的Trash图标和样式
- **确认对话框**: 完全相同的标题、文案、按钮样式
- **批量操作**: 相同的选中状态和按钮启用逻辑
- **加载状态**: 相同的loading指示器

### 用户体验一致性
- **操作流程**: 与商品页面完全一致
- **错误处理**: 相同的错误提示方式
- **成功反馈**: 相同的成功消息样式

---

**下一步**: 使用 `*quick-dev` 工作流实现此技术规格，确保与商品删除功能完全一致。