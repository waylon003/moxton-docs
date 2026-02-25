# Tech-Spec: Node.js Backend - Stripe Elements + Payment Intent API Integration

**创建时间:** 2025-12-18
**状�?** 准备开�?**项目负责�?** node后端
**技术栈:** Node.js + TypeScript + Koa + Prisma + MySQL + Stripe

## 概述

### 问题陈述

**🔥 完全重构需�?*：当前支付系统使用传统的 Stripe Checkout Session 模式，需要页面跳转，用户体验不佳。根据项目要求，现有支付接口无前端接入，�?*完全删除现有Stripe代码**，从零重构为更现代的 Stripe Elements + Payment Intent API 模式，提供无缝的站内支付体验�?
### 解决方案

**🚀 彻底重写支付系统**，完全删除现有Stripe相关代码，重新实�?Stripe Elements + Payment Intent API 集成�?- **代码层面**：删�?`src/services/stripe.ts` 等现有文件，从零编写
- **数据层面**：清理现有Stripe支付记录，重新设计数据结�?- **架构层面**：完全基于Payment Intent API重新设计支付流程
- 前端完全自定义支付表单，用户无需离开网站
- 基于现有优秀的订单创建流�?- 支持香港公司服务澳洲市场的业务需�?- 保持混合模式（游�?登录用户）优�?
### 📚 官方文档参�?
**Stripe Payment Intents API 官方文档:**
- **核心API文档**: https://docs.stripe.com/payments/payment-intents
- **API参�?*: https://docs.stripe.com/api/payment_intents
- **Webhook指南**: https://docs.stripe.com/webhooks
- **安全最佳实�?*: https://docs.stripe.com/security

**🔑 关键实现原则（基于官方文档）:**
1. **Payment Intent生命周期**: 严格遵循官方状态流转机�?2. **Client Secret安全**: 仅在前端使用client_secret，不暴露完整API密钥
3. **幂等性处�?*: 使用idempotency key防止重复支付
4. **Webhook同步**: 通过Webhook确保支付状态最终一致�?5. **错误处理**: 按照官方建议处理各种支付场景和异�?
**⚠️ 重要修复说明 (2025-01-18)**:
- **API版本**: 使用2024-06-20（npm包支持的最新稳定版本，官方最新为2024-12-17但类型定义未更新�?- **支付参数**: 修复afterpay_clearpay �?afterpay（afterpay_clearpay已于2024�?月废弃）
- **数据访问**: 修复PaymentIntent.charges �?latest_charge（API变更�?
### 范围 (包含/排除)

**包含:**
- Stripe Payment Intent API 完整集成
- 新的支付意图创建接口
- 支付状态管理和查询接口
- 增强 Webhook 处理
- 支付安全和风控措�?- 错误处理和监控机�?- 完整的测试覆�?
**排除:**
- 前端UI组件实现（仅提供API支持�?- 订单系统修改（订单创建流程保持不变）
- 用户认证系统（保持现有混合认证模式）

**🔥 完全移除和重写范�?**
- **删除所有现有支付服�?*：`src/services/stripe.ts`, `src/services/paypal.ts` �?- **重写所有支付控制器方法**：`src/controllers/Payment.ts` 完全重写
- **重写所有支付路�?*：`src/routes/payments.ts` 完全重写
- **清理所有支付数�?*：数据库中Stripe和PayPal支付记录全部清理
- **从零实现单一支付架构**：仅支持Stripe Elements + Payment Intent API

## 开发上下文

### 代码库模�?
**🔥 完全重写说明�?*
根据项目要求，现�?*所有支付相关代�?*�?*完全删除**，包括：
- `src/services/stripe.ts` - 完全删除
- `src/services/paypal.ts` - 完全删除 (如果存在)
- `src/controllers/Payment.ts` 中的**所有支付方�?* - 完全重写
- `src/routes/payments.ts` 中的**所有支付路�?* - 完全重写
- 数据库中**所有支付记�?* (Stripe + PayPal) - 清理处理

**保留的架构优势：**
- **混合认证模式**: `optionalAuthMiddleware` + `authMiddleware` 双重支持
- **统一响应格式**: 标准化的 `ctx.success()` �?`ctx.error()` 响应
- **事务安全**: Prisma 事务确保数据一致�?- **完善日志**: Winston 日志系统，支持多种输出格�?- **类型安全**: TypeScript 严格模式，完整类型定�?
**🚨 被替换的旧支付流�?**
```
订单创建 �?Stripe Checkout Session �?页面跳转 �?Webhook 回调  (�?将删�?
订单创建 �?PayPal Checkout �?页面跳转 �?回调处理           (�?将删�?
```

**�?全新的目标架�?**
```
订单创建 �?Stripe Elements 支付意图 �?前端 Elements �?站内支付 �?实时确认  (�?从零实现)
```

### 需要参考的文件

**核心文件:**
- `src/controllers/Order.ts` - 现有订单创建逻辑
- `src/models/Payment.ts` - 支付数据模型
- `src/services/stripe.ts` - 现有Stripe服务
- `src/controllers/Payment.ts` - 现有支付控制�?- `src/routes/payments.ts` - 支付路由配置

**配置文件:**
- `.env` - 环境变量配置
- `prisma/schema.prisma` - 数据库模型定�?
### 技术决�?
**1. 支付架构决策:**
- 选择 Stripe Elements + Payment Intent API
- 支持多种支付方式（信用卡、Afterpay等）
- 专门针对澳洲市场优化

**2. 数据模型决策:**
- 复用现有数据表结�?- 扩展支付状态字�?- 保持向后兼容�?
**3. API设计决策:**
- RESTful API 设计
- 统一错误响应格式
- 支持游客和登录用�?
## 实施计划

### 🔥 完全重写任务列表

**阶段1：完全清�?(Day 1)**
- [ ] **任务1**: 删除所有现有支付服务文�?(`src/services/stripe.ts`, `src/services/paypal.ts` �?
- [ ] **任务2**: 清理 `src/controllers/Payment.ts` 中的**所有支付方�?* (Stripe + PayPal)
- [ ] **任务3**: 清理 `src/routes/payments.ts` 中的**所有支付路�?*
- [ ] **任务4**: 清理数据库中**所有支付记�?* (Stripe + PayPal)
- [ ] **任务5**: 移除 package.json 中不必要的支付依�?(PayPal SDK�?

**阶段2：从零重�?Stripe Elements (Day 2-3)**
- [ ] **任务6**: 从零实现 `src/services/StripePaymentService.ts` (仅支持Stripe Elements)
- [ ] **任务7**: 从零重写 `src/controllers/PaymentController.ts` (仅支持Stripe)
- [ ] **任务8**: 重新设计 `src/routes/payments.ts` 路由架构 (仅Stripe路由)
- [ ] **任务9**: 重新设计Payment数据模型和schema (仅Stripe字段)

**阶段3：完善和测试 (Day 4-5)**
- [ ] **任务10**: 实现 Stripe Webhook 处理 - 处理支付状态变�?- [ ] **任务11**: 实现支付安全验证 - 防重复支付和库存验证
- [ ] **任务12**: 添加支付监控和分�?- 指标追踪和错误监�?- [ ] **任务13**: 编写完整的单元测试和集成测试 (仅Stripe功能)

### 验收标准

- [ ] **AC1**: 支付意图创建成功，返回有效的 clientSecret
- [ ] **AC2**: 支付状态准确反映，支持实时查询
- [ ] **AC3**: Webhook 正确处理所有支付事件类�?- [ ] **AC4**: 游客和登录用户都能正常支�?- [ ] **AC5**: 支付失败时，订单状态正确回�?- [ ] **AC6**: 所有支付操作都有完整的审计日志
- [ ] **AC7**: 支付安全措施有效，防止重复支�?- [ ] **AC8**: API 响应时间 < 200ms，错误率 < 0.1%

## 详细实现方案

### 1. Stripe 服务完全重写

**🔥 文件:** `src/services/StripePaymentService.ts` (从零新建，替换现�?`src/services/stripe.ts`)

```typescript
import Stripe from 'stripe'
import { paymentModel } from '../models/Payment'
import { orderModel } from '../models/Order'
import { logger } from '../utils/logger'

export class StripePaymentService {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-06-20', // �?当前npm包支持的最新稳定版�?(注：官方最新为2024-12-17，但npm包类型定义尚未更�?
      typescript: true
    })
  }

  /**
   * 创建支付意图
   * 基于官方文档: https://docs.stripe.com/payments/payment-intents
   * 支持游客和登录用�?   */
  async createPaymentIntent(payload: CreatePaymentIntentPayload): Promise<PaymentIntentResponse> {
    try {
      // 1. 验证订单
      const order = await this.validateOrder(payload.orderId, payload.userId)

      // 2. 防重复支付检�?      await this.validateNoActivePayment(payload.orderId)

      // 3. 库存二次验证
      await this.validateInventory(payload.orderId)

      // 4. 创建支付记录
      const payment = await paymentModel.createPayment({
        orderId: order.id,
        userId: payload.userId, // 支持 null（游客）
        amount: Number(order.amount.total),
        paymentMethod: 'STRIPE',
        currency: 'AUD',
        metadata: JSON.stringify({
          deviceInfo: payload.deviceInfo,
          clientIp: payload.clientIp,
          paymentFlow: 'elements'
        })
      })

      // 5. 创建 Stripe Payment Intent (严格按照官方API规范)
      // 参�? https://docs.stripe.com/api/payment_intents/create
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(Number(order.amount.total) * 100), // 官方要求：最小货币单位（分）
        currency: 'aud', // 澳洲市场
        metadata: {
          orderId: order.id,
          paymentId: payment.id,
          orderNo: order.id,
          guestOrder: order.userId ? 'false' : 'true'
        },
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never' // 官方建议：Elements模式禁用重定�?        },
        payment_method_types: [
          'card',
          'afterpay' // �?修复：使用正确的Afterpay参数 (afterpay_clearpay已于2024�?月废�?
        ],
        // 按照官方最佳实践设�?        confirm: false, // 由前端确�?        setup_future_usage: 'off_session' // 允许未来离线支付
      })

      // 6. 更新支付记录
      await paymentModel.updatePaymentWithStripe(payment.id, {
        paymentIntentId: paymentIntent.id,
        paymentIntentClientSecret: paymentIntent.client_secret
      })

      // 7. 更新订单状�?      await orderModel.updateStatus(order.id, 'PAYMENT_INITIATED')

      logger.info('Payment intent created successfully', {
        orderId: order.id,
        paymentIntentId: paymentIntent.id,
        amount: order.amount.total,
        userId: payload.userId
      })

      return {
        clientSecret: paymentIntent.client_secret,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
        paymentIntentId: paymentIntent.id,
        paymentId: payment.id,
        amount: Number(order.amount.total),
        currency: 'AUD',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      }
    } catch (error) {
      logger.error('Failed to create payment intent', { error, payload })
      throw error
    }
  }

  /**
   * 获取支付意图状�?   * 基于官方文档: https://docs.stripe.com/api/payment_intents/retrieve
   */
  async getPaymentIntentStatus(paymentIntentId: string): Promise<PaymentStatusResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId)

      // 官方状态流�? requires_payment_method �?requires_confirmation �?requires_action �?processing �?succeeded
      return {
        status: paymentIntent.status,
        requiresAction: !!paymentIntent.next_action,
        nextActionType: paymentIntent.next_action?.type,
        lastPaymentError: paymentIntent.last_payment_error?.message,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      }
    } catch (error) {
      logger.error('Failed to get payment intent status', { paymentIntentId, error })
      throw error
    }
  }

  /**
   * 处理支付成功 Webhook
   * 基于官方文档: https://docs.stripe.com/webhooks
   */
  async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      const orderId = paymentIntent.metadata.orderId
      const paymentId = paymentIntent.metadata.paymentId

      await Promise.all([
        // 更新支付状�?- 按照官方最佳实�?        paymentModel.updatePaymentStatus(paymentId, 'SUCCESS', {
          receiptUrl: paymentIntent.charges?.data[0]?.receipt_url,
          chargeId: paymentIntent.charges?.data[0]?.id,
          paidAt: new Date()
        }),

        // 更新订单状�?        orderModel.updateStatus(orderId, 'PAID'),

        // 扣减库存（事务内处理�?        this.deductInventory(orderId)
      ])

      logger.info('Payment processed successfully', {
        orderId,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        chargeId: paymentIntent.charges?.data[0]?.id
      })
    } catch (error) {
      logger.error('Failed to handle payment success', { paymentIntent, error })
      throw error
    }
  }

  /**
   * 处理支付失败 Webhook
   * 基于官方文档处理各种失败场景
   */
  async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      const paymentId = paymentIntent.metadata.paymentId
      const orderId = paymentIntent.metadata.orderId

      // 按照官方建议记录详细错误信息
      await paymentModel.updatePaymentStatus(paymentId, 'FAILED', {
        metadata: JSON.stringify({
          lastPaymentError: paymentIntent.last_payment_error?.message,
          declineCode: paymentIntent.last_payment_error?.decline_code,
          failureReason: paymentIntent.last_payment_error?.type,
          outcome: paymentIntent.charges?.data[0]?.outcome
        })
      })

      // 订单状态保�?PENDING，允许用户重�?      await orderModel.updateStatus(orderId, 'PENDING')

      logger.warn('Payment failed', {
        orderId,
        paymentIntentId: paymentIntent.id,
        error: paymentIntent.last_payment_error?.message,
        declineCode: paymentIntent.last_payment_error?.decline_code
      })
    } catch (error) {
      logger.error('Failed to handle payment failure', { paymentIntent, error })
      throw error
    }
  }

  /**
   * 验证Webhook签名
   * 基于官方安全文档: https://docs.stripe.com/webhooks/signatures
   */
  verifyWebhookSignature(payload: string, signature: string, secret: string): Stripe.Event {
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, secret)
    } catch (error) {
      logger.error('Webhook signature verification failed', { error })
      throw new Error('Invalid webhook signature')
    }
  }

  // 私有方法
  private async validateOrder(orderId: string, userId: string | null) {
    const order = await orderModel.getOrderById(orderId)
    if (!order) {
      throw new Error('Order not found')
    }

    if (order.status !== 'PENDING') {
      throw new Error('Order is not eligible for payment')
    }

    // 验证订单所有权
    if (order.userId !== userId) {
      throw new Error('Access denied: Order does not belong to user')
    }

    return order
  }

  private async validateNoActivePayment(orderId: string) {
    const activePayments = await paymentModel.findActivePayments(orderId)
    if (activePayments.length > 0) {
      throw new Error('Payment already in progress')
    }
  }

  private async validateInventory(orderId: string) {
    // 实现库存验证逻辑
  }

  private async deductInventory(orderId: string) {
    // 实现库存扣减逻辑
  }
}

// 类型定义
interface CreatePaymentIntentPayload {
  orderId: string
  userId: string | null
  deviceInfo: any
  clientIp: string
}

interface PaymentIntentResponse {
  clientSecret: string
  publishableKey: string
  paymentIntentId: string
  paymentId: string
  amount: number
  currency: string
  expiresAt: string
}

// 基于官方API规范的类型定�?interface CreatePaymentIntentPayload {
  orderId: string
  userId: string | null
  deviceInfo: any
  clientIp: string
}

interface PaymentIntentResponse {
  clientSecret: string
  publishableKey: string
  paymentIntentId: string
  paymentId: string
  amount: number
  currency: string
  expiresAt: string
}

interface PaymentStatusResponse {
  status: Stripe.PaymentIntent.Status // 官方状态类�?  requiresAction: boolean
  nextActionType?: string
  lastPaymentError?: string
  amount?: number
  currency?: string
}
```

### 2. 支付控制器完全重�?
**🔥 文件:** `src/controllers/PaymentController.ts` (从零重写，替换现有Stripe方法)

```typescript
import { Context } from 'koa'
import { asyncHandler } from '../middleware/error'
import { stripePaymentService } from '../services/StripePaymentService'
import { logger } from '../utils/logger'

export class PaymentController {
  /**
   * 创建支付意图
   * 支持游客和登录用�?   */
  createPaymentIntent = asyncHandler(async (ctx: Context) => {
    const userId = ctx.user?.id || null // 支持游客
    const { orderId } = ctx.request.body as any

    if (!orderId) {
      return ctx.validationError(['orderId is required'])
    }

    try {
      const result = await stripePaymentService.createPaymentIntent({
        orderId,
        userId,
        deviceInfo: this.extractDeviceInfo(ctx),
        clientIp: ctx.ip
      })

      ctx.success({
        clientSecret: result.clientSecret,
        publishableKey: result.publishableKey,
        paymentIntentId: result.paymentIntentId,
        paymentId: result.paymentId,
        amount: result.amount,
        currency: result.currency,
        expiresAt: result.expiresAt
      }, 'Payment intent created successfully')

    } catch (error: any) {
      logger.error('Payment intent creation failed', {
        orderId,
        userId,
        error: error.message,
        requestId: ctx.state.requestId
      })

      ctx.error(`Failed to create payment intent: ${error.message}`, 400)
    }
  })

  /**
   * 获取支付状�?   */
  getPaymentStatus = asyncHandler(async (ctx: Context) => {
    const { paymentIntentId } = ctx.params

    if (!paymentIntentId) {
      return ctx.validationError(['paymentIntentId is required'])
    }

    try {
      const result = await stripePaymentService.getPaymentIntentStatus(paymentIntentId)

      ctx.success(result, 'Payment status retrieved successfully')
    } catch (error: any) {
      logger.error('Payment status check failed', {
        paymentIntentId,
        error: error.message,
        requestId: ctx.state.requestId
      })

      ctx.error(`Failed to get payment status: ${error.message}`, 500)
    }
  })

  /**
   * 处理 Stripe Webhook
   * 基于官方文档: https://docs.stripe.com/webhooks
   */
  handleStripeWebhook = asyncHandler(async (ctx: Context) => {
    const signature = ctx.headers['stripe-signature'] as string
    const payload = ctx.request.rawBody as string
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      return ctx.error('Stripe webhook secret not configured', 500)
    }

    try {
      // 官方建议：先验证签名再处理事�?      const event = stripePaymentService.verifyWebhookSignature(payload, signature, webhookSecret)

      await this.processWebhookEvent(event)

      // 官方建议：快速返�?00状态码，异步处理事�?      ctx.status(200).send('OK')
    } catch (error: any) {
      logger.error('Stripe webhook processing failed', {
        signature,
        error: error.message,
        requestId: ctx.state.requestId
      })

      // 官方建议：Webhook错误返回400状态码
      ctx.status(400).send(`Webhook Error: ${error.message}`)
    }
  })

  /**
   * 获取支付历史
   */
  getPaymentHistory = asyncHandler(async (ctx: Context) => {
    const userId = ctx.user?.id
    const { pageNum = 1, pageSize = 10, status } = ctx.query as any

    if (!userId) {
      return ctx.forbidden('Authentication required')
    }

    try {
      const result = await paymentModel.findPaymentsByUserId(userId, {
        page: parseInt(String(pageNum)),
        limit: parseInt(String(pageSize)),
        status
      })

      ctx.paginatedSuccess(
        result.list,
        result.total,
        result.pageNum,
        result.pageSize
      )
    } catch (error: any) {
      logger.error('Payment history retrieval failed', {
        userId,
        error: error.message,
        requestId: ctx.state.requestId
      })

      ctx.error(`Failed to get payment history: ${error.message}`, 500)
    }
  })

  // 私有方法
  private extractDeviceInfo(ctx: Context): any {
    return {
      userAgent: ctx.headers['user-agent'],
      ip: ctx.ip,
      timestamp: new Date().toISOString()
    }
  }

  private async processWebhookEvent(event: Stripe.Event) {
    // 官方事件类型: https://docs.stripe.com/api/events/types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await stripePaymentService.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)
        break
      case 'payment_intent.payment_failed':
        await stripePaymentService.handlePaymentFailure(event.data.object as Stripe.PaymentIntent)
        break
      case 'payment_intent.canceled':
        await stripePaymentService.handlePaymentCancellation(event.data.object as Stripe.PaymentIntent)
        break
      case 'payment_intent.requires_action':
        // 需�?D Secure等额外验�?        logger.info('Payment intent requires action', {
          paymentIntentId: event.data.object.id,
          nextAction: (event.data.object as Stripe.PaymentIntent).next_action
        })
        break
      case 'payment_intent.partially_funded':
        // 部分资金到账（适用于复杂支付场景）
        logger.info('Payment intent partially funded', {
          paymentIntentId: event.data.object.id
        })
        break
      default:
        // 官方建议：记录未处理的事件类型，但不抛出错误
        logger.info(`Unhandled Stripe event type: ${event.type}`, {
          eventId: event.id
        })
    }
  }
}

export const paymentController = new PaymentController()
```

### 3. 路由配置完全重写

**🔥 文件:** `src/routes/payments.ts` (完全重写，仅包含Stripe Elements路由)

```typescript
import Router from 'koa-router'
import { paymentController } from '../controllers/Payment'
import { authMiddleware, optionalAuthMiddleware } from '../middleware'
import { rateLimit } from '../middleware/rateLimit'

const router = new Router()

// 🔥 创建支付意图（支持游客和登录用户�?router.post(
  '/stripe/create-intent',
  optionalAuthMiddleware,
  rateLimit({ windowMs: 60000, max: 5 }), // 防滥�?  paymentController.createPaymentIntent
)

// 获取支付状�?router.get(
  '/stripe/status/:paymentIntentId',
  optionalAuthMiddleware,
  paymentController.getPaymentStatus
)

// Stripe Webhook（无需认证，需要速率限制�?router.post(
  '/stripe/webhook',
  rateLimit({ windowMs: 60000, max: 100 }),
  paymentController.handleStripeWebhook
)

// 获取支付历史（需要认证）
router.get(
  '/history',
  authMiddleware,
  paymentController.getPaymentHistory
)

export default router
```

### 4. 数据模型增强

**文件:** `prisma/schema.prisma` (扩展)

```prisma
// 扩展现有 Payment 模型
model Payment {
  id                String   @id @default(cuid())
  paymentNo         String   @unique
  orderId           String
  userId            String?  // 支持游客支付
  amount            Decimal  @db.Decimal(10, 2)
  currency          String   @default("AUD")
  paymentMethod     String   // STRIPE, PAYPAL, OFFLINE
  status            PaymentStatus @default(PENDING)

  // 🔥 Stripe Elements 特定字段
  paymentIntentId       String?  // Stripe Payment Intent ID
  paymentIntentClientSecret String? // 客户端密�?  paymentMethodId       String?  // 支付方法 ID
  lastPaymentError      String? @db.Text // 最后一次支付错�?
  // 现有字段保持不变
  stripePaymentIntentId String? // 保留兼容�?  checkoutSessionId    String?
  providerPaymentId     String?
  receiptUrl           String?

  // 新增字段
  paymentAttemptCount  Int      @default(0)
  deviceInfo           String?  @db.Text // 设备信息 JSON
  clientIp             String?

  // 时间�?  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  paidAt               DateTime?
  refundedAt           DateTime?
  expiresAt            DateTime?  // 支付意图过期时间

  // 关联
  order               Order    @relation(fields: [orderId], references: [id])
  user                User?    @relation(fields: [userId], references: [id])

  @@map("payments")
}

// 扩展现有 Order 模型
model Order {
  // 现有字段保持不变...

  // 🔥 新增支付状态字�?  paymentStatus         OrderPaymentStatus @default(PENDING)
  paymentAttempts       Int                 @default(0)
  lastPaymentAttemptAt  DateTime?
  stripePaymentIntentId String?             // Stripe 支付意图 ID
  paymentId            String?              // 关联的支付记录ID

  // 时间�?  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  paidAt               DateTime?

  // 关联
  user                User?    @relation(fields: [userId], references: [id])
  items               OrderItem[]
  payments            Payment[]

  @@map("orders")
}

// 新增支付状态枚�?enum PaymentStatus {
  PENDING              // 待支�?  PAYMENT_INITIATED    // 支付已启�?  REQUIRES_ACTION      // 需要额外操作（3D Secure�?  PROCESSING           // 处理�?  SUCCESS              // 支付成功
  FAILED               // 支付失败
  CANCELLED            // 支付取消
  REFUNDED             // 已退�?}

enum OrderPaymentStatus {
  PENDING           // 等待支付
  PAYMENT_INITIATED // 支付已启�?  PAYMENT_FAILED    // 支付失败
  PAID              // 已支�?  PARTIALLY_REFUNDED // 部分退�?  FULLY_REFUNDED     // 全额退�?}
```

### 5. 增强的错误处�?
**文件:** `src/errors/PaymentError.ts` (新建)

```typescript
import { AppError } from './AppError'

export class PaymentError extends AppError {
  constructor(
    message: string,
    public paymentIntentId?: string,
    public orderContext?: any,
    public retryable: boolean = false
  ) {
    super(message, 400)
    this.name = 'PaymentError'
  }
}

export class PaymentIntentError extends PaymentError {
  constructor(message: string, paymentIntentId: string, details?: any) {
    super(message, paymentIntentId, details, true)
    this.name = 'PaymentIntentError'
  }
}

export class PaymentSecurityError extends PaymentError {
  constructor(message: string, securityContext?: any) {
    super(message, undefined, securityContext, false)
    this.name = 'PaymentSecurityError'
  }
}

export class PaymentValidationError extends PaymentError {
  constructor(field: string, value: any, reason: string) {
    super(`Invalid ${field}: ${reason}`, undefined, { field, value }, false)
    this.name = 'PaymentValidationError'
  }
}
```

### 6. 支付监控和分�?
**文件:** `src/services/PaymentAnalytics.ts` (新建)

```typescript
import { logger } from '../utils/logger'

export class PaymentAnalytics {
  /**
   * 追踪支付尝试
   */
  trackPaymentAttempt(orderId: string, paymentIntentId: string, context: any) {
    logger.info('Payment attempt initiated', {
      orderId,
      paymentIntentId,
      userId: context.userId,
      amount: context.amount,
      deviceInfo: context.deviceInfo,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * 追踪支付成功
   */
  trackPaymentSuccess(orderId: string, paymentIntentId: string, context: any) {
    logger.info('Payment succeeded', {
      orderId,
      paymentIntentId,
      userId: context.userId,
      amount: context.amount,
      processingTime: context.processingTime,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * 追踪支付失败
   */
  trackPaymentFailure(orderId: string, paymentIntentId: string, error: any, context: any) {
    logger.warn('Payment failed', {
      orderId,
      paymentIntentId,
      userId: context.userId,
      errorCode: error.code,
      errorType: error.type,
      declineCode: error.decline_code,
      amount: context.amount,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * 追踪支付安全事件
   */
  trackSecurityEvent(eventType: string, context: any) {
    logger.warn('Payment security event', {
      eventType,
      orderId: context.orderId,
      paymentIntentId: context.paymentIntentId,
      userId: context.userId,
      ip: context.ip,
      userAgent: context.userAgent,
      riskScore: context.riskScore,
      timestamp: new Date().toISOString()
    })
  }
}

export const paymentAnalytics = new PaymentAnalytics()
```

## 额外上下�?
### 依赖�?
**新增依赖:**
```json
{
  "stripe": "^14.0.0",
  "@types/stripe": "^14.0.0"
}
```

**现有依赖 (保留):**
- Koa.js (Web框架)
- Prisma (ORM)
- Winston (日志)
- bcryptjs (密码加密)

**需要移除的依赖:**
- `@paypal/checkout-server-sdk` - PayPal SDK (完全移除)

### 测试策略

**单元测试:**
- StripePaymentService 的所有方�?- PaymentController 的所有端�?- 错误处理逻辑
- 数据验证逻辑

**集成测试:**
- 完整的支付流程测�?- Webhook 处理测试
- 游客和登录用户支付测�?- 错误场景测试

**端到端测�?**
- 使用 Stripe 测试卡进行完整支付流�?- 支付失败场景测试
- 并发支付测试

### 环境配置

**新增环境变量:**
```env
# 🔥 Stripe 配置 (提供的测试密�?
STRIPE_SECRET_KEY=STRIPE_SECRET_KEY_PLACEHOLDER
STRIPE_PUBLISHABLE_KEY=pk_test_51SWp4fAdUxdJL62WadIF0ekRQWLcoQ0RHijCvfQXePy0QHPt7uqJ407X02vgpVvo0SgAkwMZWEqK13JturY4q8cv0015drns3F
STRIPE_WEBHOOK_SECRET=whsec_xxx  # 需要在Stripe Dashboard中配�?
# 支付配置
PAYMENT_TIMEOUT=1800000  # 30分钟
MAX_PAYMENT_ATTEMPTS=3
```

**🔑 Stripe测试密钥信息:**
- **公钥**: `pk_test_51SWp4f...5drns3F` (用于前端)
- **私钥**: `STRIPE_SECRET_KEY_PLACEHOLDER` (用于后端API调用)
- **环境**: 测试环境 (安全，可公开在代码中)
- **适用地区**: 澳洲市场配置

### 注意事项

**🔒 安全考虑 (基于官方安全指南: https://docs.stripe.com/security):**
- 所有支付操作都有详细日志记�?- 实现防重复支付机制，使用幂等性键
- 支付敏感数据最小化，metadata中不存储敏感信息
- Webhook签名验证确保请求来源可靠
- Client Secret仅在前端使用，不暴露完整API密钥

**�?性能考虑:**
- 支付意图创建 < 200ms
- Webhook 处理异步化，快速返回响�?- 合理的速率限制防止滥用
- 数据库查询优化和索引设计

**🔧 可维护�?**
- 完整的错误处理，遵循官方最佳实�?- 详细的文档注释，引用官方文档链接
- 统一的代码风格和TypeScript严格模式
- 完整的类型定义，使用官方Stripe类型

**📊 监控要求:**
- 支付成功率监控和趋势分析
- 错误率告警和详细错误分类
- 性能指标追踪（响应时间、吞吐量�?- 安全事件监控（异常支付行为、Webhook攻击�?
## 实施检查清�?
### 开发阶�?- [ ] 实现 StripePaymentService 核心功能
- [ ] 创建 PaymentController 并实现所有端�?- [ ] 配置支付路由
- [ ] 扩展数据库模�?- [ ] 实现错误处理�?- [ ] 添加支付监控逻辑

### 测试阶段
- [ ] 编写单元测试 (覆盖�?> 90%)
- [ ] 编写集成测试
- [ ] 配置 Stripe 测试环境
- [ ] 进行端到端测�?- [ ] 性能测试和压力测�?
### 部署阶段
- [ ] 配置生产环境变量
- [ ] 设置 Stripe Webhook 端点
- [ ] 配置监控和告�?- [ ] 进行生产环境验证
- [ ] 文档更新和培�?
**成功标准:**
- 支付成功�?> 95%
- API 响应时间 < 200ms
- 错误�?< 0.1%
- 完整的测试覆�?- 详细的监控和日志

---

**技术规格完成时�?** 2025-12-18
**预计开发周�?** 3-4 �?**维护负责�?** node后端

