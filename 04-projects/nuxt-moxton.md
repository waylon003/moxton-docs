# nuxt-moxton 项目状态

> **项目**: Moxton 商城前端
> **路径**: `E:\nuxt-moxton`
> **类型**: Nuxt 3 应用
> **端口**: 3000
> **状态**: 🟢 活跃

## 项目概述

Moxton 官方商城前端，基于 Nuxt 3 框架构建的现代化电商平台，支持产品浏览、购物车、结账等功能。

## 技术栈

- **框架**: Nuxt 3.20.1
- **语言**: TypeScript (strict mode)
- **CSS**: UnoCSS with Wind preset
- **状态管理**: Pinia 3.0.4
- **UI组件**: Reka UI (无样式组件) + UnoCSS (原子化样式)
- **动画**: VueUse Motion

## 最近变更 (2025-02-04)

### 组件优化
- ✅ **ConsultationModal Material 组件化**
  - 文件: `components/shop/ConsultationModal.vue`
  - 变更: 替换为 `UiMaterialInput` / `UiMaterialTextarea`
  - 添加: `novalidate` 禁用浏览器原生验证

- ✅ **CategorySelect 二级菜单优化**
  - 文件: `components/shop/CategorySelect.vue`
  - 添加: 右箭头图标、自动展开选中子菜单
  - 添加: 箭头颜色随选中状态变化

### 布局响应式
- ✅ **Footer 组件平板端布局重构**
  - 文件: `components/layout/Footer.vue`
  - 变更: 外层 grid 移除 `md:grid-cols-2`
  - 变更: 内层 contact grid 改为 `grid-cols-1 lg:grid-cols-2`
  - 添加: `md:px-10` 优化平板端内边距

- ✅ **ProductFilter 平板端横向布局**
  - 文件: `components/shop/ProductFilter.vue`
  - 变更: `xl:flex-row` → `md:flex-row`
  - 变更: `xl:w-auto` → `md:w-auto`

### 产品卡片
- ✅ **ProductCard 高度自适应重构**
  - 文件: `components/shop/ProductCard.vue`
  - 移除: 固定高度和设备检测逻辑
  - 变更: 图片统一使用 1:1 正方形比例
  - 效果: 卡片高度自适应内容

## 依赖的 API

### 后端 API (moxton-lotapi:3006)
- `POST /offline-orders` - 提交咨询订单
- `GET /categories/tree/active` - 获取分类树
- `POST /cart/*` - 购物车操作
- `POST /orders/checkout` - 结账订单

## 当前任务

查看任务文档:
- [进行中的任务](../01-tasks/active/)
- [待办任务](../01-tasks/backlog/)
- [已完成的任务](../01-tasks/completed/)

## 相关文档

- [API 文档](../02-api/)
- [集成指南](../03-guides/)
- [项目协调](./COORDINATION.md)
