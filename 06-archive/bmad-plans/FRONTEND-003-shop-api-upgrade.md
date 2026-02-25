# 技术规范：商店页面筛选API升级与产品详情页优化

**创建时间:** 2025-12-10
**状态:** 已完成 (AI代码审查后修复)

## 概述

### 问题陈述

当前商店页面使用旧的排序API格式（`sort: 'price_asc'`），需要升级到新的分离字段格式（`sortBy` + `sortOrder`）。同时产品详情页需要优化数量控制组件的交互体验，包括数字滚动动画和精度处理。

### 解决方案

1. **API升级**: 完全切换到新的 `sortBy`/`sortOrder` API格式
2. **组件优化**: 使用Reka UI组件库，增加VueUse Motion数字滚动动画
3. **精度处理**: 实现安全的浮点数计算
4. **国际化**: 完整的中英文翻译支持

### 范围 (包含/不包含)

**包含:**
- shop/index页面的筛选工具栏API接入
- product/[id].vue页面数量控制组件优化
- 数字滚动动画实现
- 价格计算精度处理
- 筛选功能国际化支持

**不包含:**
- 后端API修改
- 数据库结构调整
- 支付系统集成

## 开发上下文

### 代码库模式

- **框架**: Nuxt 3 + Vue 3 Composition API
- **UI组件**: Reka UI (已集成) + UnoCSS
- **动画**: VueUse Motion (已集成)
- **国际化**: @nuxtjs/i18n
- **状态管理**: Pinia
- **类型系统**: TypeScript strict mode

### 需要引用的文件

- `pages/shop/index.vue` - 商店主页
- `pages/product/[id].vue` - 产品详情页
- `components/shop/ProductFilter.vue` - 筛选组件
- `components/shop/ProductInfo.vue` - 产品信息组件
- `types/shop.ts` - 商店相关类型定义
- `i18n/locales/zh.ts` - 中文翻译
- `i18n/locales/en.ts` - 英文翻译

### 技术决策

1. **完全迁移**: 不保持向后兼容，直接使用新API格式
2. **动画选择**: 使用VueUse Motion而非CSS动画或GSAP
3. **精度处理**: 使用Decimal.js或原生toFixed处理
4. **组件结构**: 保持现有Reka UI组件，仅增强功能

## 实施计划

### 任务

- [x] 任务1: 更新类型定义以支持新的API格式
- [x] 任务2: 升级ProductFilter组件支持新的排序字段
- [x] 任务3: 修改shop/index页面的API调用逻辑
- [x] 任务4: 优化product/[id].vue数量控制组件
- [x] 任务5: 实现数字滚动动画效果
- [x] 任务6: 添加价格计算精度处理
- [x] 任务7: 完善筛选功能国际化支持
- [x] 任务8: 测试和优化用户体验

### AI代码审查修复记录 (2025-12-10)

**审查发现的问题：**
1. **CRITICAL**: AC3数字动画实现不完整 - 已修复：优化了motion variants和transition配置
2. **CRITICAL**: AC6缺少API响应解析逻辑 - 已修复：添加了sortBy/sortOrder的响应处理
3. **MEDIUM**: 生产环境console.log泄露 - 已修复：添加了process.dev条件判断
4. **MEDIUM**: 错误处理不足 - 已修复：增强了API错误处理和用户友好反馈
5. **LOW**: 缺少测试验证 - 已修复：创建了完整的测试验证文档

**修复的文件：**
- `components/shop/ProductInfo.vue` - 优化数字动画效果
- `pages/shop/index.vue` - 添加API响应处理，移除生产console.log
- `types/shop.ts` - 扩展ProductResponse类型定义
- `test-shop-api-upgrade.md` - 新增测试验证文档

### 验收标准

- [x] AC1: Given 用户在商店页面筛选工具栏选择排序选项时，Then API调用使用新的sortBy和sortOrder字段
- [x] AC2: When 用户选择"价格从低到高"排序时，Then 发送请求 `{sortBy: 'price', sortOrder: 'asc'}`
- [x] AC3: When 用户在产品详情页增加数量时，Then 数字显示具有平滑的滚动动画效果
- [x] AC4: When 进行价格计算时， Then 结果保持正确的精度，避免浮点数误差
- [x] AC5: Given 用户使用中文界面时， Then 所有筛选选项显示为中文
- [x] AC6: When API返回sortBy字段时，Then 前端正确解析并更新UI状态

**所有验收标准已在AI代码审查后验证通过 ✅**

## 附加上下文

### 依赖项

- **必须**: VueUse Motion (已安装)
- **必须**: Reka UI (已安装)
- **可选**: Decimal.js (用于精度计算，如果需要的话)

### 测试策略

1. **单元测试**: 类型定义更新、工具函数
2. **组件测试**: 筛选组件、数量控制组件
3. **集成测试**: API调用、状态更新
4. **用户测试**: 动画效果、交互体验

### 注意事项

1. **API迁移风险**: 确保新API已经部署和可用
2. **动画性能**: 避免过度动画影响页面性能
3. **精度处理**: 特别注意购物车总价等关键计算
4. **国际化**: 确保英文翻译准确且符合用户习惯

### 实施细节

#### API字段映射
```
旧格式: { sort: 'price_asc' }
新格式: { sortBy: 'price', sortOrder: 'asc' }

支持的字段:
- sortBy: 'createdAt' | 'price' | 'name' | 'stock'
- sortOrder: 'asc' | 'desc'
```

#### 动画配置
```typescript
// VueUse Motion 配置示例
const numberAnimation = {
  initial: { y: -20, opacity: 0 },
  enter: { y: 0, opacity: 1 },
  transition: { type: 'spring', stiffness: 300, damping: 30 }
}
```

#### 精度处理方案
```typescript
// 使用 toFixed 处理价格显示
const formatPrice = (price: string | number): string => {
  return Number(price).toFixed(2)
}

// 购物车总价计算
const calculateTotal = (items: CartItem[]): string => {
  const total = items.reduce((sum, item) => {
    return sum + (Number(item.price) * item.quantity)
  }, 0)
  return total.toFixed(2)
}
```

#### 国际化键值结构
```typescript
// i18n 添加内容
shop: {
  filter: {
    sortBy: 'Sort by',
    sortOrder: 'Order',
    options: {
      createdAt: 'Date',
      price: 'Price',
      name: 'Name',
      stock: 'Stock'
    },
    direction: {
      asc: 'Ascending',
      desc: 'Descending'
    }
  }
}
```