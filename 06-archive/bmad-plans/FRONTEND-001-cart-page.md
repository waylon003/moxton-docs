# Tech-Spec: 购物车独立页面

**创建日期:** 2025-12-10
**完成日期:** 2025-12-10
**状态:** 已完成
**作者:** Quick Flow Dev Agent

## 概述

### 问题陈述

当前购物车功能仅以侧边栏形式存在，用户无法获得完整的购物车管理体验。需要一个独立的购物车页面，提供更大的操作空间、更详细的商品信息展示，以及与侧边栏保持一致的设计语言。

### 解决方案

创建 `/cart` 路由的独立购物车页面，复用现有的 `useCart` composable 和设计系统，提供完整的购物车管理功能，包括商品展示、数量修改、批量选择、价格汇总和结算功能。

### 范围 (包含/不包含)

**包含:**
- 独立的购物车页面 (`/cart` 路由)
- 商品列表展示（大图模式）
- 批量选择功能
- 数量修改和删除
- 价格汇总计算
- 结账按钮
- 空购物车状态
- 移动端响应式设计

**不包含:**
- 结账流程（重定向到现有结账页面）
- 购物车分享功能
- 优惠券系统
- 收藏夹功能

## 开发上下文

### 代码库模式

**技术栈:**
- **框架**: Nuxt 3 (SSR enabled)
- **语言**: TypeScript (strict mode)
- **样式**: UnoCSS with Wind preset
- **UI组件**: Reka UI v2.6.1 (NumberFieldRoot, PopoverRoot等)
- **状态管理**: Pinia (通过 useCart composable)
- **动画**: VueUse Motion
- **图标**: Iconify

**设计系统:**
- **主题色**: `#FF6B35` (橙色) + `#111827` (深灰)
- **圆角**: `rounded-lg` (0.625rem)
- **间距**: 使用 UnoCSS spacing 系统
- **字体**: 系统字体，font-weight: medium/semibold
- **阴影**: `shadow-lg`, `shadow-2xl`

**组件模式:**
- Composition API with `<script setup>`
- TypeScript prop definitions
- Scoped styles with CSS custom properties
- Reka UI 组件集成
- 响应式设计 (mobile-first)

### 需要参考的文件

1. **现有购物车组件**: `components/shop/cart/CartSidebar.vue`
   - 复用商品项UI逻辑
   - 复用样式变量和设计模式
   - 复用数量控制和选择逻辑

2. **购物车逻辑**: `composables/useCart.ts`
   - 完整的购物车状态管理
   - API调用和数据处理
   - 选中状态管理

3. **样式系统**: `assets/css/main.css`
   - 颜色变量和主题
   - 响应式断点
   - 动画和过渡

4. **布局组件**: `components/layout/`
   - 导航栏集成购物车图标
   - 面包屑导航
   - 页脚布局

5. **页面结构**: `pages/`
   - 遵循现有页面结构模式
   - SEO meta 信息
   - 国际化支持

### 技术决策

1. **路由策略**: 使用 Nuxt 文件路由 `pages/cart.vue`
2. **状态管理**: 复用现有 `useCart` composable，不创建新的store
3. **组件复用**:
   - 抽取购物车商品项为独立组件 (CartItem.vue)
   - 复用 CartSidebar 的样式逻辑和颜色主题
   - 使用 Reka UI 组件系统：
     - `NumberFieldRoot`, `NumberFieldDecrement`, `NumberFieldInput`, `NumberFieldIncrement` (复用现有)
     - `CheckboxRoot` 替代原生 checkbox (新增)
   - 创建右侧汇总面板组件 (CartSummary.vue)
4. **布局设计** (基于参考图片):
   - **桌面端**: 左右分栏布局
     - 左侧：大图商品卡片列表 (宽度自适应)
     - 右侧：固定宽度汇总面板 (包含全选、统计、金额、结账)
   - **移动端**: 单列布局，底部固定汇总栏
5. **样式策略**:
   - 继承现有的橙色主题 (`#FF6B35`)
   - 使用 UnoCSS 原子类 + scoped styles
   - 保持与 CartSidebar 一致的视觉语言 (圆角、阴影、动画)
   - 大图商品卡片设计，包含商品图片、名称、价格、数量控制
6. **响应式断点**:
   - `md: 768px+` - 开始显示双栏布局
   - `lg: 1024px+` - 完整桌面端体验
   - 移动端使用 sticky 底部汇总栏

## 实施计划

### 任务

- [x] 任务1: 创建购物车页面路由和响应式布局框架 ✅
- [x] 任务2: 实现商品列表展示和响应式布局 ✅
- [x] 任务3: 集成 Reka UI CheckboxRoot 和 NumberField 组件 ✅
- [x] 任务4: 实现批量选择和状态管理 ✅
- [x] 任务5: 创建汇总计算和结账功能 ✅
- [x] 任务6: 实现数量修改和防抖处理 ✅
- [x] 任务7: 实现空购物车和加载状态 ✅
- [x] 任务8: 添加面包屑导航和SEO优化 ✅
- [x] 任务9: 优化样式和用户体验 ✅
- [x] 任务10: 更新购物车侧边栏链接到独立页面 ✅
- [x] 任务11: 实现完整的国际化支持 - 添加中英文文案，替换所有硬编码文本 ✅

### 代码审查跟进 (AI) - 2025-12-10

#### 🔴 Critical Issues (必须修复)

- [x] [AI-Review][Critical] 修复数量控制功能 - pages/cart.vue:219-242 添加数量增减按钮事件处理，集成Reka UI NumberField ✅ 已修复
- [x] [AI-Review][Critical] 实现移除商品功能 - pages/cart.vue:192-197 添加删除按钮点击事件处理 ✅ 已修复
- [x] [AI-Review][Critical] 移除未使用的CartItem组件 - 组件有导入错误且未被使用 ✅ 已修复
- [x] [AI-Review][Critical] 移除未使用的CartSummary等组件 - 清理代码库，移除冗余组件 ✅ 已修复

#### 🟡 Medium Issues (应该修复)

- [x] [AI-Review][Medium] 修复货币单位显示 - pages/cart.vue和CartSummary组件将CNY改为AUD ✅ 已修复
- [x] [AI-Review][Medium] 修复结算逻辑 - 参考CartSidebar实现，使用summary对象而非前端计算 ✅ 已修复
- [x] [AI-Review][Medium] 实现移动端响应式布局 - 当前单列布局适配移动端 ✅ 已修复
- [x] [AI-Review][Medium] 添加性能优化 - 图片懒加载和数量防抖处理已实现 ✅ 已修复

#### 🟢 Low Issues (可以改进)

- [x] [AI-Review][Low] 清理未使用的组件文件 - 移除CartSummary、CartLoading、EmptyCart、MobileCartSummary ✅ 已修复
- [x] [AI-Review][Low] 完善测试数据逻辑 - pages/cart.vue:172-175 空购物车状态处理完整 ✅ 已完成
- [x] [AI-Review][Low] 实现完整国际化支持 - 添加购物车专用i18n文案，替换所有硬编码文本 ✅ 已完成

### 验收标准

- [x] AC1: Given 用户访问 `/cart` 页面时，Then 显示完整的购物车页面布局 ✅
- [x] AC2: Given 购物车有商品时，Then 以响应式卡片列表展示商品信息，底部显示汇总面板 ✅
- [x] AC3: Given 用户点击 Reka UI CheckboxRoot 组件时， Then 切换商品选中状态并更新汇总 ✅
- [x] AC4: Given 用户使用 Reka UI NumberField 组件修改数量时， Then 实时更新商品小计和总金额 ✅
- [x] AC5: Given 用户点击"全选"复选框时， Then 切换所有商品选中状态并更新汇总 ✅
- [x] AC6: Given 购物车为空时， Then 显示空购物车状态和继续购物按钮 ✅
- [x] AC7: Given 用户在移动端访问时， Then 显示优化的移动端布局 ✅
- [x] AC8: Given 用户点击结账按钮时， Then 导航到结账页面（仅选中商品）✅
- [x] AC9: Given 页面加载时， Then 显示加载状态直到购物车数据加载完成 ✅
- [x] AC10: Given 用户在桌面端时， Then 显示完整的汇总面板，包含已选商品数量和总金额 ✅

## 附加上下文

### 依赖关系

**外部依赖:**
- Nuxt 3.20.1+
- Reka UI v2.6.1 (已集成)
- Pinia (已集成)
- UnoCSS (已配置)

**内部依赖:**
- `useCart` composable - 购物车状态管理
- `useCartUIStore` - UI状态管理
- 现有颜色主题和样式变量
- API endpoints (已在 useCart 中定义)

### 测试策略

1. **单元测试**:
   - CartItem 组件的props和事件
   - 价格计算逻辑
   - 响应式布局

2. **集成测试**:
   - 购物车页面与 useCart 的集成
   - 路由导航
   - 状态持久化

3. **端到端测试**:
   - 完整的购物车操作流程
   - 移动端和桌面端体验
   - 边界情况（空购物车、网络错误）

### 性能考虑

1. **懒加载**: 购物车商品图片使用 lazy loading
2. **防抖**: 数量修改使用 300ms 防抖（复用现有逻辑）
3. **缓存**: 利用 Nuxt 的数据缓存机制
4. **优化**: 虚拟滚动（如果商品数量超过50个）

### 国际化

**需要支持的文本:**
- 购物车标题
- 商品信息标签
- 价格和汇总文本
- 按钮文本（继续购物、结账等）
- 空购物车消息

**实现方式:**
- 使用现有的 `@nuxtjs/i18n` 配置
- 复用 `i18n/locales/` 中的购物车相关翻译
- 遵循现有的翻译键命名规范

### SEO 优化

1. **Meta 标签**:
   - title: "购物车 - Moxton Robotics"
   - description: "查看和管理您的购物车中的农业科技产品"
   - robots: "noindex,follow" (购物车页面不需要索引)

2. **结构化数据**:
   - 购物车商品信息
   - 价格信息

3. **性能指标**:
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

### 注释和文档

**代码注释标准:**
- 复杂逻辑添加中文注释
- 组件props使用 JSDoc 格式
- 重要函数说明参数和返回值

**文档要求:**
- 组件使用示例
- Props 和 Events 说明
- 样式自定义指南

---

**下一步行动:** 运行 `dev-spec docs/sprint-artifacts/tech-spec-cart-page.md` 开始实施开发