# Tech-Spec: 咨询订单管理模块

**创建时间:** 2025-12-12
**状态:** 准备开发
**模块:** 咨询订单管理 (Consultation Order Management)

## 概述

### 问题陈述
目前Moxton LotAdmin系统缺少对线下咨询订单的管理功能。API文档显示已有完整的咨询订单后端接口，但前端管理界面尚未实现。管理员无法查看、管理和统计用户提交的咨询订单。

### 解决方案
创建一个完整的咨询订单管理模块，参考Product模块的UI设计模式，实现咨询订单的查看、状态更新、搜索筛选和数据统计功能。

### 范围界定

**包含功能:**
- 咨询订单列表展示（分页、搜索、筛选）
- 订单详情查看
- 订单状态更新（待处理、处理中、已完成、已取消）
- 批量状态更新
- 订单数据统计展示
- CSV数据导出

**不包含功能:**
- 用户端咨询订单提交（由商城前端处理）
- 订单删除（咨询订单建议保留历史记录）
- 订单金额处理（咨询订单通常无价格）

## 开发上下文

### 代码库模式
**技术栈:**
- Vue 3.5 + TypeScript
- Naive UI 组件库
- Pinia 状态管理
- 文件路由系统 (Elegant Router)

**核心Hooks模式:**
```typescript
// 分页表格管理
const { loading, data, columns, pagination, getData } = useNaivePaginatedTable({
  api: consultationOrderService.fetchGetAllConsultationOrders,
  transform: consultationTransform,
  columns: tableColumns
});

// 表格操作管理
const { drawerVisible, operateType, handleAdd, editingData, handleEdit } = useTableOperate(orders, 'id', getData);
```

**文件命名规范:**
- 页面文件: PascalCase (`ConsultationOrder.vue`)
- 服务文件: camelCase (`consultation-order.ts`)
- 类型文件: camelCase (`types.ts`)

### 需要引用的文件
1. **Product模块结构** - 作为UI参考:
   - `src/views/product/index.vue` - 主列表布局
   - `src/views/product/modules/product-search.vue` - 搜索组件
   - `src/views/product/modules/product-form.vue` - 表单组件（参考模式）

2. **现有服务模式**:
   - `src/service/api/product.ts` - API调用模式
   - `src/service/api/order.ts` - 订单相关API模式

3. **类型定义**:
   - `src/typings/api.d.ts` - API类型定义（需要扩展）

### 技术决策

**1. 页面结构设计**
- 采用Product模块的左右分栏布局
- 顶部搜索区域 + 主要列表卡片
- 抽屉式详情查看（非编辑模式）

**1.1 首页统计集成**
- 更新 `src/views/home/modules/card-data.vue` 集成真实业务数据
- 替换现有的模板假数据（visitCount, turnover, downloadCount, dealCount）
- 添加咨询订单统计：今日新增、待处理、已完成、总咨询量
- 使用API获取的实时数据替代硬编码数字

**2. 状态管理**
- 使用本地状态，无需额外的Pinia store
- 订单状态映射：待处理(1) → 处理中(2) → 已完成(3) → 已取消(4)

**3. API集成**
- 创建新的 `consultation-order.ts` 服务文件
- 使用现有的 `@sa/axios` HTTP客户端
- 实现错误处理和响应数据转换

**4. 组件复用**
- 复用 `TableHeaderOperation` 组件
- 复用现有的表格列渲染模式
- 自定义咨询订单特有的渲染组件

## 实施计划

### 任务清单

- [ ] **任务1**: 创建咨询订单API服务
  - 创建 `src/service/api/consultation-order.ts`
  - 实现所有管理端API调用方法
  - 添加TypeScript接口定义

- [ ] **任务2**: 扩展类型定义
  - 在 `src/typings/api.d.ts` 中添加咨询订单类型
  - 定义订单状态枚举和接口
  - 添加搜索参数类型

- [ ] **任务3**: 创建主页面结构
  - 创建 `src/views/manage/consultation-order/index.vue`
  - 实现基础页面布局和路由集成
  - 配置Elegant Router路由

- [ ] **任务4**: 实现搜索组件
  - 创建 `src/views/manage/consultation-order/modules/consultation-order-search.vue`
  - 支持按状态、时间范围、联系人信息搜索
  - 实现搜索表单验证

- [ ] **任务5**: 实现主列表功能
  - 配置表格列（订单信息、客户信息、状态、时间等）
  - 实现分页数据加载
  - 添加状态更新操作

- [ ] **任务6**: 实现订单详情功能
  - 创建订单详情查看组件
  - 支持状态更新和备注添加
  - 实现操作历史记录

- [ ] **任务7**: 实现批量操作
  - 批量状态更新
  - 批量导出功能
  - 操作确认对话框

- [ ] **任务8**: 数据统计展示和首页集成
  - 集成咨询订单统计API (`/offline-orders/admin/stats/all`)
  - 更新首页 `src/views/home/modules/card-data.vue` 显示真实咨询订单数据
  - 替换现有模板数据为实际的业务统计数据
  - 添加咨询订单相关的图表展示（可选）

- [ ] **任务9**: 测试和优化
  - 单元测试
  - 响应式设计优化
  - 性能优化

### 验收标准

- [ ] **AC1**: 访问 `/manage/consultation-order` 能正确显示咨询订单列表
- [ ] **AC2**: 支持按订单状态、时间范围、关键词搜索筛选
- [ ] **AC3**: 点击订单能查看详情，包含客户信息、咨询内容、历史记录
- [ ] **AC4**: 支持更新订单状态，状态变更实时反映
- [ ] **AC5**: 支持批量选择和批量状态更新
- [ ] **AC6**: 能导出订单数据为CSV格式
- [ ] **AC7**: 页面在移动端正常显示和操作
- [ ] **AC8**: 集成真实的后端API，数据能正确加载和提交
- [ ] **AC9**: 首页显示真实的咨询订单统计数据，替代模板数据
- [ ] **AC10**: 首页统计数据能实时更新，反映最新的业务状态

## 额外上下文

### 依赖关系
1. **后端API依赖**: 确保API文档中的接口已实现并可访问
2. **权限系统**: 需要管理员权限才能访问
3. **文件系统**: 可能需要查看产品图片（如果咨询订单关联产品）

### 测试策略
1. **单元测试**: 重点测试API调用和数据转换
2. **集成测试**: 测试完整的用户操作流程
3. **UI测试**: 确保响应式设计和交互正确性
4. **API Mock**: 使用Apifox mock数据进行开发测试

### 注意事项
1. **游客订单处理**: 部分订单可能来自游客，显示标识
2. **数据安全**: 确保客户联系方式等敏感信息的适当显示
3. **操作日志**: 重要操作应记录日志
4. **性能考虑**: 大量订单数据的分页和搜索性能优化

### 首页集成详细说明

**现有首页问题:**
- `card-data.vue` 显示硬编码的假数据 (visitCount: 9725, turnover: 1026等)
- 这些数据没有实际业务意义
- 缺少Moxton LotAdmin相关的业务统计

**集成后的首页将显示:**
1. **今日新增咨询** - 今天提交的咨询订单数量
2. **待处理订单** - 状态为"待处理"的订单数量
3. **本周完成** - 本周完成的咨询订单数量
4. **总咨询量** - 系统总的咨询订单数量

**技术实现:**
- 调用 `/offline-orders/admin/stats/all` API获取统计数据
- 使用响应式设计，保持现有的卡片样式和动画效果
- 支持定时刷新或手动刷新数据
- 添加错误处理和加载状态

**文件变更:**
- 更新 `src/views/home/modules/card-data.vue`
- 可能需要更新相关的国际化文件
- 添加新的Pinia store管理首页统计数据

### 后续扩展可能
- 订单分配功能（分配给特定客服）
- 消息通知集成（新订单提醒）
- 高级报表和数据分析
- 客户标签和分类管理

---

**预计开发时间**: 2-3天
**优先级**: 高（完善后台管理功能）
**复杂度**: 中等（主要复用现有模式）