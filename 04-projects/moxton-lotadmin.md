# moxton-lotadmin 项目状态

> **项目**: Moxton 管理后台
> **路径**: `E:\moxton-lotadmin`
> **类型**: Vue 3 应用
> **框架**: Soybean Admin
> **端口**: 3002
> **状态**: 🟢 活跃

## 项目概述

Moxton 管理后台，用于管理产品、订单、用户等后台操作。基于 Vue 3 和 Soybean Admin 框架构建。

## 技术栈

- **框架**: Vue 3
- **管理模板**: Soybean Admin
- **语言**: TypeScript

## 最近变更 (2025-02-04)

### API 调用同步
- ✅ **批量删除咨询订单同步**
  - 文件: `src/service/api/consultation-order.ts:178-180`
  - 变更: method `delete` → `post`
  - 变更: url 更新为 `/admin/batch/delete`
  - 状态: 已与后端 API 同步

## 依赖的 API

### 后端 API (moxton-lotapi:3006)
- `POST /offline-orders/admin/batch/delete` - 批量删除咨询订单
- `GET /offline-orders/admin` - 获取咨询订单列表

## 当前任务

查看任务文档:
- [进行中的任务](../01-tasks/active/)
- [待办任务](../01-tasks/backlog/)
- [已完成的任务](../01-tasks/completed/)

## 相关文档

- [API 文档](../02-api/)
- [集成指南](../03-guides/)
- [项目协调](./COORDINATION.md)
