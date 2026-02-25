# 跨项目依赖关系

> **更新时间**: 2026-02-08
> **用途**: 清晰展示三个项目之间的 API 依赖和数据流向

## 依赖关系图

```
┌─────────────────────────────────────────────────────────┐
│                    用户访问                              │
└───────────────────────┬─────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌──────────────┐              ┌──────────────┐
│ nuxt-moxton  │              │moxton-lotadmin│
│  (商城前端)   │              │  (管理后台)   │
│    :3000     │              │    :3002     │
└──────┬───────┘              └──────┬───────┘
       │                             │
       │ HTTP API                    │ HTTP API
       │                             │
       └─────────────┬───────────────┘
                     │
                     ▼
            ┌──────────────┐
            │ moxton-lotapi│
            │  (后端 API)   │
            │    :3006      │
            └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │   MongoDB    │
            │  (数据库)     │
            └──────────────┘
```

## API 依赖详情

### nuxt-moxton → moxton-lotapi

| API 端点 | 方法 | 用途 | 状态 |
|---------|------|------|------|
| `/offline-orders` | POST | 提交咨询订单 | ✅ 同步 |
| `/categories/tree/active` | GET | 获取分类树 | ✅ 同步 |
| `/cart/*` | POST/GET/DELETE | 购物车操作 | ✅ 同步 |
| `/orders/checkout` | POST | 结账订单 | ✅ 同步 |

### moxton-lotadmin → moxton-lotapi

| API 端点 | 方法 | 用途 | 状态 |
|---------|------|------|------|
| `/offline-orders/admin` | GET | 获取咨询订单列表 | ✅ 同步 |
| `/offline-orders/admin/batch/delete` | POST | 批量删除咨询订单 | ✅ 同步 |

## 数据模型依赖

### 共享数据实体

| 实体 | 存储位置 | 访问项目 |
|------|----------|----------|
| Product | MongoDB | frontend, admin, backend |
| Category | MongoDB | frontend, admin, backend |
| Cart | MongoDB | frontend, backend |
| Order | MongoDB | frontend, admin, backend |
| OfflineOrder | MongoDB | frontend, admin, backend |

## 接口契约变更流程

当需要修改 API 接口时，按以下顺序执行：

1. **后端优先** - moxton-lotapi 先实现新接口
2. **文档更新** - 更新 `02-api/` 中的 API 文档
3. **前端同步** - nuxt-moxton 实现调用
4. **后台同步** - moxton-lotadmin 实现调用（如需要）
5. **状态更新** - 更新 `COORDINATION.md` 和本文件

## 版本兼容性

| 组件 | 版本要求 | 说明 |
|------|----------|------|
| nuxt-moxton | Node.js 18+ | Nuxt 3 要求 |
| moxton-lotadmin | Node.js 18+ | Vue 3 要求 |
| moxton-lotapi | Node.js 18+ | Koa 要求 |
| MongoDB | 6.0+ | 数据存储 |

## 待解决依赖

当前无待解决的依赖问题。
