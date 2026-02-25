# 技术规范：咨询订单管理增强功能

**创建时间：** 2025-12-16
**状态：** 准备开发
**优先级：** 高

## 概述

### 问题描述

当前咨询订单管理页面存在以下功能缺失：
- 订单详情查看
- 订单状态编辑
- 操作历史记录查看
- 订单记录编辑
- 列表字段显示不完整（负责人和更新时间需要优化）

### 解决方案

基于现有API文档中的offline-order接口，实现完整的订单管理功能：
1. 在操作列添加"详情"和"查看历史"按钮
2. 创建订单详情弹窗，包含状态编辑功能
3. 创建独立的历史记录弹窗
4. 严格按照API文档字段进行数据对接
5. 优化列表字段显示：将"负责人"改为"上次操作人"，新增"上次更新时间"字段

### 范围界定

**包含范围：**
- 订单详情弹窗（基本信息展示 + 状态编辑）
- 独立的历史记录弹窗
- API服务扩展（历史记录相关接口）
- 操作列按钮扩展
- 响应式布局适配
- 列表字段优化（上次操作人、上次更新时间）

**不包含范围：**
- 订单创建功能（由前端商城处理）
- 高级统计分析功能
- 订单分配系统
- 消息通知功能

## 开发上下文

### 代码库模式

**技术栈：**
- Vue 3.5.24 + TypeScript 5.9.3
- Naive UI 2.43.1
- Pinia 3.0.4 (状态管理)
- 自定义@sa/axios包（HTTP客户端）

**现有模式：**
- 使用`useNaivePaginatedTable`进行分页表格管理
- 使用`useTableOperate`进行表格操作
- 遵循Elegant Router文件路由系统
- API服务层分离架构

### 参考文件

**必须参考的现有文件：**
- `src/views/consultation-order/index.vue` - 主列表页面
- `src/service/api/consultation-order.ts` - API服务定义
- `src/views/consultation-order/types.ts` - TypeScript类型定义
- `src/views/consultation-order/modules/` - 子组件目录
- `src/hooks/common/table.ts` - 表格管理钩子

**遵循的模式：**
- 组件命名：PascalCase
- 文件结构：功能模块化
- API调用：统一错误处理
- 样式规范：UnoCSS + 原子化CSS

### 技术决策

**界面布局决策：**
- 订单详情：使用`n-drawer`侧边抽屉，宽度700px
- 历史记录：使用`n-modal`弹窗，最大宽度800px
- 状态编辑：集成在详情弹窗中，使用`n-select`

**API对接决策：**
- 严格按照API文档字段名称
- 支持游客订单（sessionId字段）
- 历史记录支持分页和过滤
- 状态更新后自动刷新历史记录

**组件架构决策：**
- 详情组件：`ConsultationOrderDetail.vue`
- 历史组件：`ConsultationOrderHistory.vue`
- 状态编辑：集成在详情组件内
- 操作按钮：扩展现有操作列

## 实施计划

### 任务清单

- [ ] **任务1：扩展API服务层**
  - 添加历史记录相关接口方法
  - 扩展TypeScript类型定义
  - 支持新字段（sessionId等）
  - 优化列表接口返回字段（lastOperator、lastUpdatedAt）

- [ ] **任务2：创建订单详情组件**
  - 实现`ConsultationOrderDetail.vue`
  - 集成状态编辑功能
  - 严格按照API字段展示数据

- [ ] **任务3：创建历史记录组件**
  - 实现`ConsultationOrderHistory.vue`
  - 支持分页和筛选
  - 时间线样式展示

- [ ] **任务4：扩展主页面功能**
  - 在操作列添加"详情"和"历史"按钮
  - 优化列表字段显示（负责人→上次操作人，新增上次更新时间）
  - 集成新的组件到主页面
  - 添加相关的响应式状态管理

- [ ] **任务5：样式和响应式优化**
  - 确保移动端适配
  - 统一组件风格
  - 优化用户体验

### 验收标准

- [ ] **AC1：** 给定管理员点击"详情"按钮时，系统显示订单详情抽屉，包含所有API字段信息
- [ ] **AC2：** 给定管理员在详情抽屉中修改状态时，系统调用PUT接口并显示成功提示
- [ ] **AC3：** 给定管理员点击"查看历史"按钮时，系统显示历史记录弹窗，按时间倒序展示
- [ ] **AC4：** 给定状态更新完成后，历史记录自动刷新显示最新操作
- [ ] **AC5：** 给定不同屏幕尺寸时，界面保持良好可用性和美观性
- [ ] **AC6：** 给定订单列表加载时，"上次操作人"显示最新历史记录的adminName，"上次更新时间"显示最新历史记录的createdAt

## 额外上下文

### API字段对照表

**订单详情字段（来源：API文档）：**
```typescript
interface ConsultationOrder {
  id: string;                          // 订单ID
  productId: string;                   // 商品ID
  userId: string | null;              // 用户ID（游客为null）
  sessionId: string | null;           // 游客会话ID（新增）
  name: string;                       // 客户姓名
  phone: string;                      // 联系电话
  email: string | null;               // 邮箱地址
  company: string | null;             // 公司名称
  message: string | null;             // 咨询内容
  status: ConsultationOrderStatus;    // 订单状态
  adminNotes: string | null;          // 管理员备注
  assignedTo: string | null;          // 负责人
  isDeleted: boolean;                 // 删除标记
  createdAt: string;                  // 创建时间
  updatedAt: string;                  // 更新时间

  // 关联商品信息
  product?: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    images: string[];
    category?: {
      id: string;
      name: string;
    };
  };

  // 关联用户信息
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
}
```

**历史记录字段（来源：API文档）：**
```typescript
interface OrderHistory {
  id: string;                    // 历史记录ID
  orderId: string;              // 关联订单ID
  action: string;               // 操作类型（STATUS_CHANGED, NOTES_UPDATED, ORDER_ASSIGNED等）
  oldStatus: string | null;     // 原状态
  newStatus: string | null;     // 新状态
  adminId: string | null;       // 操作管理员ID
  adminName: string | null;     // 操作管理员姓名
  notes: string | null;         // 操作备注
  metadata?: object;            // 元数据
  createdAt: string;            // 操作时间
}
```

**状态枚举：**
```typescript
type ConsultationOrderStatus =
  | 'PENDING'      // 待处理
  | 'PROCESSING'   // 处理中
  | 'COMPLETED'    // 已完成
  | 'CANCELLED';   // 已取消
```

### API接口扩展

**需要添加的接口方法：**
```typescript
// 获取订单操作历史
export function fetchGetOrderHistory(orderId: string, params?: {
  pageNum?: number;
  pageSize?: number;
  action?: string;
  adminId?: string;
}) {
  return request<PaginatedResponse<OrderHistory>>({
    url: `/offline-orders/admin/${orderId}/history`,
    method: 'get',
    params
  });
}

// 获取历史统计
export function fetchGetHistoryStats(params?: {
  orderId?: string;
  adminId?: string;
  startDate?: string;
  endDate?: string;
}) {
  return request<{
    stats: {
      totalActions: number;
      statusChanges: number;
      notesUpdates: number;
      assignments: number;
      recentActivity: OrderHistory[];
    };
  }>({
    url: '/offline-orders/admin/history/stats',
    method: 'get',
    params
  });
}
```

### 依赖关系

**内部依赖：**
- `@sa/axios` - HTTP客户端
- `naive-ui` - UI组件库
- `vue-router` - 路由管理
- 现有的表格管理钩子

**外部依赖：**
- 后端API服务（localhost:3033）
- 管理员认证token

### 测试策略

**单元测试：**
- API服务方法测试
- 组件渲染测试
- 状态管理测试

**集成测试：**
- 端到端用户流程测试
- API响应格式验证
- 错误处理测试

**用户体验测试：**
- 响应式布局测试
- 操作流程易用性测试
- 性能表现测试

### 注意事项

**关键约束：**
- 必须严格按照API文档字段名称
- 保持与现有代码风格一致
- 支持游客和用户两种订单类型
- 状态更新必须自动记录历史

**性能考虑：**
- 历史记录分页加载（每页50条）
- 详情抽屉按需加载
- 避免不必要的API调用

**安全考虑：**
- 所有操作需要管理员权限验证
- 敏感信息（如电话）需要适当脱敏
- 遵循现有的权限控制机制

**维护性：**
- 组件高度模块化
- API接口统一封装
- 错误处理集中管理
- 支持未来的功能扩展