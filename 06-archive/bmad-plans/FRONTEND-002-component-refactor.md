# Tech-Spec: 组件结构重构

**创建时间:** 2025-12-10
**状态:** 已完成

## 概述

### 问题陈述
当前组件结构存在逻辑分组不合理的问题：
- `cart` 组件嵌套在 `shop` 下，但购物车是独立的功能模块
- `product/Info.vue` 位置过深，应该提升到更合理的层级
- 页面结构存在冗余文件（cart-original.vue）

### 解决方案
重新组织组件结构，提高代码的可维护性和逻辑清晰度：
1. 将 `cart` 组件从 `shop` 下抽离，与 `shop` 同级
2. 将 `product/Info.vue` 重构为 `shop/ProductInfo.vue`
3. 清理页面文件，移除 `cart-original.vue`，将 `cart.vue` 重构为 `cart/index.vue`

### 范围（包含/不包含）

**包含：**
- 组件文件结构重构
- 所有相关导入路径更新
- 页面路由结构调整
- 确保功能完整性不受影响

**不包含：**
- 组件内部逻辑修改（仅结构调整）
- 样式修改
- 新功能开发

## 开发上下文

### 代码库模式
- Nuxt 3 项目使用自动导入组件
- 组件路径遵循 PascalCase 命名约定
- 使用 TypeScript 进行类型安全
- 采用 Pinia 进行状态管理

### 需要引用的文件
- `components/shop/cart/CartSidebar.vue`
- `components/shop/product/Info.vue`
- `pages/cart.vue`
- `pages/cart-original.vue`
- `app.vue`

### 技术决策
1. **文件命名:** 保持 PascalCase 约定
2. **路径更新:** 利用 Nuxt 3 的自动导入特性
3. **向后兼容:** 确保所有功能正常工作

## 实施计划

### 任务

- [x] 任务 1: 创建新的组件目录结构
- [x] 任务 2: 移动和重命名组件文件
- [x] 任务 3: 更新页面结构
- [x] 任务 4: 验证所有引用和功能

### 验收标准

- [x] AC 1: Given 所有组件文件移动完成 When 检查新结构 Then 文件位置符合设计要求
- [x] AC 2: Given app.vue 中的导入路径 When 应用启动 Then 购物车功能正常工作
- [x] AC 3: Given 访问 /cart 路由 When 页面加载 Then 购物车页面正常显示
- [x] AC 4: Given 所有引用 When 搜索旧路径 Then 没有遗留的旧路径引用

## 附加上下文

### 依赖关系
- 需要确保 Nuxt 3 开发服务器重启以识别新的组件结构
- 依赖 Pinia store 的正常工作
- 需要更新任何可能的类型引用

### 测试策略
1. 手动测试购物车功能
2. 验证页面路由正常工作
3. 检查控制台是否有导入错误
4. 确认组件在浏览器中正常渲染

### 详细重构步骤

#### 1. 目录结构调整
```
重构前:
components/
├── shop/
│   ├── cart/
│   │   ├── AddToCartButton.vue
│   │   └── CartSidebar.vue
│   ├── product/
│   │   └── Info.vue
│   └── ...其他 shop 组件
└── ...其他组件

重构后:
components/
├── cart/
│   ├── AddToCartButton.vue
│   └── CartSidebar.vue
├── shop/
│   ├── ProductInfo.vue  (从 product/Info.vue 重命名)
│   └── ...其他 shop 组件
└── ...其他组件

pages/
重构前:
├── cart.vue
├── cart-original.vue
└── ...其他页面

重构后:
├── cart/
│   └── index.vue  (从 cart.vue 移动)
└── ...其他页面 (删除 cart-original.vue)
```

#### 2. 路径更新
- `app.vue` 中的导入路径: `~/components/shop/cart/CartSidebar.vue` → `~/components/cart/CartSidebar.vue`
- 搜索并更新任何其他可能的引用

#### 3. 页面重构
- 将 `pages/cart.vue` 移动到 `pages/cart/index.vue`
- 删除 `pages/cart-original.vue`

### 注意事项
1. Nuxt 3 的自动导入应该能处理大部分路径变化
2. 可能需要重启开发服务器以清除缓存
3. 检查任何可能的类型定义文件
4. 验证购物车相关的 store 和 composables 是否正常工作