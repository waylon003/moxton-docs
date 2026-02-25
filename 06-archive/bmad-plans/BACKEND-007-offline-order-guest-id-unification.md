# 技术规格: 咨询订单模块X-Guest-ID统一改造

**创建时间**: 2025-12-12
**状态**: 准备开发
**优先级**: 高

## 概述

### 问题陈述

当前咨询订单模块使用联系方式(手机/邮箱)识别游客用户，与购物车和普通订单模块的X-Guest-ID机制不一致，导致：
1. 游客用户体验不统一
2. 前端需要处理多种用户识别方式
3. 数据架构不一致，增加维护复杂度

### 解决方案

将咨询订单模块完全统一到X-Guest-ID架构，实现：
- 统一的游客识别机制
- 简化的前端集成
- 一致的数据架构
- 游客可以查询自己的咨询订单和普通订单

### 范围 (In/Out)

**范围内 (In)**:
- OfflineOrder表添加sessionId字段支持X-Guest-ID
- 咨询订单创建接口支持X-Guest-ID
- 游客查询接口改为使用X-Guest-ID
- 管理员接口保持不变
- 现有联系方式字段保留，用于客户沟通

**范围外 (Out)**:
- 普通订单模块改造 (已95%支持X-Guest-ID)
- 购物车模块改造 (已100%支持X-Guest-ID)
- 管理员后台界面改动
- 前端界面改动

## 开发上下文

### 代码库模式

**架构模式**:
- MVC架构: Models → Controllers → Routes
- 基础Model类: 继承BaseModel，提供标准CRUD操作
- 统一响应格式: ctx.success(), ctx.badRequest(), ctx.validationError()

**认证中间件**:
- `authMiddleware`: 必需JWT认证
- `optionalAuthMiddleware`: 可选认证 + X-Guest-ID支持 ✅

**数据库**:
- Prisma ORM + MySQL
- 逻辑外键 (非物理约束)

### 需要引用的文件

**核心文件**:
```
prisma/schema.prisma                    # 数据库模式定义
src/models/OfflineOrder.ts             # 数据访问层
src/controllers/OfflineOrder.ts        # 业务逻辑层
src/routes/offline-orders.ts           # 路由定义
src/middleware/auth.ts                 # 认证中间件 (无需修改)
```

**参考模式**:
```
src/models/Cart.ts                     # 购物车X-Guest-ID实现
src/controllers/Order.controller.ts    # 普通订单X-Guest-ID实现
```

### 技术决策

**X-Guest-ID架构选择**:
- 使用现有的`optionalAuthMiddleware`中间件 (line 46-77 in auth.ts)
- X-Guest-ID通过`ctx.sessionId`访问 (line 63 in auth.ts)
- 与购物车和普通订单保持完全一致

**数据清理策略**:
- 现有咨询订单数据全部清除 (用户确认)
- 新的sessionId字段为可选，与userId共存

**向后兼容**:
- 不需要向后兼容，前端尚未对接
- 联系方式字段保留，用于业务需求

## 实施计划

### 任务清单

- [ ] **Task 1**: 数据库模式改造
  - 修改prisma/schema.prisma，OfflineOrder添加sessionId字段
  - 运行prisma generate更新客户端
  - 运行prisma push更新数据库结构

- [ ] **Task 2**: Model层改造
  - 更新OfflineOrderModel.createOfflineOrder()支持sessionId
  - 新增OfflineOrderModel.getOrdersBySession()方法
  - 修改getGuestOrders()方法，统一使用sessionId

- [ ] **Task 3**: Controller层改造
  - 修改submitConsultation()方法，获取ctx.sessionId
  - 修改getGuestOrders()方法，改为X-Guest-ID查询
  - 保持管理员接口不变

- [ ] **Task 4**: 路由层改造
  - 更新游客查询路由，确保使用optionalAuthMiddleware
  - 移除基于联系人的查询参数

- [ ] **Task 5**: 测试验证
  - 测试X-Guest-ID创建咨询订单
  - 测试X-Guest-ID查询咨询订单
  - 验证管理员功能不受影响
  - 端到端流程测试

### 验收标准

- [ ] **AC 1**: Given 游客携带有效的X-Guest-ID头部, When 创建咨询订单, Then 订单正确保存sessionId并且返回成功响应
- [ ] **AC 2**: Given 游客携带有效的X-Guest-ID头部, When 查询咨询订单, Then 返回该游客的所有咨询订单
- [ ] **AC 3**: Given 管理员登录, When 查看咨询订单, Then 看到所有订单包括sessionId信息，管理员功能不受影响
- [ ] **AC 4**: Given 登录用户, When 创建咨询订单, Then 订单同时保存userId和sessionId
- [ ] **AC 5**: Given 任何请求, When 不携带X-Guest-ID, Then 咨询订单创建返回400错误，查询返回空结果

## 额外上下文

### 依赖关系

**无明确依赖**:
- 认证中间件已就绪 ✅
- 数据库连接正常 ✅
- Prisma ORM配置完整 ✅

**隐含依赖**:
- 前端需要确保所有咨询订单相关请求都携带X-Guest-ID头部
- API文档需要更新，说明新的认证要求

### 测试策略

**单元测试**:
- OfflineOrderModel.createOfflineOrder() sessionId参数测试
- OfflineOrderModel.getOrdersBySession() 查询逻辑测试

**集成测试**:
- Controller层完整创建和查询流程测试
- 认证中间件与咨询订单接口集成测试

**端到端测试**:
- 游客从创建到查询的完整流程
- 与普通订单的统一体验测试

### 注意事项

**性能考虑**:
- sessionId字段需要添加数据库索引
- 查询性能应该与现有联系方式查询相当

**安全考虑**:
- sessionId验证逻辑 (optionalAuthMiddleware已处理)
- 确保游客只能查询自己的订单

**数据清理**:
- 现有咨询订单数据需要在部署前清除
- 考虑数据备份策略

### API变更

**创建咨询订单** (保持兼容，新增sessionId支持):
```http
POST /offline-orders
Headers:
  X-Guest-ID: guest_abc123 (必需)
  Authorization: Bearer token (可选)
Body: {
  "productId": "product_id",
  "name": "张三",
  "phone": "13800138000",
  "email": "zhang@example.com",
  "company": "ABC公司",
  "message": "需要咨询"
}
```

**查询咨询订单** (改为X-Guest-ID):
```http
GET /offline-orders/guest
Headers:
  X-Guest-ID: guest_abc123 (必需)
Query: 无需查询参数，自动根据X-Guest-ID查询
```

**移除的接口**:
- 基于phone/email的游客查询方式

---

**下一步**: 运行`*quick-dev`来执行此技术规格的实施。