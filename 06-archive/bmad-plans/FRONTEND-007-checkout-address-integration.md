# Tech-Spec: Checkout页面与地址补全集成

**创建日期:** 2025-12-16
**状态:** 准备开发
**优先级:** 高

## 📋 概述

### 问题陈述
当前系统缺乏完整的用户结算流程，用户需要从购物车直接跳转到订单创建，没有专门的Checkout页面来填写个人信息、收货地址、选择配送方式和支付。需要创建一个完整的Checkout页面来提升用户体验。

### 解决方案
创建一个多步骤的Checkout页面，集成地址补全功能，使用Reka-UI组件构建，保持橙色主题风格，专门为澳大利亚用户优化。

### 范围界定

**✅ 包含功能:**
- 个人信息填写表单（游客/用户）
- 地址补全功能（澳大利亚专用）
- 结构化地址数据提交
- 配送方式选择（仅海运，包邮）
- 与现有购物车系统集成
- 响应式设计（移动端优先）

**🚫 不包含功能:**
- 支付网关集成（Stripe接入 - TODO）
- 地址编辑/保存功能
- 多种配送方式实时计价
- 优惠券系统
- 订单历史查看

## 🏗️ 开发上下文

### 代码库模式
基于现有Nuxt 3项目架构：
- **框架**: Nuxt 3 + Vue 3 Composition API
- **样式**: UnoCSS + 橙色主题 (#FF6B35)
- **组件**: Reka-UI (已集成 v2.6.1)
- **状态管理**: Pinia
- **认证**: 混合模式 (JWT + X-Guest-ID)
- **API基地址**: `http://localhost:3033`

### 需要参考的文件
- `pages/cart/index.vue` - 购物车集成模式
- `services/cartService.ts` - API调用模式
- `API_DOCUMENTATION.md` - 接口文档
- `components/cart/CartSidebar.vue` - 购物车组件模式
- `nuxt.config.ts` - 项目配置
- `uno.config.ts` - 样式配置

### 技术决策

**组件库选择**: Reka-UI
- 已集成在项目中 (v2.6.1)
- 提供无样式的基础组件
- 支持主题定制
- 良好的TypeScript支持

**地址补全集成**: 现有API
- 使用 `GET /address/autocomplete?country=au`
- 防抖处理 (300ms)
- 本地缓存机制

**样式系统**: UnoCSS + 橙色主题
- 主色: `#FF6B35` (primary-500)
- 悬停: `#E85A28` (primary-600)
- 使用现有的Tailwind-like utilities

## 🚀 实现计划

### 任务分解

#### 任务1: Checkout页面路由和布局
- [ ] 创建 `pages/checkout/index.vue`
- [ ] 设置页面元数据和SEO
- [ ] 实现基础布局和进度指示器
- [ ] 添加面包屑导航

#### 任务2: 地址补全组件开发
- [ ] 创建 `components/checkout/AddressAutocomplete.vue`
- [ ] 集成 `/address/autocomplete` API
- [ ] 实现防抖搜索 (300ms)
- [ ] 添加地址选择和自动填充
- [ ] 本地缓存常用地址

#### 任务3: 个人信息表单组件
- [ ] 创建 `components/checkout/PersonalInfoForm.vue`
- [ ] 使用Reka-UI Input, Select组件
- [ ] 实现表单验证
- [ ] 支持游客和用户模式
- [ ] 澳大利亚手机号验证

#### 任务4: 结算流程逻辑
- [ ] 创建 `stores/checkout.ts` 状态管理
- [ ] 实现多步骤表单切换
- [ ] 与购物车系统集成
- [ ] 表单数据收集和验证

#### 任务5: 订单创建集成
- [ ] 调用 `POST /orders/checkout` API
- [ ] 处理混合认证模式
- [ ] 错误处理和用户反馈
- [ ] 订单创建成功后跳转

#### 任务6: 配送选择页面
- [ ] 创建配送方式选择组件
- [ ] 标准配送选项（默认选中）
- [ ] 运费显示为 0 元（包邮）

#### 任务7: 支付页面占位
- [ ] 创建支付步骤占位页面
- [ ] 显示订单摘要
- [ ] TODO: Stripe集成预留
- [ ] 订单确认页面跳转

#### 任务8: 样式和主题
- [ ] 扩展UnoCSS配置
- [ ] 实现橙色主题一致性
- [ ] 响应式设计优化
- [ ] 加载状态和动画效果

### 验收标准

#### AC1: 完整的Checkout流程
**Given** 用户在购物车页面点击"结算"
**When** 用户进入Checkout页面
**Then** 显示进度指示器，第一步为"个人信息和收货地址"

**Given** 用户在第一步完成个人信息和地址填写
**When** 用户点击"继续到配送"
**Then** 系统调用 `POST /orders/checkout` 创建订单，成功后跳转到配送选择

**Given** 用户在配送页面看到标准配送选项（默认选中）
**When** 用户点击"继续到支付"
**Then** 跳转到支付占位页面，显示订单摘要，运费显示为 0 元

#### AC2: 地址补全功能
**Given** 用户在地址输入框输入 "Sydney Opera"
**When** 用户停止输入300ms后
**Then** 系统调用 `/address/autocomplete?input=Sydney Opera&country=au` 并显示建议列表

**Given** 用户点击地址建议
**When** 地址被选择
**Then** 自动填充表单字段：addressLine1, city, state, postalCode, country

#### AC3: 表单验证
**Given** 用户提交表单但必填字段为空
**When** 点击提交按钮
**Then** 显示错误提示，阻止提交

**Given** 用户输入澳大利亚手机号格式错误
**When** 输入完成后
**Then** 显示"请输入有效的澳大利亚手机号码"错误

#### AC4: 响应式设计
**Given** 用户在移动设备访问
**When** 加载Checkout页面
**Then** 页面适配移动端，表单垂直排列，按钮全宽

## 📦 依赖关系

### 现有依赖
- `"reka-ui": "^2.6.1"` - UI组件库
- `"@pinia/nuxt": "^0.5.5"` - 状态管理
- `"@nuxtjs/i18n": "^8.5.5"` - 国际化
- `"unocss": "^0.65.1"` - 样式框架

### API依赖
- `GET /address/autocomplete` - 地址补全
- `POST /orders/checkout` - 订单创建
- `GET /cart` - 购物车数据
- 混合认证中间件 (JWT + X-Guest-ID)

### 潜在新增依赖
- 可能需要表单验证库 (如 `vee-validate`)
- 可能需要加载动画库 (如 `vue-loading-overlay`)

## 🧪 测试策略

### 单元测试
- 地址补全组件API调用
- 表单验证逻辑
- 状态管理actions

### 集成测试
- Checkout流程端到端测试
- 订单创建API集成
- 购物车到Checkout数据传递

### 用户测试
- 移动端体验测试
- 地址补全易用性测试
- 表单填写流程测试

## 📝 额外上下文

### API响应格式示例

#### 地址补全响应
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "suggestions": [
      {
        "place_id": "ChIJ3c5SiJN2EmsRBfyfZgdnSyI",
        "description": "Sydney Opera House, Bennelong Point, Sydney NSW, Australia",
        "structuredAddress": {
          "addressLine1": "Bennelong Point",
          "addressLine2": "Sydney Opera House",
          "city": "Sydney",
          "state": "NSW",
          "postalCode": "2000",
          "country": "Australia",
          "countryCode": "AU",
          "fullAddress": "Bennelong Point, Sydney Opera House, Sydney NSW 2000, Australia"
        }
      }
    ]
  },
  "success": true
}
```

#### 订单创建请求
```json
{
  "guestInfo": {
    "name": "张三",
    "email": "guest@example.com",
    "phone": "+61412345678",
    "company": "ABC Company"
  },
  "shippingAddress": {
    "addressLine1": "Bennelong Point",
    "city": "Sydney",
    "state": "NSW",
    "postalCode": "2000",
    "country": "Australia",
    "countryCode": "AU"
  },
  "remarks": "请尽快发货"
}
```

### 澳大利亚地址验证规则
- **邮政编码**: 4位数字 (如 2000, 3000)
- **州/省代码**: NSW, VIC, QLD, SA, WA, TAS, NT, ACT
- **手机号格式**: +61 4xx xxx xxx 或 04xx xxx xxx
- **地址格式**: 街道号码 + 街道名称 + 郊区 + 州 + 邮编

### 性能考虑
- 地址补全API调用频率限制 (1次/300ms)
- 本地缓存地址建议 (TTL: 1小时)
- 图片懒加载和组件懒加载
- 表单数据本地存储防止丢失

### 安全考虑
- API输入验证和清理
- XSS防护
- CSRF保护
- 敏感数据加密传输

### 后续扩展计划
- Stripe支付集成
- 地址簿管理
- 订单跟踪功能
- 多语言支持扩展

---

**下一步行动**: 使用 `quick-dev` 工作流开始实现此技术规格

**预计开发时间**: 2-3天 (前两步功能)

**风险评估**: 低风险，API已存在且功能完整