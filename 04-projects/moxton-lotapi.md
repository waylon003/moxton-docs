# moxton-lotapi 项目状态

> **项目**: Moxton 后端 API
> **路径**: `E:\moxton-lotapi`
> **类型**: Koa API
> **语言**: TypeScript
> **端口**: 3006
> **状态**: 🟢 活跃

## 项目概述

Moxton 后端 API 服务，为商城前端和管理后台提供数据接口。基于 Koa 框架构建的 RESTful API。

## 技术栈

- **框架**: Koa
- **语言**: TypeScript
- **数据库**: MongoDB

## 最近变更 (2025-02-04)

### API 接口重构
- ✅ **批量删除接口重构**
  - 文件: `src/routes/offline-orders.ts`
  - 变更: `DELETE /offline-orders/admin/batch` → `POST /offline-orders/admin/batch/delete`
  - 原因: koa-bodyparser 不支持 DELETE 请求体解析
  - 影响: 管理后台需同步更新调用方式

## 提供的 API

### 线下咨询订单
- `POST /offline-orders` - 提交咨询订单
- `GET /offline-orders/admin` - 获取咨询订单列表（管理员）
- `POST /offline-orders/admin/batch/delete` - 批量删除咨询订单

### 分类
- `GET /categories/tree/active` - 获取活跃分类树

### 购物车
- `POST /cart/items` - 添加购物车项
- `GET /cart` - 获取购物车
- `DELETE /cart/items/:id` - 删除购物车项

### 订单
- `POST /orders/checkout` - 创建结账订单

## 当前任务

查看任务文档:
- [进行中的任务](../01-tasks/active/)
- [待办任务](../01-tasks/backlog/)
- [已完成的任务](../01-tasks/completed/)

## 相关文档

- [API 文档](../02-api/)
- [集成指南](../03-guides/)
- [项目协调](./COORDINATION.md)
