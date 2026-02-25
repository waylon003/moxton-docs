# 在线订单 + Stripe 支付模块修复方案（可实施）

**文档目的**
- 明确在线订单与 Stripe 支付模块的修复目标、范围与执行步骤。
- 消除状态错乱、权限漏洞与元数据不一致问题。
- 为前端接入 Stripe Elements 提供稳定后端基础。

**适用范围**
- 后端项目：`E:\moxton-lotapi`
- 文档项目：`E:\moxton-docs`

---

## 1. 修复目标
1. 订单状态流转一致：支持 `PENDING → PAID → CONFIRMED → SHIPPED → DELIVERED`。
2. 支付链路闭环：创建支付意图、Webhook 处理、订单与支付记录状态一致。
3. 访客支付安全：强制 `X-Guest-ID` 校验，避免串单。
4. 元数据统一：所有 `metadata` 按 JSON 字符串存储与读取。

---

## 2. 当前问题摘要
1. **OrderStatus 枚举缺失 `CONFIRMED`**
   - 管理员无法设置 `CONFIRMED`，发货接口被锁死。
2. **`metadata` 字段写入类型不一致**
   - 多处直接写对象，字段类型为 `String`，易报错。
3. **订单未绑定支付记录**
   - 创建支付后未写回 `order.paymentId`。
4. **访客支付授权缺失**
   - 任意人可用 `orderId` 创建支付意图。

---

## 3. 修复范围与变更点

### 3.1 数据结构与状态
- **新增 OrderStatus 枚举值**：`CONFIRMED`
- **状态流转规则**：
  - `PENDING → PAID`（支付成功 Webhook）
  - `PAID → CONFIRMED`（自动确认）
  - `CONFIRMED → SHIPPED`（管理员发货）
  - `SHIPPED → DELIVERED`（管理员确认收货）
  - `PENDING → CANCELLED`（用户/管理员取消）

### 3.2 元数据规范
- **写入**：`metadata = JSON.stringify(object)`
- **读取**：`JSON.parse(metadata)`，并捕获解析错误。
- **涉及场景**：
  - 订单创建（写入 `guestId`）
  - 发货与收货确认（trackingNumber, deliveryNotes 等）
  - 支付过期处理
  - 订单取消

### 3.3 支付链路
- **创建支付意图时**：
  - 写回 `order.paymentId = payment.id`
  - 更新 `order.paymentStatus = PAYMENT_INITIATED`
  - 记录 `lastPaymentAttemptAt`

### 3.4 访客支付权限
- **强制校验**：
  - 请求头必须包含 `X-Guest-ID`
  - `X-Guest-ID` 必须等于 `order.metadata.guestId`
  - 不满足直接拒绝创建支付意图

---

## 4. 实施步骤（可直接执行）

### Step 1: 数据结构更新
1. 修改 `prisma/schema.prisma`：
   - `enum OrderStatus` 增加 `CONFIRMED`
2. 执行 Prisma 迁移：
   - `npx prisma migrate dev -n add_confirmed_status`

### Step 2: 订单状态逻辑统一
1. 校验管理员更新状态时允许 `CONFIRMED`
2. 支付成功 Webhook 流程：
   - `PENDING → PAID`
   - 自动 `PAID → CONFIRMED`

### Step 3: metadata 统一处理
1. 所有写入 `metadata` 的位置改为 `JSON.stringify`
2. 所有读取 `metadata` 位置加 `try/catch` 解析

### Step 4: 支付意图创建补齐绑定
1. 创建 payment 后立即写回 `order.paymentId`
2. 同步更新 `paymentStatus` 与 `lastPaymentAttemptAt`

### Step 5: 访客支付校验
1. 在支付意图创建逻辑中校验 `X-Guest-ID`
2. 拒绝不匹配的访客请求

---

## 5. 验证清单

### 5.1 订单创建
- `POST /orders/checkout` 返回订单
- 确认 `metadata.guestId` 存在

### 5.2 创建支付意图
- `POST /payments/stripe/create-intent`
- 携带 `X-Guest-ID`
- 返回 `clientSecret` + `paymentIntentId`

### 5.3 Stripe 测试支付
- 使用测试卡：`4242 4242 4242 4242`
- 验证订单状态变为 `PAID → CONFIRMED`

### 5.4 发货与收货
- `PUT /orders/admin/:id/ship` 仅 `CONFIRMED` 可执行
- `PUT /orders/admin/:id/deliver` 仅 `SHIPPED` 可执行

---

## 6. 风险与回滚
- 若 Webhook 处理异常：
  - 暂停非必要事件处理
  - 保留 `payment_intent.succeeded` 基础逻辑
- 若 `CONFIRMED` 状态迁移影响现有数据：
  - 可暂时将支付成功后只保留 `PAID`

---

## 7. 交付物
- 修复后端逻辑
- 验证通过的 Stripe 测试链路
- 更新后的接口文档与状态说明

---

**文档结束**
