# Tech-Spec: Vue/Nuxt Frontend - Stripe Elements + 集成方案升级

**创建时间:** 2025-12-18
**状�?** 准备开�?**项目负责�?** node后端
**技术栈:** Vue 3 + Nuxt 3 + TypeScript + Pinia + Reka-UI + Stripe Elements

## 概述

### 问题陈述

基于现有完整�?步结账流程，需要集�?Stripe Elements 支付系统到第3步支付阶段。当前项目已有完善的结账框架、购物车集成和订单管理，需要：
1. 在现有支付步骤（�?步）集成 Stripe Elements
2. 区分购物车结算和订单历史结算两种模式
3. 优化订单创建逻辑，移除购物车验证依赖
4. 增强 checkoutStore 以支持多种结算场�?
### 解决方案

基于现有 **Vue 3 + Nuxt 3 + Reka-UI + Pinia** 架构，在现有4步结账流程基础上集�?**Stripe Elements**�?- 在现有第3�?支付信息"中嵌�?Stripe Elements
- 增强 checkoutStore 支持购物车结�?vs 订单历史结算
- 优化订单创建逻辑：基于提交商品列表验证而非购物车检�?- 移除购物车为空时的重定向逻辑
- 支付成功后自动移除购物车对应商品

### 范围 (包含/排除)

**包含:**
- Stripe Elements 信用卡支付集成到�?�?- �?步新增创建支付意图API调用逻辑
- CheckoutPayment.vue 组件完全重构为真实支付功�?- Reka-UI 组件样式适配和用户体验优�?- 支付状态管理、错误处理和成功反馈
- 移动端响应式支付表单

**排除:**
- ⚠️ **第一步和第二步的任何修改** - UI、逻辑、API调用完全保持现状
- 结账页面基础框架（已存在4步流程和步骤导航�?- 购物车功能和验证逻辑
- 个人信息和配送表单验�?- 步骤间的数据传递机制（使用现有机制�?- 订单管理系统

## 开发上下文

### 现有技术栈分析

**核心技术栈:**
- **Vue 3** - Composition API，响应式系统
- **Nuxt 3** - SSR/SSG/SPA 混合渲染
- **TypeScript** - 类型安全开�?- **Pinia** - 现代状态管�?- **Reka-UI** - 轻量级无样式UI组件�?�?已配�?- **UnoCSS** - 原子化CSS框架
- **Vite** - 快速构建工�?
**现有优势:**
- �?完整�?步结账流程已实现
- �?购物车集成和状态管理完�?- �?Reka-UI 组件库已配置
- �?订单创建API集成完成
- �?响应式设计和移动端适配

### 需要参考的订单响应结构

**现有订单响应格式:**
```typescript
interface OrderResponse {
  id: "ORD17660289583784785"                    // 订单ID
  amount: {                                      // 金额信息
    total: 23,
    currency: "AUD"
  },
  customer: {                                   // 客户信息
    name: "markTest",
    email: "customer@example.com",
    phone: "+61412345678",
    company: "moxtontest",
    isGuest: true
  },
  address: {                                    // 结构化地址
    addressLine1: "Lalaguli Drive",
    addressLine2: "",
    city: "Toormina",
    state: "New South Wales",
    postalCode: "2452",
    country: "Australia",
    countryCode: "AU",
    fullAddress: "Lalaguli Drive, Toormina New South Wales 2452, Australia"
  },
  items: [                                      // 订单商品
    {
      product: {
        id: "product_id",
        name: "真爱�?,
        image: "https://oss.moxton.cn/FLQ/product-image.jpg"
      },
      quantity: 1,
      unitPrice: 23
    }
  ],
  status: "PENDING",                            // 订单状�?  timestamps: {                                 // 时间�?    created: "2025-12-18T03:35:58.380Z",
    updated: "2025-12-18T03:35:58.380Z"
  },
  remarks: "test"                               // 订单备注
}
```

### 现有架构分析

**结账页面当前实现 (pages/checkout/index.vue):**
- �?4步流程：**个人信息(�?�?** �?**配送方�?�?�?** �?**支付信息(�?�?** �?确认
- �?可视化步骤导航，支持步骤间跳�?- �?完整的表单验证逻辑
- �?响应式设计，移动端友�?
**Pinia Store 状态管�?**
- �?**Checkout Store** - 4步流程状态、表单数据、配送选项
- �?**Cart Store** - 购物车CRUD、商品选择、验证机�?- �?**OrderService** - 订单创建API集成，支持游客模�?
**现有问题:**
- �?�?步支付信息为占位组件，缺少真实支付功�?- �?�?步完成后没有创建支付意图的逻辑
- �?未区分购物车结算 vs 订单历史结算场景

### 技术决�?
**1. Stripe Elements 集成策略:**
- ⚠️ **只修改第3�?*：完全替换现有占位组件为 Stripe Elements
- 使用 @stripe/stripe-js �?Payment Intent API
- **仅支持信用卡支付**：不显示其他支付方式选择
- 保持�?Reka-UI 组件风格一�?
**2. API调用流程 (保持第一步第二步不变):**
- **�?步下一�?*：调用现有创建订单API (保持不变)
- **�?步下一�?*：调用新增创建支付意图API (仅新增此逻辑)
- **�?�?*：Stripe Elements 支付确认

**3. 简化支付方�?**
- **仅信用卡支付**：移�?Afterpay、PayPal 等其他支付方�?- **无支付方式选择UI**：直接显示信用卡表单
- **Stripe Payment Element 配置**：仅启用信用卡支付选项

**4. 组件架构增强:**
- ⚠️ **保持�?步和�?步完全不�?*
- 完全重构�?�?CheckoutPayment.vue 组件
- 增强�?步的支付意图创建逻辑
- 使用 Reka-UI 组件替换�?步的自定义UI组件

## 实施计划

### 任务列表

- [ ] **任务1**: 增强 CheckoutStore - 添加结算类型区分（购物车 vs 订单历史�?- [ ] **任务2**: �?步增�?- 添加创建支付意图API调用逻辑
- [ ] **任务3**: �?步完全重�?- 集成 Stripe Elements 信用卡支�?- [ ] **任务4**: 实现 useStripe composable - Stripe Elements 管理
- [ ] **任务5**: Reka-UI 风格适配 - 信用卡表单组�?- [ ] **任务6**: 支付后流程优�?- 自动清理购物车数�?- [ ] **任务7**: 错误处理和用户体�?- 完整的支付错误反�?
### 验收标准

**核心验收标准:**
- [ ] **AC1**: ⚠️ �?步和�?步完全不受影响，UI和逻辑保持现状
- [ ] **AC2**: Stripe Elements 正确集成到第3步，仅显示信用卡支付
- [ ] **AC3**: �?步完成后正确调用创建支付意图API
- [ ] **AC4**: 购物车结算和订单历史结算流程正常
- [ ] **AC5**: 支付成功后自动清理对应购物车数据

**UI和体验标�?**
- [ ] **AC6**: Reka-UI 组件与现有样式保持一�?- [ ] **AC7**: 支付状态实时同步，错误处理友好
- [ ] **AC8**: 移动端体验优化，响应式设计完�?
**安全性标�?**
- [ ] **AC9**: PCI合规，敏感数据不经由前端处理
- [ ] **AC10**: 支付失败时用户体验友好，支持重试

## 详细实现方案

### 1. 增强 CheckoutStore

**文件:** `stores/checkout.ts`

基于现有 CheckoutStore 增加结算类型区分和智能步骤管理：

```typescript
// 新增结算类型枚举
export enum CheckoutType {
  CART = 'cart',           // 购物车结�?  ORDER_HISTORY = 'order_history'  // 订单历史结算
}

export interface CheckoutState {
  // 现有属�?..
  currentStep: number
  completedSteps: Set<number>
  formData: CheckoutFormData

  // 新增属�?  checkoutType: CheckoutType
  orderId?: string  // 用于订单历史结算
  cartItems: CartItem[]  // 购物车商品数�?  orderData?: OrderResponse  // 订单数据（用于历史结算）
}

// 增强�?actions
export const useCheckoutStore = defineStore('checkout', () => {
  // 现有状�?..

  // 新增：设置结算类�?  const setCheckoutType = (type: CheckoutType, options?: {
    orderId?: string
    cartItems?: CartItem[]
    orderData?: OrderResponse
  }) => {
    state.checkoutType = type

    if (options?.orderId) {
      state.orderId = options.orderId
    }

    if (options?.cartItems) {
      state.cartItems = options.cartItems
    }

    if (options?.orderData) {
      state.orderData = options.orderData
    }

    // 智能设置初始步骤
    if (type === CheckoutType.CART) {
      state.currentStep = 0  // 购物车结算从�?步开�?    } else if (type === CheckoutType.ORDER_HISTORY) {
      // 订单历史结算可以从第2步或�?步开�?      // 根据是否有完整的地址信息决定
      if (options?.orderData?.customer && options?.orderData?.address) {
        state.currentStep = 2  // 直接进入支付步骤
      } else {
        state.currentStep = 1  // 从配送步骤开�?      }
    }
  }

  // 增强订单创建逻辑 - 移除购物车验�?  const createOrder = async () => {
    try {
      setLoading(true)
      clearError()

      // 基于结算类型处理商品数据
      let items: OrderItem[]

      if (state.checkoutType === CheckoutType.CART) {
        items = state.cartItems.map(item => ({
          product: item.product,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      } else {
        // 订单历史结算使用现有订单数据
        items = state.orderData?.items || []
      }

      // 🚫 移除购物车验�?- 直接创建订单
      // 后端会验证商品存在性，如果商品不存在会返回相应错误
      const result = await ordersApi.checkout({
        items,
        guestInfo: state.formData.customer,     // �?正确字段名：guestInfo
        shippingAddress: state.formData.address, // �?正确字段名：shippingAddress
        remarks: state.formData.remarks
      })

      if (!result.success) {
        throw new Error(result.message || '订单创建失败')
      }

      const orderData = result.data

      state.orderData = orderData
      return orderData

    } catch (error) {
      // 🔥 增强的错误处�?- 检查API响应结构
      let errorMessage = '订单创建失败'

      if (error.response?.data) {
        // API返回的完整错误响�?        const errorData = error.response.data
        if (errorData.message) {
          errorMessage = errorData.message
        }
        if (errorData.code) {
          console.warn('API错误�?', errorData.code)
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 支付成功后清理购物车数据
  const cleanupCartAfterPayment = async () => {
    if (state.checkoutType === CheckoutType.CART && state.cartItems.length > 0) {
      try {
        // 从购物车中移除已支付的商�?        const cartStore = useCartStore()
        for (const item of state.cartItems) {
          await cartStore.removeItem(item.id)
        }
      } catch (error) {
        console.warn('Failed to cleanup cart after payment:', error)
      }
    }
  }

  return {
    // 现有返回...
    setCheckoutType,
    createOrder,
    cleanupCartAfterPayment
  }
})
```

### 2. 完善页面访问控制和初始化逻辑

**文件:** `pages/checkout/index.vue`

添加完整的页面访问控制和智能初始化逻辑�?
```typescript
// 在组件的 onMounted �?onMounted(async () => {
  try {
    const route = useRoute()
    const router = useRouter()
    const checkoutStore = useCheckoutStore()
    const cartStore = useCartStore()

    // 🔒 页面访问控制：检查访问来�?    if (!route.query.orderId && !route.query.cart) {
      // 既没有订单ID也没有购物车参数，重定向到商�?      await router.push('/shop')
      return
    }

    if (route.query.orderId) {
      // 📋 订单历史结算模式
      const orderId = route.query.orderId as string
      const orderData = await fetchOrderById(orderId)

      if (!orderData) {
        checkoutStore.setError('订单不存在或已过�?)
        return
      }

      checkoutStore.setCheckoutType(CheckoutType.ORDER_HISTORY, {
        orderId,
        orderData
      })

      // 🎯 订单状态驱动的步骤管理（基于实际API状态）
      if (orderData.status === 'PENDING') {
        // 订单已创建但支付未初始化，跳到第2步（创建支付意图�?        checkoutStore.setCurrentStep(1)
      } else if (orderData.status === 'PAID' || orderData.status === 'CONFIRMED') {
        // 订单已支付或已确认，重定向到订单详情
        await router.push(`/orders/${orderId}`)
        return
      } else if (orderData.status === 'CANCELLED') {
        // 订单已取消，显示提示
        checkoutStore.setError('此订单已取消，请重新创建订单')
        await router.push('/cart')
        return
      }

      // 🔄 预填充表单数据（从订单响应中获取�?      if (orderData.customer) {
        checkoutStore.updateFormData('guestInfo', orderData.customer)  // �?正确字段�?      }
      if (orderData.address) {
        checkoutStore.updateFormData('shippingAddress', orderData.address)  // �?正确字段�?      }
    } else if (route.query.cart) {
      // 🛒 购物车结算模�?      await cartStore.fetchCart()
      const selectedItems = cartStore.selectedItems

      if (selectedItems.length === 0) {
        checkoutStore.setError('购物车中没有选中的商品，请先添加商品到购物车')
        return
      }

      checkoutStore.setCheckoutType(CheckoutType.CART, {
        cartItems: selectedItems
      })

      // 购物车结算始终从�?步开�?      checkoutStore.setCurrentStep(0)
    }

    await checkoutStore.initializeCheckout()
  } catch (error) {
    console.error('Checkout initialization failed:', error)
    const checkoutStore = useCheckoutStore()
    checkoutStore.setError('页面初始化失败，请重�?)
  }
})

// 处理步骤间导�?const handleStepChange = async (step: number) => {
  const checkoutStore = useCheckoutStore()

  if (checkoutStore.checkoutType === CheckoutType.CART) {
    // 购物车结算：�?步完成时创建订单
    if (step === 1 && checkoutStore.currentStep === 0) {
      try {
        await checkoutStore.createOrder()
      } catch (error) {
        // 订单创建失败，不跳转步骤
        console.error('Order creation failed:', error)
        return
      }
    }
  }

  checkoutStore.setCurrentStep(step)
}

// 订单获取API - 支持游客和登录用�?const fetchOrderById = async (orderId: string) => {
  try {
    // 构建请求�?- 支持游客和登录用户混合认�?    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    // 使用现有的游客ID管理工具获取或创建游客ID
    const guestId = getOrCreateGuestId()

    // 验证游客ID有效�?    if (!isValidGuestId(guestId)) {
      throw new Error('无效的游客ID，请刷新页面重试')
    }

    // 添加游客ID到请求头（所有用户都需要）
    headers['X-Guest-ID'] = guestId

    // 如果用户已登录，添加JWT令牌
    const auth = useAuth()
    if (auth.isAuthenticated) {
      headers['Authorization'] = `Bearer ${auth.token}`
    }

    // 更新游客ID使用时间
    updateGuestIdUsage()

    const response = await $fetch(`/api/orders/${orderId}`, {
      method: 'GET',
      headers
    })

    return response.success ? response.data : null
  } catch (error) {
    console.error('Failed to fetch order:', error)
    return null
  }
}
```

### 3. Stripe Elements Composable

**文件:** `composables/useStripe.ts`

创建可复用的 Stripe Elements 组合式函数，基于官方最�?Payment Element API�?
```typescript
import { ref, computed } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import type { Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js'

export interface PaymentIntentResponse {
  clientSecret: string      // Stripe客户端密�?  publishableKey: string    // Stripe公钥 (与配置的密钥相同)
  paymentIntentId: string   // Stripe支付意图ID
  paymentId: string         // 本地支付记录ID
  amount: number            // 支付金额 (澳元)
  currency: string          // 货币类型 (AUD)
  expiresAt: string         // 支付意图过期时间 (ISO 8601格式)
}

export function useStripe() {
  const stripe = ref<Stripe | null>(null)
  const elements = ref<StripeElements | null>(null)
  const paymentElement = ref<StripePaymentElement | null>(null)

  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 初始�?Stripe
   */
  const initStripe = async () => {
    try {
      loading.value = true
      error.value = null

      stripe.value = await loadStripe(process.env.STRIPE_PUBLISHABLE_KEY!)
      console.log('Stripe initialized successfully')
    } catch (err) {
      console.error('Failed to initialize Stripe:', err)
      error.value = '支付服务初始化失�?
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建支付 Elements - 基于真实 API 响应
   */
  const createPaymentElements = async (paymentIntent: PaymentIntentResponse) => {
    if (!stripe.value) {
      throw new Error('Stripe not initialized')
    }

    try {
      loading.value = true
      error.value = null

      // Stripe Elements Appearance 配置 - �?Reka-UI 风格匹配
      const appearance = {
        theme: 'flat',  // 使用 flat 主题更适合现代设计
        variables: {
          colorPrimary: '#3b82f6',        // Reka-UI 主色�?          colorBackground: '#ffffff',
          colorText: '#1f2937',
          colorDanger: '#ef4444',
          colorWarning: '#f59e0b',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '16px',
          spacingUnit: '4px',
          borderRadius: '6px',
          focusBoxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
          // 信用卡特定样�?          colorInputText: '#1f2937',
          colorInputBackground: '#ffffff',
          colorInputBorder: '#d1d5db',
          colorInputFocus: '#3b82f6',
          colorError: '#ef4444'
        },
        rules: {
          '.Input': {
            border: '1px solid var(--colorInputBorder)',
            boxShadow: 'none',
            padding: '12px 16px',
            fontSize: '16px',
            transition: 'all 0.2s ease'
          },
          '.Input:focus': {
            borderColor: 'var(--colorInputFocus)',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
          }
        }
      }

      // 创建 Elements 实例 - 使用 API 返回的真实密�?      elements.value = stripe.value.elements({
        appearance,
        clientSecret: paymentIntent.clientSecret,  // 来自 API 响应
        fonts: [
          {
            cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
          }
        ]
      })

      // 创建 Payment Element - 仅信用卡支付
      paymentElement.value = elements.value.create('payment', {
        layout: 'tabs',  // 使用 tabs 布局，适合信用卡支�?        fields: {
          billingDetails: {
            // 使用现有的账单地址信息，不显示重复字段
            name: 'never',
            email: 'never',
            phone: 'never',
            address: {
              country: 'never',  // 不显示国家选择，默认澳�?              postalCode: 'always',
              state: 'always',
              city: 'always',
              line1: 'always',
              line2: 'never'
            }
          }
        },
        // 仅启用信用卡支付
        paymentMethodOrder: ['card'],
        // 信用卡配�?        card: {
          hidePostalCode: false
        }
      })

      return elements.value
    } catch (err) {
      console.error('Failed to create payment elements:', err)
      error.value = '支付表单创建失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 确认支付
   */
  const confirmPayment = async (returnUrl?: string) => {
    if (!stripe.value || !elements.value) {
      throw new Error('Stripe or Elements not initialized')
    }

    try {
      loading.value = true
      error.value = null

      const { error: paymentError } = await stripe.value.confirmPayment({
        elements: elements.value,
        confirmParams: {
          return_url: returnUrl || `${window.location.origin}/payment/success`,
          // 使用现有地址信息
          payment_method_data: {
            billing_details: {
              // �?checkoutStore 获取账单信息
              name: '',  // �?formData.customer.name 获取
              email: '', // �?formData.customer.email 获取
              phone: '', // �?formData.customer.phone 获取
              address: {
                country: 'AU',
                state: '', // �?formData.address.state 获取
                city: '',  // �?formData.address.city 获取
                postal_code: '', // �?formData.address.postalCode 获取
                line1: '', // �?formData.address.addressLine1 获取
                line2: null
              }
            }
          }
        }
      })

      if (paymentError) {
        console.error('Payment confirmation failed:', paymentError)

        // 处理特定错误类型
        switch (paymentError.type) {
          case 'card_error':
            error.value = `卡片错误: ${paymentError.message}`
            break
          case 'validation_error':
            error.value = '请检查支付信息是否正�?
            break
          case 'api_error':
            error.value = '支付服务暂时不可用，请稍后重�?
            break
          case 'rate_limit_error':
            error.value = '请求过于频繁，请稍后重试'
            break
          default:
            error.value = `支付失败: ${paymentError.message}`
        }

        throw paymentError
      }

      return { success: true }
    } catch (err) {
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 挂载支付表单到指定元�?   */
  const mountPaymentElement = (elementId: string) => {
    if (!paymentElement.value) {
      throw new Error('Payment element not created')
    }

    const container = document.getElementById(elementId)
    if (!container) {
      throw new Error(`Element with id '${elementId}' not found`)
    }

    paymentElement.value.mount('#' + elementId)
  }

  /**
   * 销毁支付表�?   */
  const destroyPaymentElement = () => {
    if (paymentElement.value) {
      paymentElement.value.destroy()
      paymentElement.value = null
    }
    if (elements.value) {
      elements.value = null
    }
  }

  // 计算属�?  const isReady = computed(() =>
    stripe.value !== null && elements.value !== null && !loading.value
  )

  const hasError = computed(() => error.value !== null)

  return {
    // 响应式数�?    stripe,
    elements,
    paymentElement,
    loading,
    error,

    // 计算属�?    isReady,
    hasError,

    // 方法
    initStripe,
    createPaymentElements,
    mountPaymentElement,
    confirmPayment,
    destroyPaymentElement
  }
}
```

### 4. 优化�?步布局设计

**文件:** `components/checkout/PaymentStep.vue` (完全替换现有占位组件)

使用两栏布局：左�?Stripe 支付表单，右侧订单信息和账单信息�?
```vue
<template>
  <div class="payment-step">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 左侧：Stripe 支付表单 (2/3) -->
      <div class="lg:col-span-2">
        <div class="payment-header mb-6">
          <h3 class="text-xl font-semibold text-gray-900">支付信息</h3>
          <p class="text-sm text-gray-600 mt-1">
            请输入您的信用卡信息完成支付
          </p>
        </div>

        <!-- Stripe Elements 加载状�?-->
        <div v-if="stripeLoading" class="stripe-loading">
          <div class="animate-pulse">
            <div class="h-32 bg-gray-200 rounded-lg mb-4"></div>
            <div class="h-16 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        <!-- Stripe Elements 错误状�?-->
        <div v-else-if="stripeError" class="error-container">
          <Alert variant="destructive">
            <AlertCircle class="h-4 w-4" />
            <AlertTitle>支付服务暂时不可�?/AlertTitle>
            <AlertDescription>{{ stripeError }}</AlertDescription>
          </Alert>
        </div>

        <!-- Stripe Elements 支付表单 -->
        <div v-else class="payment-form">
          <Card class="mb-6">
            <CardContent class="p-6">
              <div id="payment-element" class="payment-element">
                <!-- Stripe Elements 将挂载到这里 -->
              </div>
            </CardContent>
          </Card>

          <!-- 支付按钮 -->
          <div class="payment-actions">
            <Button
              variant="outline"
              @click="$emit('back')"
              :disabled="processing"
              class="w-full mb-3"
              size="lg"
            >
              返回上一�?            </Button>

            <Button
              @click="processPayment"
              :disabled="!canProcessPayment"
              :loading="processing"
              class="w-full"
              size="lg"
            >
              <Lock class="w-4 h-4 mr-2" />
              确认支付 ${{ formatCurrency(totalAmount) }}
            </Button>
          </div>

          <!-- 安全提示 -->
          <div class="security-info mt-6">
            <div class="flex items-center justify-center space-x-6 text-xs text-gray-500">
              <div class="flex items-center">
                <Lock class="w-3 h-3 mr-1" />
                SSL 加密
              </div>
              <div class="flex items-center">
                <Shield class="w-3 h-3 mr-1" />
                安全支付
              </div>
              <div class="flex items-center">
                <CreditCard class="w-3 h-3 mr-1" />
                PCI DSS 合规
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：订单信息和账单信息 (1/3) -->
      <div class="lg:col-span-1">
        <OrderSummary
          :order-data="orderData"
          :billing-info="checkoutStore.formData"
          :sticky="true"
          class="sticky top-6"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useToast } from '@/composables/use-toast'
import { useCheckoutStore, CheckoutType } from '@/stores/checkout'
import { useStripe } from '@/composables/useStripe'

// Reka-UI 组件导入
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Lock, Shield, CreditCard } from 'lucide-vue-next'

const emit = defineEmits<{
  next: [result: any]
  back: []
  error: [error: Error]
}>()

const checkoutStore = useCheckoutStore()
const { toast } = useToast()

// Stripe 集成
const {
  stripe,
  loading: stripeLoading,
  error: stripeError,
  isReady,
  initStripe,
  createPaymentElements,
  mountPaymentElement,
  confirmPayment,
  destroyPaymentElement
} = useStripe()

// 组件状�?const processing = ref(false)

// 计算属�?const totalAmount = computed(() => {
  return checkoutStore.orderData?.amount.total || 0
})

const canProcessPayment = computed(() => {
  return isReady.value && !processing.value && totalAmount.value > 0
})

/**
 * 初始化支�? */
const initializePayment = async () => {
  if (!checkoutStore.orderData) {
    throw new Error('订单数据不存�?)
  }

  try {
    // 初始�?Stripe
    if (!stripe.value) {
      await initStripe()
    }

    // 创建支付意图 - 使用composable自动处理认证
    const auth = useAuth()

    const response = await paymentsApi.createPaymentIntent({
      orderId: checkoutStore.orderData.id,           // �?订单ID
      userId: auth.isAuthenticated ? auth.user?.id : null, // �?游客用户为null，登录用户为用户ID
      deviceInfo: {                                    // �?设备信息对象
        userAgent: navigator.userAgent,               // 浏览器用户代�?        ip: null                                      // IP地址（后端会自动获取�?      },
      clientIp: null                                   // �?客户端IP（后端会自动获取�?    })

    if (!response.success) {
      // 🔥 增强的错误处�?- 基于API文档的错误响应结�?      let errorMessage = '创建支付意图失败'

      if (response.message) {
        errorMessage = response.message
      }
      if (response.code) {
        console.warn('支付意图创建错误�?', response.code)
        // 可以根据特定错误码提供更友好的提�?        switch (response.code) {
          case 400:
            if (errorMessage.includes('Order not found')) {
              errorMessage = '订单不存在，请检查订单信�?
            } else if (errorMessage.includes('not eligible for payment')) {
              errorMessage = '订单状态不允许支付，请联系客服'
            }
            break
          case 403:
            errorMessage = '访问被拒绝，请检查登录状�?
            break
        }
      }

      throw new Error(errorMessage)
    }

    // 创建 Stripe Elements
    await createPaymentElements(response.data)

    // 挂载支付表单
    await nextTick(() => {
      mountPaymentElement('payment-element')
    })

  } catch (error) {
    console.error('Payment initialization failed:', error)
    throw error
  }
}

/**
 * 处理支付
 */
const processPayment = async () => {
  try {
    processing.value = true

    const returnUrl = `${window.location.origin}/checkout/success?orderId=${checkoutStore.orderData?.id}&type=${checkoutStore.checkoutType}`

    const result = await confirmPayment(returnUrl)

    if (result.success) {
      // 支付成功，清理购物车数据
      if (checkoutStore.checkoutType === CheckoutType.CART) {
        await checkoutStore.cleanupCartAfterPayment()
      }

      emit('next', {
        success: true,
        method: 'stripe',
        paymentIntentId: stripe.value?.paymentIntent?.id
      })

      toast({
        title: '支付成功',
        description: '您的订单已成功支�?,
      })
    }
  } catch (error) {
    console.error('Payment processing failed:', error)

    toast({
      title: '支付失败',
      description: error.message || '支付处理失败，请重试',
      variant: 'destructive',
    })

    emit('error', error as Error)
  } finally {
    processing.value = false
  }
}

/**
 * 格式化金�? */
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
  }).format(amount)
}

/**
 * 组件挂载
 */
onMounted(async () => {
  await initializePayment()
})

/**
 * 组件卸载
 */
onUnmounted(() => {
  destroyPaymentElement()
})
</script>

### 5. 订单信息展示组件

**文件:** `components/checkout/OrderSummary.vue`

显示订单摘要和账单信息，支持粘性定位：

```vue
<template>
  <div class="order-summary">
    <!-- 订单商品列表 -->
    <Card class="mb-6">
      <CardContent class="p-4">
        <h4 class="font-semibold text-gray-900 mb-4">订单商品</h4>
        <div v-for="item in orderItems" :key="item.id" class="flex items-center space-x-4 mb-4 last:mb-0">
          <div class="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
            <img
              :src="getProductImage(item.product.image)"
              :alt="item.product.name"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h5 class="font-medium text-gray-900 truncate">{{ item.product.name }}</h5>
            <p class="text-sm text-gray-500">数量: {{ item.quantity }}</p>
          </div>
          <div class="text-right">
            <p class="font-semibold text-gray-900">${{ formatCurrency(item.unitPrice * item.quantity) }}</p>
            <p class="text-sm text-gray-500">${{ formatCurrency(item.unitPrice) }} each</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 账单信息 -->
    <Card class="mb-6">
      <CardContent class="p-4">
        <h4 class="font-semibold text-gray-900 mb-4">账单信息</h4>

        <div class="space-y-3">
          <div>
            <p class="text-sm font-medium text-gray-700">收货�?/p>
            <p class="text-gray-900">{{ billingInfo.customer?.name }}</p>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-700">联系方式</p>
            <p class="text-gray-900">{{ billingInfo.customer?.email }}</p>
            <p class="text-gray-900">{{ billingInfo.customer?.phone }}</p>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-700">收货地址</p>
            <p class="text-gray-900 whitespace-pre-line">
              {{ billingInfo.address?.fullAddress }}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 价格明细 -->
    <Card>
      <CardContent class="p-4">
        <h4 class="font-semibold text-gray-900 mb-4">价格明细</h4>

        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">商品小计</span>
            <span class="text-gray-900">${{ formatCurrency(subtotal) }}</span>
          </div>

          <div class="flex justify-between text-sm">
            <span class="text-gray-600">配送费�?/span>
            <span class="text-green-600 font-medium">免运�?/span>
          </div>

          <div class="border-t pt-2 mt-2">
            <div class="flex justify-between">
              <span class="font-semibold text-gray-900">订单总额</span>
              <span class="font-bold text-lg text-blue-600">${{ formatCurrency(totalAmount) }}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 备注信息 -->
    <div v-if="billingInfo.remarks" class="mt-4 p-3 bg-blue-50 rounded-lg">
      <p class="text-sm font-medium text-blue-900 mb-1">订单备注</p>
      <p class="text-sm text-blue-700">{{ billingInfo.remarks }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  orderData?: any
  billingInfo: {
    customer?: any
    address?: any
    remarks?: string
  }
  sticky?: boolean
}

const props = defineProps<Props>()

// 计算属�?const orderItems = computed(() => {
  return props.orderData?.items || []
})

const subtotal = computed(() => {
  return orderItems.value.reduce((total: number, item: any) => {
    return total + (item.unitPrice * item.quantity)
  }, 0)
})

const totalAmount = computed(() => {
  return props.orderData?.amount?.total || subtotal.value
})

// 工具函数
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
  }).format(amount)
}

const getProductImage = (imagePath: string) => {
  if (imagePath?.startsWith('http')) {
    return imagePath
  }
  if (!imagePath || imagePath === 'h') {
    return 'https://oss.moxton.cn/FLQ/default-product.jpg'
  }
  return `https://oss.moxton.cn/FLQ/${imagePath}`
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'https://oss.moxton.cn/FLQ/default-product.jpg'
}
</script>

<style scoped>
.order-summary {
  max-width: 400px;
}

.sticky {
  position: sticky;
  top: 1.5rem; /* top-6 */
}
</style>
```

<style scoped>
.payment-step {
  max-width: 1200px;
  margin: 0 auto;
}

.payment-element {
  min-height: 300px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.stripe-loading {
  padding: 24px;
}

.error-container {
  padding: 24px;
}

.payment-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 768px) {
  .payment-actions {
    gap: 8px;
  }

  .payment-element {
    padding: 12px;
    min-height: 250px;
  }
}
</style>
```

### 5. 环境配置和依赖项

**新增依赖�?**

```json
{
  "@stripe/stripe-js": "^3.0.0",
  "lucide-vue-next": "^0.263.1"
}
```

**环境变量配置:**

```bash
# .env
STRIPE_PUBLISHABLE_KEY=pk_test_51SWp4fAdUxdJL62WadIF0ekRQWLcoQ0RHijCvfQXePy0QHPt7uqJ407X02vgpVvo0SgAkwMZWEqK13JturY4q8cv0015drns3F
STRIPE_SECRET_KEY=STRIPE_SECRET_KEY_PLACEHOLDER
```

**Reka-UI 组件配置:**

需要确保项目中已配置以�?Reka-UI 组件�?
```typescript
// plugins/reka-ui.ts
import { Button } from 'reka-ui'
import { Card, CardContent } from 'reka-ui'
import { Alert, AlertDescription, AlertTitle } from 'reka-ui'

export {
  Button,
  Card,
  CardContent,
  Alert,
  AlertDescription,
  AlertTitle
}
```

### 6. 依赖项升级说�?
**现有依赖:**
- �?Vue 3, Nuxt 3, TypeScript - 已配�?- �?Pinia - 购物车和结账状态管理已完成
- �?Reka-UI - 已安装并配置
- �?UnoCSS - 原子化CSS框架已配�?
**新增组件映射:**
- 替换 `UiGradientButton` �?`Button` (Reka-UI)
- 替换 `UiMaterialInput` �?`Input` (Reka-UI)
- 替换 `UiMaterialSelect` �?`Select` (Reka-UI)
- 替换 `UiMaterialTextarea` �?`Textarea` (Reka-UI)

## 额外上下�?
### 类型定义

**文件:** `types/checkout.ts` (新增)

```typescript
import type { OrderResponse, CartItem } from './cart'

export enum CheckoutType {
  CART = 'cart',
  ORDER_HISTORY = 'order_history'
}

export interface CheckoutFormData {
  guestInfo: {               // �?重命名为guestInfo以匹配API
    name: string
    email: string
    phone: string
    company?: string
    isGuest: boolean
  }
  shippingAddress: {         // �?重命名为shippingAddress以匹配API
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
    countryCode: string
  }
  remarks?: string
}

export interface CheckoutState {
  checkoutType: CheckoutType
  currentStep: number
  completedSteps: Set<number>
  formData: CheckoutFormData
  orderId?: string
  cartItems: CartItem[]
  orderData?: OrderResponse
  loading: boolean
  error: string | null
  processing: boolean
}

export interface PaymentIntentResponse {
  clientSecret: string
  publishableKey: string
  paymentIntentId: string
  amount: number
  currency: string
}
```

### API 端点集成

#### 核心支付 API 端点

1. **POST /api/payments/stripe/create-intent** �?   ```typescript
   // 创建支付意图 (�?步下一步调�?
   // 认证: 支持游客模式和登录用户混合认�?   // 权限: 订单必须属于当前用户或用户为订单创建�?
   Request:
   {
     orderId: string  // 必需 - 订单ID
   }

   Response:
   {
     "code": 200,
     "message": "Payment intent created successfully",
     "data": {
       "clientSecret": "pi_1234567890_secret_xxxxxxxxxxxxxxxxxxxx",  // Stripe客户端密�?       "publishableKey": "pk_test_51SWp4fAdUxdJL62WadIF0ekRQWLcoQ0RHijCvfQXePy0QHPt7uqJ407X02vgpVvo0SgAkwMZWEqK13JturY4q8cv0015drns3F", // Stripe公钥
       "paymentIntentId": "pi_1234567890",                                    // 支付意图ID
       "paymentId": "clt123456789",                                          // 本地支付记录ID
       "amount": 599.98,                                                    // 支付金额 (澳元)
       "currency": "AUD",                                                   // 货币类型
       "expiresAt": "2025-12-18T15:30:00.000Z"                            // 支付意图过期时间 (30分钟)
     },
     "success": true,
     "timestamp": "2025-12-18T10:00:00.000Z"
   }

   // 错误响应:
   {
     "code": 400,
     "message": "Failed to create payment intent: Order not found",
     "timestamp": "2025-12-18T10:00:00.000Z",
     "success": false
   }
   ```

2. **GET /api/payments/stripe/status/:paymentIntentId**
   ```typescript
   // 查询支付状�?   // 认证: 无需认证 (公共端点)

   Response:
   {
     "code": 200,
     "message": "Payment status retrieved successfully",
     "data": {
       "status": "requires_payment_method",      // Stripe官方状�?       "requiresAction": false,                  // 是否需要额外操�?       "nextActionType": null,                   // 下一步操作类�?       "lastPaymentError": null,                 // 最后一次支付错�?       "amount": 59998,                         // 金额 (分为单位)
       "currency": "aud"                         // 货币
     },
     "success": true,
     "timestamp": "2025-12-18T10:00:00.000Z"
   }
   ```

#### 支持订单管理 API 端点

3. **GET /api/orders/:id** (用于订单历史结算)
   ```typescript
   // 获取订单详情，支持订单状态驱动的步骤管理
   // 返回的订单状态驱动步骤管理：
   // - PENDING: 跳转到第2步创建支付意�?   // - PAYMENT_INITIATED: 跳转到第3步进行支�?   // - COMPLETED: 跳转到订单详情页

   Response:
   {
     "code": 200,
     "message": "Order retrieved successfully",
     "data": {
       "id": "ORD17660289583784785",
       "status": "PENDING",  // 关键状态字�?       "amount": { "total": 599.98, "currency": "AUD" },
       "customer": { /* ... */ },
       "address": { /* ... */ },
       "items": [ /* ... */ ],
       // ... 其他订单字段
     },
     "success": true,
     "timestamp": "2025-12-18T10:00:00.000Z"
   }
   ```

4. **POST /api/orders/checkout** (现有，第1步下一步调�?
   ```typescript
   // 创建订单 - 移除购物车验证，基于提交商品创建
   // 后端验证商品存在性，不存在则返回错误
   // 认证: 支持游客模式和登录用户混合认�?
   Request:
   {
     items: OrderItem[],
     customer: CustomerInfo,
     address: AddressInfo,
     remarks?: string
   }

   Response:
   {
     "code": 200,
     "message": "Order created successfully",
     "data": OrderResponse,
     "success": true,
     "timestamp": "2025-12-18T10:00:00.000Z"
   }
   ```

#### 🔒 认证和头部信息说�?
**混合认证模式要求 - 集成现有游客ID工具**:
```typescript
import { getOrCreateGuestId, updateGuestIdUsage, getGuestInfo, isValidGuestId } from '~/utils/guestId'

// 通用认证头部构建函数
const buildAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  // 使用现有工具获取游客ID
  const guestId = getOrCreateGuestId()

  // 验证游客ID有效�?  if (!isValidGuestId(guestId)) {
    throw new Error('无效的游客ID，请刷新页面重试')
  }

  // 添加游客ID到请求头（所有用户都需要）
  headers['X-Guest-ID'] = guestId

  // 如果用户已登录，添加JWT令牌
  const auth = useAuth()
  if (auth.isAuthenticated) {
    headers['Authorization'] = `Bearer ${auth.token}`
  }

  // 更新游客ID使用时间
  updateGuestIdUsage()

  return headers
}

// 游客用户请求头（自动获取�?const guestHeaders = buildAuthHeaders()
// 结果: {
//   'Content-Type': 'application/json',
//   'X-Guest-ID': '通过getOrCreateGuestId()获取的真实游客ID'
// }

// 登录用户请求头（自动获取�?const userHeaders = buildAuthHeaders()
// 结果: {
//   'Content-Type': 'application/json',
//   'Authorization': `Bearer ${jwt_token}`,
//   'X-Guest-ID': '通过getOrCreateGuestId()获取的真实游客ID'
// }
```

**订单权限验证**:
- 用户只能访问自己创建的订�?- 游客只能访问自己创建的订�?- 系统自动验证订单归属关系

#### �?常见错误类型

- `400` - `orderId is required` - 缺少订单ID
- `400` - `Failed to create payment intent: Order not found` - 订单不存�?- `400` - `Failed to create payment intent: Order is not eligible for payment` - 订单状态不允许支付
- `400` - `Failed to create payment intent: Payment already in progress` - 支付已在进行�?- `403` - `Access denied: Order does not belong to user` - 订单不属于当前用�?- `404` - `Payment intent not found` - 支付意图不存�?
### Payment Intent API 集成规范

#### 混合认证模式实施指南

**�?步创建支付意图的完整实现**:

```typescript
// composables/usePaymentIntent.ts
import type { PaymentIntentResponse } from '~/types/checkout'
import { getOrCreateGuestId, updateGuestIdUsage, getGuestInfo, isValidGuestId } from '~/utils/guestId'

export function usePaymentIntent() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 创建支付意图 - 支持混合认证模式，集成现有游客ID工具
   */
  const createPaymentIntent = async (orderId: string): Promise<PaymentIntentResponse> => {
    try {
      loading.value = true
      error.value = null

      // 构建请求�?- 支持游客和登录用户混合认�?      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }

      // 添加认证信息
      const auth = useAuth()
      if (auth.isAuthenticated) {
        // 登录用户使用 JWT 令牌
        headers['Authorization'] = `Bearer ${auth.token}`
      }

      // 使用现有的游客ID管理工具获取或创建游客ID
      const guestId = getOrCreateGuestId()

      // 验证游客ID有效�?      if (!isValidGuestId(guestId)) {
        throw new Error('无效的游客ID，请刷新页面重试')
      }

      // 添加游客ID到请求头
      headers['X-Guest-ID'] = guestId

      // 更新游客ID使用时间
      updateGuestIdUsage()

      const response = await $fetch('/api/payments/stripe/create-intent', {
        method: 'POST',
        headers,
        body: JSON.stringify({ orderId })
      })

      if (!response.success) {
        throw new Error(response.message || '创建支付意图失败')
      }

      return response.data as PaymentIntentResponse
    } catch (err) {
      error.value = err.message || '创建支付意图时发生错�?
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取支付状�?   */
  const getPaymentStatus = async (paymentIntentId: string) => {
    try {
      const response = await $fetch(`/api/payments/stripe/status/${paymentIntentId}`)

      if (!response.success) {
        throw new Error(response.message || '获取支付状态失�?)
      }

      return response.data
    } catch (err) {
      error.value = err.message || '获取支付状态时发生错误'
      throw err
    }
  }

  /**
   * 支付状态轮�?- 最多轮�?分钟
   */
  const pollPaymentStatus = async (
    paymentIntentId: string,
    maxAttempts = 150, // �?秒轮询一次，最�?分钟
    interval = 2000
  ): Promise<{ success: boolean; status: string; data?: any }> => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await getPaymentStatus(paymentIntentId)

        // 支付成功
        if (response.status === 'succeeded') {
          return { success: true, status: response.status, data: response }
        }

        // 支付失败或取�?        if (['canceled', 'requires_payment_method'].includes(response.status)) {
          return { success: false, status: response.status, data: response }
        }

        // 支付处理中，继续轮询
        if (['requires_confirmation', 'requires_action', 'processing'].includes(response.status)) {
          await new Promise(resolve => setTimeout(resolve, interval))
          continue
        }

        // 未知状态，继续轮询
        await new Promise(resolve => setTimeout(resolve, interval))
      } catch (error) {
        // 轮询失败，记录但继续
        console.error('Payment status poll error:', error)
        await new Promise(resolve => setTimeout(resolve, interval))
      }
    }

    // 轮询超时
    return { success: false, status: 'timeout' }
  }

  /**
   * 获取游客信息 - 使用现有工具
   */
  const getGuestInformation = () => {
    return getGuestInfo()
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    createPaymentIntent,
    getPaymentStatus,
    pollPaymentStatus,
    getGuestInformation
  }
}
```

#### 订单创建 API 调用优化

**优化 OrderService 中的错误处理**:

```typescript
// services/orderService.ts
import { getOrCreateGuestId, updateGuestIdUsage, isValidGuestId } from '~/utils/guestId'

export class OrderService {
  private apiBase: string

  constructor() {
    this.apiBase = useRuntimeConfig().public.apiBase
  }

  /**
   * 创建订单 - 支持混合认证，集成现有游客ID工具
   */
  async createOrder(orderData: any): Promise<any> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }

      // 添加认证信息
      const auth = useAuth()
      if (auth.isAuthenticated) {
        headers['Authorization'] = `Bearer ${auth.token}`
      }

      // 使用现有游客ID管理工具获取或创建游客ID
      const guestId = getOrCreateGuestId()

      // 验证游客ID有效�?      if (!isValidGuestId(guestId)) {
        throw new Error('无效的游客ID，请刷新页面重试')
      }

      // 添加游客ID到请求头
      headers['X-Guest-ID'] = guestId

      // 更新游客ID使用时间
      updateGuestIdUsage()

      const response = await $fetch(`${this.apiBase}/orders/checkout`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      })

      // 🔥 重要：直接传递后端错误信息，不进行前端过�?      if (!response.success) {
        throw new Error(response.message || '订单创建失败')
      }

      return response.data
    } catch (error) {
      console.error('Order creation failed:', error)
      throw error
    }
  }
}
```

#### 订单状态驱动的流程优化

**基于最新API的订单状态流�?*:

```mermaid
graph TD
    A[PENDING] -->|�?步完成| B[PAYMENT_INITIATED]
    B -->|Stripe支付成功| C[PROCESSING]
    C -->|Webhook处理| D[PAID]
    D -->|自动确认| E[CONFIRMED]
    E --> F[SHIPPED]
    F --> G[DELIVERED]

    B -->|支付失败| H[FAILED]
    A -->|用户取消| I[CANCELLED]
    H -->|用户重试| B

    style A fill:#fbbf24
    style B fill:#3b82f6
    style C fill:#8b5cf6
    style D fill:#10b981
    style E fill:#10b981
    style H fill:#ef4444
    style I fill:#6b7280
```

**结账页面订单状态处理逻辑**:

```typescript
// pages/checkout/index.vue
import { getGuestInfo } from '~/utils/guestId'

// 🎯 增强的订单状态驱动的步骤管理
const handleOrderStatusFlow = async (orderData: any, orderId: string) => {
  const router = useRouter()
  const checkoutStore = useCheckoutStore()

  switch (orderData.status) {
    case 'PENDING':
      // 订单已创建但支付未初始化
      // 跳到�?步（创建支付意图�?      console.log('📍 订单状�? PENDING �?跳到�?步创建支付意�?)
      checkoutStore.setCurrentStep(1)

      // 预填充表单数�?      if (orderData.customer) {
        checkoutStore.updateFormData('guestInfo', orderData.customer)  // �?正确字段�?      }
      if (orderData.address) {
        checkoutStore.updateFormData('shippingAddress', orderData.address)  // �?正确字段�?      }
      break

    case 'PAID':
      // 订单已支付，跳转到订单详�?      console.log('�?订单状�? PAID �?跳到订单详情')
      await router.push(`/orders/${orderId}`)
      return

    case 'CONFIRMED':
      // 订单已确认，跳转到订单详�?      console.log('�?订单状�? CONFIRMED �?跳到订单详情')
      await router.push(`/orders/${orderId}`)
      return

    case 'PROCESSING':
      // 支付处理中，显示处理状�?      console.log('�?订单状�? PROCESSING �?支付处理�?)
      checkoutStore.setCurrentStep(2) // 保持在支付步�?      // 可以显示处理中状态，不允许重新支�?      break

    case 'FAILED':
      // 支付失败，允许重�?      console.log('�?订单状�? FAILED �?允许重试支付')
      checkoutStore.setCurrentStep(1) // 回到�?步重新创建支付意�?
      // 显示失败信息
      const toast = useToast()
      toast({
        title: '支付失败',
        description: '支付未能完成，请重试或更换支付方�?,
        variant: 'destructive'
      })
      break

    case 'CANCELLED':
      // 订单已取消，跳转到首页或购物�?      console.log('🚫 订单状�? CANCELLED �?订单已取�?)
      const toast = useToast()
      toast({
        title: '订单已取�?,
        description: '此订单已被取消，请重新创建订�?,
        variant: 'destructive'
      })
      await router.push('/cart')
      break

    default:
      console.warn('未知订单状�?', orderData.status)
      checkoutStore.setCurrentStep(0) // 回到第一�?  }
}

// 🔄 结账页面初始化逻辑优化
onMounted(async () => {
  const loading = ref(true)

  try {
    const route = useRoute()

    if (route.query.order) {
      // 📋 订单历史结算模式
      const orderId = route.query.order as string
      console.log('🔄 初始化订单历史结算模�? orderId:', orderId)

      // 获取订单详情，支持订单状态驱动的步骤管理
      const response = await $fetch(`/api/orders/${orderId}`)

      if (response.success) {
        const orderData = response.data
        checkoutStore.setOrderId(orderId)

        // 🎯 使用增强的订单状态处理逻辑
        await handleOrderStatusFlow(orderData, orderId)
      } else {
        throw new Error(response.message || '获取订单信息失败')
      }

    } else if (route.query.cart) {
      // 🛒 购物车结算模�?      console.log('🛒 初始化购物车结算模式')
      await cartStore.fetchCart()
      checkoutStore.setCheckoutType('cart')

      if (cartStore.items.length === 0) {
        // 购物车为空时显示友好提示而不是重定向
        const toast = useToast()
        toast({
          title: '购物车为�?,
          description: '请先添加商品到购物车再进行结�?,
          variant: 'default'
        })
        await router.push('/products')
        return
      }
    }

  } catch (error) {
    console.error('结账页面初始化失�?', error)
    const toast = useToast()
    toast({
      title: '初始化失�?,
      description: error.message || '结账页面加载失败，请刷新重试',
      variant: 'destructive'
    })
  } finally {
    loading.value = false
  }
})
```

**游客状态检查和处理**:

```typescript
// 🎯 基于游客信息的个性化处理
const handleGuestSpecificLogic = () => {
  const guestInfo = getGuestInfo()

  if (guestInfo.isNew) {
    console.log('🆕 新游客检测，显示首次用户提示')
    const toast = useToast()
    toast({
      title: '欢迎来到 Moxton Robotics',
      description: '您正在以游客身份购物，结账后会自动创建账�?,
      variant: 'default',
      duration: 5000
    })
  } else {
    console.log('🔄 返回游客检测，欢迎回来')
  }

  // 可以根据游客信息进行个性化推荐或优�?  return guestInfo
}
```

**�?步完成时的状态更�?*:

```typescript
// �?步完成后的支付意图创建和状态管�?const handleStep2Complete = async (orderId: string) => {
  try {
    console.log('🎯 �?步完成，开始创建支付意�?)

    // 创建支付意图
    const paymentIntent = await paymentIntentComposable.createPaymentIntent(orderId)

    // 验证支付意图数据
    if (!paymentIntent.clientSecret || !paymentIntent.publishableKey) {
      throw new Error('支付意图数据不完�?)
    }

    // 检查过期时�?    const expiresAt = new Date(paymentIntent.expiresAt)
    const now = new Date()
    const timeUntilExpiry = expiresAt.getTime() - now.getTime()

    if (timeUntilExpiry < 0) {
      throw new Error('支付意图已过期，请重新创�?)
    }

    // 存储支付意图信息
    checkoutStore.setPaymentIntent(paymentIntent)

    // 更新订单状态到 PAYMENT_INITIATED（可选，后端会自动更新）
    console.log('💳 支付意图创建成功�?4小时内有�?)

    // 跳转到第3�?    checkoutStore.setCurrentStep(2)

    return paymentIntent

  } catch (error) {
    console.error('创建支付意图失败:', error)

    // 显示错误信息
    const toast = useToast()
    toast({
      title: '支付初始化失�?,
      description: error.message || '无法创建支付意图，请重试',
      variant: 'destructive'
    })

    throw error
  }
}
```

#### 错误处理和用户体验优�?
**统一的错误处理机�?- 包含游客ID相关错误**:

```typescript
// composables/useErrorHandler.ts
import { resetGuestId, getGuestInfo } from '~/utils/guestId'

export function useErrorHandler() {
  const toast = useToast()
  const router = useRouter()

  const handleError = (error: Error, context?: string) => {
    console.error(`Error in ${context}:`, error)

    // 根据错误类型显示不同的用户友好提�?    const errorMessage = error.message.toLowerCase()

    // 🎯 订单相关错误
    if (errorMessage.includes('order not found')) {
      toast({
        title: '订单不存�?,
        description: '请检查订单ID是否正确，或重新开始购物流�?,
        variant: 'destructive'
      })
    } else if (errorMessage.includes('not eligible for payment')) {
      toast({
        title: '订单状态异�?,
        description: '此订单暂时无法支付，请联系客�?,
        variant: 'destructive'
      })
    } else if (errorMessage.includes('payment already in progress')) {
      toast({
        title: '支付处理�?,
        description: '请勿重复提交，正在处理您的支�?,
        variant: 'warning'
      })
    } else if (errorMessage.includes('does not belong to user')) {
      toast({
        title: '访问被拒�?,
        description: '您无权访问此订单，请检查登录状�?,
        variant: 'destructive'
      })

    // 🔐 游客ID相关错误
    } else if (errorMessage.includes('无效的游客id') || errorMessage.includes('invalid guest id')) {
      toast({
        title: '游客身份验证失败',
        description: '正在重新生成游客身份，请稍�?..',
        variant: 'warning'
      })

      // 自动重置游客ID
      setTimeout(() => {
        const newGuestId = resetGuestId()
        console.log('🔄 已重置游客ID:', newGuestId)

        toast({
          title: '身份已重�?,
          description: '请重试您的操�?,
          variant: 'default'
        })
      }, 2000)

    } else if (errorMessage.includes('guest-id') || errorMessage.includes('x-guest-id')) {
      toast({
        title: '游客身份验证失败',
        description: '游客身份信息丢失，正在重新生�?..',
        variant: 'warning'
      })

      // 重新创建游客身份
      setTimeout(() => {
        const guestInfo = getGuestInfo()
        if (guestInfo.isNew) {
          toast({
            title: '身份已重�?,
            description: '请重新开始您的操�?,
            variant: 'default'
          })
        }
      }, 1500)

    } else if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
      toast({
        title: '身份验证失败',
        description: '请重新登录或刷新页面重试',
        variant: 'destructive'
      })

      // 如果是登录用户，清除认证信息
      const auth = useAuth()
      if (auth.isAuthenticated) {
        auth.logout()
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }

    // 💳 支付相关错误
    } else if (errorMessage.includes('payment intent not found')) {
      toast({
        title: '支付信息丢失',
        description: '支付会话已过期，请重新创建支�?,
        variant: 'destructive'
      })

    } else if (errorMessage.includes('payment intent expired') || errorMessage.includes('expired')) {
      toast({
        title: '支付已过�?,
        description: '支付链接已失效，请重新创建支�?,
        variant: 'warning'
      })

    } else if (errorMessage.includes('stripe') && errorMessage.includes('error')) {
      toast({
        title: '支付处理失败',
        description: '支付服务商返回错误，请重试或更换支付方式',
        variant: 'destructive'
      })

    // 🌐 网络和服务器错误
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      toast({
        title: '网络连接失败',
        description: '请检查网络连接后重试',
        variant: 'warning'
      })

    } else if (errorMessage.includes('server') || errorMessage.includes('500')) {
      toast({
        title: '服务器错�?,
        description: '服务器暂时无法处理请求，请稍后重�?,
        variant: 'destructive'
      })

    } else if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      toast({
        title: '请求过于频繁',
        description: '请稍等片刻后再试',
        variant: 'warning'
      })

    // 🛒 购物车相关错�?    } else if (errorMessage.includes('cart') && errorMessage.includes('empty')) {
      toast({
        title: '购物车为�?,
        description: '请先添加商品到购物车',
        variant: 'default'
      })
      setTimeout(() => {
        router.push('/products')
      }, 2000)

    } else if (errorMessage.includes('stock') || errorMessage.includes('inventory')) {
      toast({
        title: '库存不足',
        description: '部分商品库存不足，请调整购买数量',
        variant: 'warning'
      })

    } else {
      // 通用错误提示
      toast({
        title: '操作失败',
        description: error.message || '发生了未知错误，请重�?,
        variant: 'destructive'
      })
    }
  }

  /**
   * 游客ID错误恢复机制
   */
  const handleGuestIdError = async (error: Error): Promise<boolean> => {
    const errorMessage = error.message.toLowerCase()

    if (errorMessage.includes('guest') || errorMessage.includes('unauthorized')) {
      try {
        console.log('🔄 尝试恢复游客ID错误...')

        // 重置游客ID
        const newGuestId = resetGuestId()
        console.log('�?游客ID已重�?', newGuestId)

        return true
      } catch (recoveryError) {
        console.error('�?游客ID恢复失败:', recoveryError)
        return false
      }
    }

    return false
  }

  /**
   * 自动重试机制（用于可恢复的错误）
   */
  const autoRetry = async (
    operation: () => Promise<any>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<any> => {
    let lastError: Error

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error

        // 检查是否为可恢复的错误
        const isRecoverable = await handleGuestIdError(error)

        if (!isRecoverable || attempt === maxRetries) {
          break
        }

        console.log(`🔄 操作失败�?{delay}ms后重�?(${attempt}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, delay))

        // 指数退�?        delay *= 2
      }
    }

    throw lastError
  }

  return {
    handleError,
    handleGuestIdError,
    autoRetry
  }
}
```

### 测试策略

#### 单元测试

**文件:** `tests/composables/useStripe.spec.ts`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { useStripe } from '~/composables/useStripe'

describe('useStripe', () => {
  it('should initialize Stripe correctly', async () => {
    // Mock Stripe
    vi.mock('@stripe/stripe-js', () => ({
      loadStripe: vi.fn().mockResolvedValue({
        elements: vi.fn().mockReturnValue({
          create: vi.fn().mockReturnValue({
            mount: vi.fn(),
            destroy: vi.fn()
          })
        })
      })
    }))

    const { initStripe, stripe, loading, error } = useStripe()

    await initStripe()

    expect(loading.value).toBe(false)
    expect(stripe.value).toBeTruthy()
    expect(error.value).toBe(null)
  })

  it('should handle Stripe initialization failure', async () => {
    vi.mock('@stripe/stripe-js', () => ({
      loadStripe: vi.fn().mockRejectedValue(new Error('Network error'))
    }))

    const { initStripe, error } = useStripe()

    await initStripe()

    expect(error.value).toBe('支付服务初始化失�?)
  })
})
```

**文件:** `tests/stores/checkout.spec.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCheckoutStore, CheckoutType } from '~/stores/checkout'

describe('Checkout Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should set checkout type and initial step correctly', () => {
    const store = useCheckoutStore()

    // 购物车结算模�?    store.setCheckoutType(CheckoutType.CART, {
      cartItems: [{ id: '1', quantity: 2, product: { id: 'p1', name: 'Test' } }]
    })

    expect(store.checkoutType).toBe(CheckoutType.CART)
    expect(store.currentStep).toBe(0)
    expect(store.cartItems).toHaveLength(1)

    // 订单历史结算模式
    store.setCheckoutType(CheckoutType.ORDER_HISTORY, {
      orderId: 'ORD123',
      orderData: {
        id: 'ORD123',
        customer: { name: 'Test User', email: 'test@example.com', phone: '+61412345678', isGuest: true },
        address: { addressLine1: '123 Test St', city: 'Sydney', state: 'NSW', postalCode: '2000', country: 'Australia', countryCode: 'AU', fullAddress: '123 Test St, Sydney NSW 2000, Australia' },
        items: [],
        amount: { total: 100, currency: 'AUD' },
        status: 'PENDING',
        timestamps: { created: '2024-01-01T00:00:00Z', updated: '2024-01-01T00:00:00Z' },
        remarks: ''
      }
    })

    expect(store.checkoutType).toBe(CheckoutType.ORDER_HISTORY)
    expect(store.currentStep).toBe(2) // 有完整地址，直接进入支付步�?    expect(store.orderId).toBe('ORD123')
  })
})
```

#### 集成测试

**文件:** `tests/integration/checkout-flow.spec.ts`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CheckoutPage from '~/pages/checkout/index.vue'

describe('Checkout Flow Integration', () => {
  it('should handle cart checkout flow', async () => {
    // Mock cart data
    vi.mocked(useCartStore).mockReturnValue({
      selectedItems: [
        { id: '1', quantity: 2, product: { id: 'p1', name: 'Test Product' }, unitPrice: 50 }
      ],
      fetchCart: vi.fn().mockResolvedValue(true)
    } as any)

    const wrapper = mount(CheckoutPage)

    // 验证初始状�?    expect(wrapper.vm.checkoutStore.checkoutType).toBe(CheckoutType.CART)
    expect(wrapper.vm.checkoutStore.currentStep).toBe(0)

    // 模拟步骤1完成
    await wrapper.vm.handleStepChange(1)

    // 验证订单创建被调�?    expect(wrapper.vm.checkoutStore.createOrder).toHaveBeenCalled()
  })

  it('should handle order history checkout flow', async () => {
    // Mock URL with orderId
    vi.mocked(useRoute).mockReturnValue({
      query: { orderId: 'ORD123' }
    } as any)

    // Mock order data
    vi.mocked($fetch).mockResolvedValue({
      success: true,
      data: {
        id: 'ORD123',
        customer: { name: 'Test User' },
        address: { addressLine1: '123 Test St' },
        // ... 其他订单数据
      }
    })

    const wrapper = mount(CheckoutPage)

    // 验证结算类型和步�?    expect(wrapper.vm.checkoutStore.checkoutType).toBe(CheckoutType.ORDER_HISTORY)
    expect(wrapper.vm.checkoutStore.currentStep).toBe(2) // 有完整地址
  })
})
```

### 部署注意事项

#### 1. 环境变量安全
- Stripe 密钥不应提交到代码库
- 使用生产环境�?Stripe 密钥
- 配置适当的后�?Webhook 端点

#### 2. 性能优化
- Stripe SDK 按需加载
- 支付表单组件懒加�?- 图片和资源优�?
#### 3. 错误监控
- 集成 Sentry 或类似监控工�?- 记录支付失败事件
- 设置支付成功率警�?
## 实施检查清�?
### 开发阶�?- [ ] 安装 @stripe/stripe-js �?lucide-vue-next 依赖
- [ ] 增强 CheckoutStore 添加结算类型区分
- [ ] 创建 useStripe composable
- [ ] 实现 PaymentStep.vue 组件（替换占位组件）
- [ ] 更新结账页面初始化逻辑
- [ ] 优化订单创建逻辑
- [ ] 配置 Reka-UI 组件样式

### 测试阶段
- [ ] useStripe 单元测试
- [ ] CheckoutStore 状态管理测�?- [ ] 结账流程集成测试
- [ ] Stripe 支付功能测试（测试环境）
- [ ] 购物车结�?vs 订单历史结算测试
- [ ] 移动端响应式测试

### 部署阶段
- [ ] 配置生产环境 Stripe 密钥
- [ ] 实现 Webhook 端点
- [ ] 设置支付状态监�?- [ ] 性能监控配置
- [ ] 用户测试和反馈收�?
### 成功标准
- Stripe Elements 正确集成到第3�?- 购物车结算和订单历史结算流程正常
- 支付成功后购物车自动清理
- 结账页面不再因购物车为空而重定向
- 移动端体验良�?- 支付成功�?> 95%

---

**技术规格更新完成时�?** 2025-12-18
**预计开发周�?** 1-2 �?**维护负责�?** node后端
