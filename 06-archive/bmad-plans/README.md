# BMAD 开发计划归档

本目录包含之前使用 BMAD (BMM) 系统产生的开发计划文档。

## 归档时间

2026-02-08

## 归档原因

这些开发计划文档中的大部分功能已经实现完成，将它们从活跃任务目录中移除，保持任务系统的清晰和简洁。

## 文档列表

### 前端任务 (FRONTEND)

- `FRONTEND-001-cart-page.md` - 购物车独立页面
- `FRONTEND-002-component-refactor.md` - 组件重构
- `FRONTEND-003-shop-api-upgrade.md` - 商城 API 升级
- `FRONTEND-004-shop-page-enhancement.md` - 商城页面增强
- `FRONTEND-005-cart-delete-refactor.md` - 购物车删除重构
- `FRONTEND-006-cart-backend-calculation.md` - 购物车后端计算
- `FRONTEND-007-checkout-address-integration.md` - 结账地址集成
- `FRONTEND-008-cart-refactor-to-stores.md` - 购物车重构到 stores
- `FRONTEND-009-frontend-stripe-elements.md` - 前端 Stripe Elements

### 后端任务 (BACKEND)

- `BACKEND-001-offline-orders-enhancement.md` - 线下订单增强
- `BACKEND-002-order-address-optimization.md` - 订单地址优化
- `BACKEND-003-backend-stripe-elements.md` - 后端 Stripe Elements
- `BACKEND-004-order-payment-integration-fix.md` - 订单支付集成修复
- `BACKEND-005-offline-order-feature.md` - 线下订单功能
- `BACKEND-006-product-tags.md` - 产品标签
- `BACKEND-007-offline-order-guest-id-unification.md` - 线下订单 guest ID 统一
- `BACKEND-008-cart-api-response-standardization.md` - 购物车 API 响应标准化
- `BACKEND-009-cart-api-code-review.md` - 购物车 API 代码审查
- `BACKEND-010-offline-orders-enhancement.md` - 线下订单增强
- `BACKEND-011-api-clean-documentation.md` - API 清理文档

### 管理后台任务 (ADMIN)

- `ADMIN-001-product-tags-enhancement.md` - 产品标签增强
- `ADMIN-002-consultation-order-management.md` - 咨询订单管理
- `ADMIN-003-axios-error-fix.md` - Axios 错误修复
- `ADMIN-004-consultation-order-delete.md` - 咨询订单删除
- `ADMIN-005-consultation-order-enhancement.md` - 咨询订单增强
- `ADMIN-006-consultation-order-history-enhancement.md` - 咨询订单历史增强

## 参考价值

这些文档虽然不再作为活跃任务，但仍然具有参考价值：

1. **功能记录** - 记录了已实现功能的设计思路
2. **技术方案** - 可作为类似功能的技术参考
3. **历史追踪** - 了解项目的发展历程

## 使用方式

如需参考这些文档：

1. 直接在 `06-archive/bmad-plans/` 目录中查看
2. 或使用搜索工具查找相关内容
3. 创建新任务时可参考这些文档的结构

## 创建新任务

如需创建新的开发计划：

```bash
# 1. 从模板复制
cd E:\moxton-docs
cp 01-tasks/templates/tech-spec.md 01-tasks/active/FRONTEND-001-new-feature.md

# 2. 编辑任务详情
# 填写任务描述、技术方案、验收标准等

# 3. 更新状态
# 更新 01-tasks/STATUS.md
```

---

**归档完成时间**: 2026-02-08
**文档数量**: 26 个
**状态**: 已归档，不再活跃
