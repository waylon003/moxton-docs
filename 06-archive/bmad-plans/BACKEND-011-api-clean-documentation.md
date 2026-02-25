# Moxton Lot API - 接口文档

**服务地址**: http://localhost:3033

## 认证系统

### 登录
```
POST /auth/login
```

**请求参数**:
```json
{
  "email": "string",
  "password": "string"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // JWT访问令牌
    "user": {
      "id": "clx1234567890",                              // 用户唯一标识
      "username": "testuser",                             // 用户名
      "email": "test@example.com",                        // 邮箱地址
      "nickname": "测试用户",                              // 用户昵称
      "phone": "13800138000",                             // 手机号码
      "avatar": "https://example.com/avatar.jpg",         // 头像URL
      "role": "user",                                     // 用户角色 (admin/user)
      "status": 1,                                        // 用户状态 (1:启用 0:禁用)
      "createdAt": "2025-12-18T10:00:00.000Z",           // 创建时间
      "updatedAt": "2025-12-18T10:00:00.000Z"            // 更新时间
    }
  },
  "timestamp": "2025-12-18T10:00:00.000Z",                // 响应时间戳
  "success": true                                        // 请求是否成功
}
```

### 获取当前用户信息
```
GET /auth/me
```

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": "clx1234567890",
    "username": "testuser",
    "email": "test@example.com",
    "nickname": "测试用户",
    "phone": "13800138000",
    "avatar": "https://example.com/avatar.jpg",
    "role": "user",
    "status": 1
  },
  "timestamp": "2025-12-18T10:00:00.000Z",
  "success": true
}
```

## 用户管理

### 获取用户列表
```
GET /users?pageNum=1&pageSize=10&keyword=搜索词
```

**请求参数**:
- `pageNum`: 页码（默认1）
- `pageSize`: 每页数量（默认10）
- `keyword`: 搜索关键词

**响应示例**:
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "list": [                                            // 用户列表
      {
        "id": "clx1234567890",                          // 用户ID
        "username": "testuser",                         // 用户名
        "email": "test@example.com",                    // 邮箱
        "nickname": "测试用户",                          // 昵称
        "role": "user",                                 // 角色 (admin/user)
        "status": 1,                                    // 状态 (1:启用 0:禁用)
        "createdAt": "2025-12-18T10:00:00.000Z"       // 创建时间
      }
    ],
    "pageNum": 1,                                       // 当前页码
    "pageSize": 10,                                     // 每页数量
    "total": 1,                                         // 总记录数
    "totalPages": 1                                     // 总页数
  },
  "timestamp": "2025-12-18T10:00:00.000Z",
  "success": true
}
```

### 更新用户信息
```
PUT /users/:id
```

**请求参数**:
```json
{
  "nickname": "string",
  "phone": "string",
  "avatar": "string"
}
```

## 分类管理

### 获取分类列表
```
GET /categories?level=1&parentId=分类ID&status=1
```

**请求参数**:
- `level`: 分类层级
- `parentId`: 父分类ID
- `status`: 状态（1启用，0禁用）

**响应示例**:
```json
{
  "code": 200,
  "message": "Success",
  "data": [                                             // 分类列表
    {
      "id": "clx1234567890",                            // 分类ID
      "name": "电子产品",                               // 分类名称
      "description": "电子设备分类",                    // 分类描述
      "parentId": null,                                 // 父分类ID (null表示顶级分类)
      "level": 1,                                       // 分类层级
      "sort": 0,                                        // 排序权重
      "status": 1,                                      // 状态 (1:启用 0:禁用)
      "createdAt": "2025-12-18T10:00:00.000Z",         // 创建时间
      "children": [                                     // 子分类列表
        {
          "id": "clx1234567891",                        // 子分类ID
          "name": "手机",                               // 子分类名称
          "parentId": "clx1234567890",                  // 父分类ID
          "level": 2,                                   // 分类层级
          "sort": 0,                                    // 排序权重
          "status": 1                                   // 状态
        }
      ]
    }
  ],
  "timestamp": "2025-12-18T10:00:00.000Z",
  "success": true
}
```

### 创建分类
```
POST /categories
```

**请求参数**:
```json
{
  "name": "string",
  "description": "string",
  "parentId": "string",
  "level": 1,
  "sort": 0
}
```

## 商品管理

### 商品类型说明
Moxton Lot API 支持两种商品类型，通过 `price` 字段区分：

#### 1. 在线购买商品
**特征**: `price` 字段有值（大于0）
**用途**: 直接在线下单购买，支持购物车和在线支付
**流程**: 商品浏览 → 加入购物车 → 结算下单 → 在线支付 → 发货配送

**示例**:
```json
{
  "id": "clx1234567890",
  "name": "iPhone 15",
  "price": 1299.00,                                     // 有价格，可在线购买
  "stock": 100,
  "status": 1                                           // 上架状态
}
```

#### 2. 线下咨询商品
**特征**: `price` 字段为空或null
**用途**: 无需立即付款，通过线下咨询了解详情和报价
**流程**: 商品浏览 → 提交咨询申请 → 商家联系 → 线下沟通 → 报价成交

**示例**:
```json
{
  "id": "clx1234567891",
  "name": "企业级解决方案咨询",
  "price": null,                                        // 无价格，需线下咨询
  "stock": null,                                        // 无库存概念
  "status": 1                                           // 上架状态
}
```

### 获取商品列表
```
GET /products?pageNum=1&pageSize=10&categoryId=分类ID&status=1&keyword=搜索词
```

**响应示例**:
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "list": [                                            // 商品列表
      {
        "id": "clx1234567890",                          // 商品ID
        "name": "iPhone 15",                             // 商品名称
        "description": "最新款苹果手机",                 // 商品简短描述
        "content": "<p>详细商品描述...</p>",             // 商品详情富文本内容
        "price": 1299.00,                                // 现价（null表示线下咨询商品）
        "originalPrice": 1499.00,                        // 原价（仅在线商品）
        "hasPrice": true,                                // 是否有价格（true=在线购买，false=线下咨询）
        "stock": 100,                                    // 库存数量（仅在线商品）
        "categoryId": "clx1234567891",                  // 分类ID
        "images": [                                      // 商品图片URL数组
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg"
        ],
        "specifications": "{\"color\": \"黑色\", \"storage\": \"256GB\"}",  // 商品规格JSON
        "tags": "[\"热销\", \"新品\"]",                  // 商品标签JSON数组
        "status": 1,                                     // 状态 (1:上架 0:下架)
        "isDeleted": false,                              // 逻辑删除状态
        "createdAt": "2025-12-18T10:00:00.000Z",         // 创建时间
        "category": {                                    // 关联分类信息
          "id": "clx1234567891",                        // 分类ID
          "name": "手机"                                 // 分类名称
        }
      },
      {
        "id": "clx1234567892",
        "name": "企业级IT咨询服务",
        "description": "专业IT解决方案咨询",
        "content": "<p>提供企业级IT架构设计和咨询服务...</p>",
        "price": null,                                   // 无价格，线下咨询商品
        "originalPrice": null,                           // 无原价
        "hasPrice": false,                               // 无价格标记
        "stock": null,                                   // 无库存概念
        "categoryId": "clx1234567893",
        "images": [
          "https://example.com/consulting1.jpg"
        ],
        "specifications": "{\"serviceType\": \"IT咨询\", \"duration\": \"按需\"}",
        "tags": "[\"咨询\", \"企业服务\"]",
        "status": 1,
        "isDeleted": false,
        "createdAt": "2025-12-18T10:00:00.000Z",
        "category": {
          "id": "clx1234567893",
          "name": "咨询服务"
        }
      }
    ],
    "pageNum": 1,                                       // 当前页码
    "pageSize": 10,                                     // 每页数量
    "total": 2,                                         // 总记录数
    "totalPages": 1                                     // 总页数
  },
  "timestamp": "2025-12-18T10:00:00.000Z",
  "success": true
}
```

### 商品筛选说明
**按商品类型筛选**:
- 在线购买商品：`hasPrice=true` 或 `price>0`
- 线下咨询商品：`hasPrice=false` 或 `price=null`

**前端处理建议**:
```javascript
// 前端可根据 hasPrice 字段判断商品类型
if (product.hasPrice) {
  // 在线购买商品：显示"加入购物车"、"立即购买"按钮
  showShoppingCartButton(product)
} else {
  // 线下咨询商品：显示"立即咨询"按钮
  showConsultationButton(product)
}
```

### 获取商品详情
```
GET /products/:id
```

### 创建商品
```
POST /products
```

**请求参数**:
```json
{
  "name": "string",
  "description": "string",
  "content": "string",
  "price": "1299.00",
  "originalPrice": "1499.00",
  "stock": 100,
  "categoryId": "string",
  "images": ["url1", "url2"],
  "specifications": {},
  "tags": ["tag1"]
}
```

## 订单管理

### 创建订单（支持游客下单）
```
POST /orders
```

**认证**: 可选认证（支持游客和登录用户）
**请求头**: `X-Guest-ID: 游客ID` (游客用户必填)

**请求参数**:
```json
{
  "items": [
    {
      "productId": "clx1234567892",                     // 商品ID
      "quantity": 2                                     // 购买数量
    }
  ],
  "guestInfo": {                                        // 游客信息（游客下单必填，登录用户下单可忽略）
    "name": "张三",                                     // 游客姓名
    "email": "zhang@example.com",                       // 游客邮箱
    "phone": "+86-13800138000",                         // 游客电话
    "company": "测试公司"                                // 游客公司（可选）
  },
  "address": {                                          // 收货地址结构化
    "addressLine1": "123 Main Street",                  // 地址行1
    "addressLine2": "Apt 4B",                           // 地址行2（可选）
    "city": "Sydney",                                   // 城市
    "state": "NSW",                                     // 州/省
    "postalCode": "2000",                               // 邮编
    "country": "Australia",                             // 国家
    "countryCode": "AU"                                 // 国家代码
  },
  "totalAmount": 2598.00,                               // 订单总金额
  "remarks": "请尽快发货"                               // 订单备注（可选）
}
```

**响应示例**:
```json
{
  "code": 201,
  "message": "Order created successfully",
  "data": {
    "id": "cmjbbtyw30000vf8g6bbietki",                 // 订单数据库ID
    "orderNo": "ORD17660554764519925",                 // 订单业务号（唯一）
    "customer": {                                       // 客户信息
      "name": "张三",                                   // 客户姓名
      "email": "zhang@example.com",                     // 客户邮箱（完整显示）
      "phone": "+86-13800138000",                       // 客户电话（完整显示）
      "company": "测试公司",                            // 客户公司
      "isGuest": true                                   // 是否为游客订单
    },
    "address": {                                        // 收货地址
      "addressLine1": "123 Main Street",
      "addressLine2": "Apt 4B",
      "city": "Sydney",
      "state": "NSW",
      "postalCode": "2000",
      "country": "Australia",
      "countryCode": "AU"
    },
    "amount": {
      "total": 2598.00,                                // 订单总金额
      "currency": "AUD"                                 // 货币类型
    },
    "items": [                                          // 订单项列表
      {
        "product": {
          "id": "clx1234567892",                        // 商品ID
          "name": "iPhone 15",                           // 商品名称
          "image": "https://example.com/image1.jpg"     // 商品主图
        },
        "quantity": 2,                                  // 购买数量
        "unitPrice": 1299.00,                           // 商品单价
        "subtotal": 2598.00                             // 小计金额
      }
    ],
    "status": "PENDING",                                // 订单状态 (PENDING/PAID/CONFIRMED/SHIPPED/DELIVERED/CANCELLED)
    "timestamps": {
      "created": "2025-12-18T10:00:00.000Z",           // 创建时间
      "updated": "2025-12-18T10:00:00.000Z"            // 更新时间
    },
    "remarks": "请尽快发货"                             // 订单备注
  },
  "timestamp": "2025-12-18T10:00:00.000Z",
  "success": true
}
```

### 购物车结算（推荐使用）
```
POST /orders/checkout
```

**认证**: 可选认证（支持游客和登录用户）
**请求头**: `X-Guest-ID: 游客ID` (游客用户必填)
**功能**: 从购物车直接结算创建订单，无需指定items和totalAmount（系统自动计算）

**请求参数**:
```json
{
  "guestInfo": {                                        // 游客信息（游客下单必填）
    "name": "李四",                                     // 游客姓名
    "email": "guest@example.com",                       // 游客邮箱
    "phone": "+86-13900139000",                         // 游客电话
    "company": "测试公司"                                // 游客公司（可选）
  },
  "shippingAddress": {                                  // 收货地址
    "addressLine1": "Lalaguli Drive",                  // 地址行1
    "addressLine2": "",                                 // 地址行2（可选）
    "city": "Toormina",                                 // 城市
    "state": "New South Wales",                         // 州/省
    "postalCode": "2452",                               // 邮编
    "country": "Australia",                             // 国家
    "countryCode": "AU"                                 // 国家代码
  },
  "remarks": "请包装仔细"                               // 订单备注（可选）
  // 注意：不需要 items 字段（从购物车获取）
  // 注意：不需要 totalAmount 字段（系统自动计算）
}
```

**响应示例**: 同创建订单响应格式

### 获取用户订单列表
```
GET /orders/user?pageNum=1&pageSize=10&status=PENDING
```

**认证**: 必须认证（仅限登录用户）

**请求参数**:
- `pageNum`: 页码（默认1）
- `pageSize`: 每页数量（默认10）
- `status`: 订单状态筛选（可选）

### 获取订单详情
```
GET /orders/:id
```

**认证**: 必须认证（仅限登录用户，只能查看自己的订单）

### 取消订单
```
PUT /orders/:id/cancel
```

**认证**: 可选认证（支持游客和登录用户，只能取消自己的订单）
**请求头**: `X-Guest-ID: 游客ID` (游客用户必填)

**请求参数**:
```json
{
  "reason": "取消原因"                                   // 取消原因（可选）
}
```

### 游客订单管理

#### 获取游客订单列表
```
GET /orders/guest/orders
```

**认证**: 可选认证（推荐使用X-Guest-ID）
**请求头**: `X-Guest-ID: 游客ID` (必填)
**功能**: 基于X-Guest-ID获取该游客的所有订单

#### 获取特定游客订单
```
GET /orders/guest/orders/:id
```

**认证**: 可选认证
**请求头**: `X-Guest-ID: 游客ID` (必填)
**功能**: 获取特定游客订单详情（验证订单归属）

#### 游客订单查询
```
GET /orders/guest/query?email=xxx&phone=xxx&orderNo=xxx
```

**认证**: 无需认证
**功能**: 游客通过邮箱、电话或订单号查询自己的订单
**请求参数**:
- `email`: 邮箱地址
- `phone`: 电话号码
- `orderNo`: 订单号
（至少提供一个查询条件）

### 管理员订单管理

#### 获取所有订单列表
```
GET /orders/admin?pageNum=1&pageSize=10&status=PENDING
```

**认证**: 必须认证 + 管理员权限

#### 管理员发货
```
PUT /orders/admin/:id/ship
```

**认证**: 必须认证 + 管理员权限

**请求参数**:
```json
{
  "trackingNumber": "SF1234567890",                     // 快递单号（可选）
  "shippingCompany": "顺丰快递",                        // 快递公司（可选）
  "remarks": "已发货"                                   // 备注信息（可选）
}
```

#### 管理员确认收货
```
PUT /orders/admin/:id/deliver
```

**认证**: 必须认证 + 管理员权限

**请求参数**:
```json
{
  "deliveryRemarks": "客户已确认收货"                     // 交付备注（可选）
}
```

#### 更新订单状态
```
PUT /orders/admin/:id/status
```

**认证**: 必须认证 + 管理员权限

**请求参数**:
```json
{
  "status": "CONFIRMED",                                // 新订单状态
  "reason": "状态更新原因"                               // 更新原因（可选）
}
```

#### 获取订单统计
```
GET /orders/admin/stats/all
```

**认证**: 必须认证 + 管理员权限

**响应示例**:
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "totalOrders": 1250,                               // 总订单数
    "pendingOrders": 85,                               // 待处理订单
    "paidOrders": 320,                                 // 已支付订单
    "shippedOrders": 650,                              // 已发货订单
    "deliveredOrders": 180,                            // 已送达订单
    "cancelledOrders": 15,                             // 已取消订单
    "totalRevenue": 285000.50,                         // 总收入
    "averageOrderValue": 228.00                        // 平均订单价值
  },
  "timestamp": "2025-12-18T10:00:00.000Z",
  "success": true
}
```

## 购物车管理

### 获取购物车
```
GET /cart
```

**认证**: 可选认证（支持游客和登录用户）
**请求头**: `X-Guest-ID: 游客ID` (游客用户必填)

**响应示例**:
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": "clx1234567890",                              // 购物车ID
    "status": "ACTIVE",                                 // 购物车状态 (ACTIVE/EXPIRED/CHECKEDOUT)
    "totalAmount": 2598.00,                             // 购物车总金额（实时计算）
    "itemCount": 2,                                     // 商品总数量
    "selectedCount": 2,                                 // 已选中商品数量
    "selectedAmount": 2598.00,                          // 已选中商品总金额
    "items": [                                          // 购物车项列表
      {
        "id": "clx1234567891",                          // 购物车项ID
        "productId": "clx1234567892",                   // 商品ID
        "quantity": 2,                                  // 商品数量
        "selected": true,                               // 是否选中结算
        "product": {                                    // 关联商品信息
          "id": "clx1234567892",                        // 商品ID
          "name": "iPhone 15",                           // 商品名称
          "price": 1299.00,                             // 商品现价（从商品表获取）
          "originalPrice": 1499.00,                     // 商品原价
          "stock": 100,                                 // 库存数量
          "images": ["https://example.com/image1.jpg"]  // 商品图片
        },
        "subtotal": 2598.00                             // 该商品小计金额（实时计算）
      }
    ]
  },
  "timestamp": "2025-12-18T10:00:00.000Z",
  "success": true
}
```

### 添加商品到购物车
```
POST /cart
```

**认证**: 可选认证（支持游客和登录用户）
**请求头**: `X-Guest-ID: 游客ID` (游客用户必填)

**请求参数**:
```json
{
  "productId": "clx1234567892",                         // 商品ID
  "quantity": 1                                        // 商品数量（正整数）
}
```

**响应示例**:
```json
{
  "code": 201,
  "message": "Item added to cart successfully",
  "data": {
    "cartItemId": "clx1234567891",                      // 新增的购物车项ID
    "cartTotalAmount": 1299.00,                         // 购物车总金额
    "cartItemCount": 1                                  // 购物车商品总数
  },
  "timestamp": "2025-12-18T10:00:00.000Z",
  "success": true
}
```

### 更新购物车商品数量
```
PUT /cart/item/:itemId
```

**认证**: 可选认证（支持游客和登录用户）
**请求头**: `X-Guest-ID: 游客ID` (游客用户必填)

**请求参数**:
```json
{
  "quantity": 3                                         // 新的商品数量（正整数）
}
```

### 删除购物车商品
```
DELETE /cart/item/:itemId
```

**认证**: 可选认证（支持游客和登录用户）
**请求头**: `X-Guest-ID: 游客ID` (游客用户必填)

### 清空购物车
```
DELETE /cart/clear
```

**认证**: 可选认证（支持游客和登录用户）
**请求头**: `X-Guest-ID: 游客ID` (游客用户必填)

### 获取购物车统计
```
GET /cart/summary
```

**认证**: 可选认证（支持游客和登录用户）
**请求头**: `X-Guest-ID: 游客ID` (游客用户必填)

**响应示例**:
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "itemCount": 5,                                     // 商品总数量
    "selectedCount": 3,                                 // 已选中商品数量
    "totalAmount": 4597.00,                             // 购物车总金额
    "selectedAmount": 3298.00,                          // 已选中商品总金额
    "totalWeight": 2.5,                                 // 商品总重量
    "discountAmount": 100.00                            // 优惠金额
  },
  "timestamp": "2025-12-18T10:00:00.000Z",
  "success": true
}
```

### 批量更新商品选中状态
```
PUT /cart/selection
```

**认证**: 可选认证（支持游客和登录用户）
**请求头**: `X-Guest-ID: 游客ID` (游客用户必填)

**请求参数**:
```json
{
  "itemIds": ["clx1234567891", "clx1234567892"],       // 购物车项ID数组
  "selected": true                                     // 选中状态
}
```

### 批量删除购物车商品
```
DELETE /cart/batch
```

**认证**: 可选认证（支持游客和登录用户）
**请求头**: `X-Guest-ID: 游客ID` (游客用户必填)

**请求参数**:
```json
{
  "itemIds": ["clx1234567891", "clx1234567892"]        // 要删除的购物车项ID数组
}
```

### 批量更新商品数量
```
PUT /cart/batch
```

**认证**: 可选认证（支持游客和登录用户）
**请求头**: `X-Guest-ID: 游客ID` (游客用户必填)

**请求参数**:
```json
{
  "items": [
    {
      "itemId": "clx1234567891",                       // 购物车项ID
      "quantity": 2                                    // 新数量
    },
    {
      "itemId": "clx1234567892",                       // 购物车项ID
      "quantity": 1                                    // 新数量
    }
  ]
}
```

### 合并购物车（登录用户）
```
POST /cart/merge
```

**认证**: 必须认证（仅限登录用户）
**功能**: 将游客购物车合并到登录用户购物车

### 验证购物车
```
GET /cart/validate
```

**认证**: 可选认证（支持游客和登录用户）
**请求头**: `X-Guest-ID: 游客ID` (游客用户必填)
**功能**: 验证购物车商品库存、价格变化等

**响应示例**:
```json
{
  "code": 200,
  "message": "Cart validation completed",
  "data": {
    "isValid": true,                                    // 购物车是否有效
    "invalidItems": [],                                 // 无效商品列表
    "priceChanges": [],                                 // 价格变化列表
    "stockIssues": [],                                  // 库存问题列表
    "newTotalAmount": 2598.00                          // 验证后的总金额
  },
  "timestamp": "2025-12-18T10:00:00.000Z",
  "success": true
}
```

## 支付系统

### 创建支付意图（支持游客和登录用户）
```
POST /payments/stripe/create-intent
```

**认证**: 可选认证（支持游客和登录用户）
**请求头**: `X-Guest-ID: 游客ID` (游客用户必填)

**请求参数**:
```json
{
  "orderId": "cmjbbtyw30000vf8g6bbietki",              // 订单数据库ID
  "userId": null,                                       // 用户ID（游客订单为null，登录用户订单为用户ID）
  "deviceInfo": {                                       // 设备信息（可选）
    "userAgent": "Mozilla/5.0...",                      // 用户代理
    "ip": "127.0.0.1"                                   // IP地址
  },
  "clientIp": "127.0.0.1"                               // 客户端IP地址
}
```

**响应示例**:
```json
{
  "code": 201,
  "message": "Payment intent created successfully",
  "data": {
    "clientSecret": "pi_1234567890_secret_abcdef",       // 客户端密钥（用于前端Stripe Elements）
    "publishableKey": "pk_test_1234567890",              // Stripe可发布密钥
    "paymentIntentId": "pi_1234567890",                  // Stripe支付意图ID
    "paymentId": "pay_1234567890",                       // 系统支付记录ID
    "amount": 2598.00,                                   // 支付金额
    "currency": "AUD",                                   // 货币类型
    "expiresAt": "2025-12-19T10:00:00.000Z"              // 支付意图过期时间（24小时）
  },
  "timestamp": "2025-12-18T10:00:00.000Z",
  "success": true
}
```

### 查询支付状态
```
GET /payments/stripe/status/:paymentIntentId
```

**认证**: 可选认证（支持游客和登录用户）

**响应示例**:
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "status": "succeeded",                              // Stripe官方状态（requires_payment_method, requires_confirmation, requires_action, processing, succeeded, canceled）
    "requiresAction": false,                            // 是否需要进一步操作
    "nextActionType": null,                             // 下一步操作类型
    "lastPaymentError": null,                           // 最后一次支付错误信息
    "amount": 259800,                                    // 支付金额（分为单位）
    "currency": "aud"                                    // 货币类型
  },
  "timestamp": "2025-12-18T10:05:00.000Z",
  "success": true
}
```

### Stripe Webhook处理
```
POST /payments/stripe/webhook
```

**认证**: 无需认证（通过Stripe签名验证）
**请求头**: `stripe-signature: Stripe webhook签名`
**功能**: 处理Stripe支付状态变更webhook，自动更新订单和支付状态

**支持的事件类型**:
- `payment_intent.succeeded` - 支付成功（自动将订单状态更新为PAID并流转到CONFIRMED）
- `payment_intent.payment_failed` - 支付失败
- `payment_intent.canceled` - 支付取消

### 获取支付历史
```
GET /payments/history?pageNum=1&pageSize=10&status=SUCCESS
```

**认证**: 必须认证（仅限登录用户）

**请求参数**:
- `pageNum`: 页码（默认1）
- `pageSize`: 每页数量（默认10）
- `status`: 支付状态筛选（PENDING, SUCCESS, FAILED, CANCELLED）

**响应示例**:
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "list": [
      {
        "id": "pay_1234567890",                          // 支付记录ID
        "paymentNo": "PAY1701234567890ABCDEF",           // 支付单号
        "orderId": "cmjbbtyw30000vf8g6bbietki",          // 订单ID
        "orderNo": "ORD17660554764519925",               // 订单号
        "amount": 2598.00,                               // 支付金额
        "currency": "AUD",                               // 货币类型
        "paymentMethod": "STRIPE",                       // 支付方式
        "status": "SUCCESS",                             // 支付状态
        "paymentIntentId": "pi_1234567890",              // Stripe支付意图ID
        "providerPaymentId": "pi_1234567890",            // 支付商支付ID
        "receiptUrl": "https://stripe.com/receipts/...",  // 收据URL
        "paidAt": "2025-12-18T10:05:00.000Z",            // 支付完成时间
        "createdAt": "2025-12-18T10:00:00.000Z",         // 创建时间
        "order": {                                       // 关联订单信息
          "id": "cmjbbtyw30000vf8g6bbietki",
          "orderNo": "ORD17660554764519925",
          "totalAmount": 2598.00,
          "status": "CONFIRMED"
        }
      }
    ],
    "pageNum": 1,                                       // 当前页码
    "pageSize": 10,                                     // 每页数量
    "total": 1,                                         // 总记录数
    "totalPages": 1                                     // 总页数
  },
  "timestamp": "2025-12-18T10:00:00.000Z",
  "success": true
}
```

## 支付状态说明

### 支付状态流转
1. **PENDING** - 支付初始化，等待用户支付
2. **PAYMENT_INITIATED** - 支付意图已创建，等待Stripe处理
3. **PROCESSING** - 支付处理中
4. **SUCCESS** - 支付成功（订单自动流转到CONFIRMED状态）
5. **FAILED** - 支付失败（订单保持PENDING状态，允许重试）
6. **CANCELLED** - 支付取消（订单保持PENDING状态）

### 订单状态自动流转
- 支付成功后：`PENDING` → `PAID` → `CONFIRMED`（自动流转）
- 支付失败后：订单保持`PENDING`状态，用户可重新发起支付
- 支付取消后：订单保持`PENDING`状态，用户可重新发起支付

### 支付安全特性
- **Webhook签名验证**: 所有Stripe webhook请求都经过签名验证
- **幂等性保护**: 使用幂等性键防止重复创建支付意图
- **支付过期时间**: 支付意图24小时后自动过期
- **库存二次验证**: 支付成功前再次验证商品库存
- **Redis缓存去重**: 防止webhook事件重复处理

## 文件上传

### 单文件上传
```
POST /upload/single
```

**请求参数**: FormData
- `file`: 文件
- `type`: 文件类型（products/avatars/documents）

**响应示例**:
```json
{
  "code": 201,
  "message": "File uploaded successfully",
  "data": {
    "url": "https://oss.moxton.cn/FLQ/products/image_20251218_100000.jpg",  // 文件访问URL
    "filename": "image_20251218_100000.jpg",                              // 文件名
    "size": 1024000,                                                       // 文件大小 (字节)
    "type": "image/jpeg"                                                   // 文件MIME类型
  },
  "timestamp": "2025-12-18T10:00:00.000Z",
  "success": true
}
```

## 地址管理

### Google Places 自动补全
```
GET /address/autocomplete?input=搜索文本&countryCode=AU
```

**响应示例**:
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "predictions": [
      {
        "place_id": "ChIJ1234567890abcdef",
        "description": "123 Main St, Sydney NSW, Australia",
        "structured_formatting": {
          "main_text": "123 Main St",
          "secondary_text": "Sydney NSW, Australia"
        }
      }
    ]
  },
  "timestamp": "2025-12-18T10:00:00.000Z",
  "success": true
}
```

### 根据Place ID获取地址详情
```
GET /address/place/:placeId
```

## 线下咨询订单

### 创建咨询订单
```
POST /offline-orders
```

**请求参数**:
```json
{
  "productId": "string",
  "name": "联系人姓名",
  "phone": "联系电话",
  "email": "邮箱",
  "company": "公司名称",
  "message": "咨询内容"
}
```

**响应示例**:
```json
{
  "code": 201,
  "message": "Consultation order created",
  "data": {
    "id": "clx1234567890",
    "productId": "clx1234567891",
    "name": "张三",
    "phone": "13800138000",
    "email": "zhang@example.com",
    "company": "ABC公司",
    "message": "想了解产品详情",
    "status": "PENDING",
    "createdAt": "2025-12-18T10:00:00.000Z"
  },
  "timestamp": "2025-12-18T10:00:00.000Z",
  "success": true
}
```

## 通知系统

### 获取通知列表
```
GET /notifications?pageNum=1&pageSize=10&isRead=false
```

**响应示例**:
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "list": [
      {
        "id": "clx1234567890",
        "title": "订单状态更新",
        "content": "您的订单已发货",
        "type": "ORDER",
        "isRead": false,
        "createdAt": "2025-12-18T10:00:00.000Z"
      }
    ],
    "pageNum": 1,
    "pageSize": 10,
    "total": 1,
    "totalPages": 1
  },
  "timestamp": "2025-12-18T10:00:00.000Z",
  "success": true
}
```

### 标记通知为已读
```
PUT /notifications/:id/read
```

## 系统信息

### 健康检查
```
GET /health
```

**响应示例**:
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "status": "ok",
    "timestamp": "2025-12-18T10:00:00.000Z",
    "uptime": 3600.5
  },
  "timestamp": "2025-12-18T10:00:00.000Z",
  "success": true
}
```

### 版本信息
```
GET /version
```

**响应示例**:
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "version": "1.0.0",
    "name": "Moxton Lot API",
    "environment": "development"
  },
  "timestamp": "2025-12-18T10:00:00.000Z",
  "success": true
}
```

## 认证机制

### 混合认证模式
Moxton Lot API 采用混合认证架构，同时支持游客用户和登录用户访问。

### 认证类型

#### 1. 强制认证 (`authMiddleware`)
**适用场景**: 需要用户身份验证的核心功能
- 用户个人信息管理
- 订单历史查看
- 支付历史查询
- 管理员功能

**请求头**:
```
Authorization: Bearer <JWT_TOKEN>
```

#### 2. 可选认证 (`optionalAuthMiddleware`)
**适用场景**: 支持游客和登录用户的公共功能
- 商品浏览
- 购物车管理
- 订单创建（支持游客下单）
- 支付处理（支持游客支付）

**请求头**:
```
Authorization: Bearer <JWT_TOKEN>  // 可选
X-Guest-ID: <GUEST_ID>             // 游客用户必填
```

### 游客用户管理

#### X-Guest-ID 头部
**用途**: 标识和追踪游客用户的会话状态
**格式**: 唯一字符串标识符
**示例**: `miwz48k0_5bug7oe21t4_AABJRU5E`

**使用规则**:
- 游客访问时必须提供 `X-Guest-ID` 头部
- 系统根据 `X-Guest-ID` 关联游客的购物车和订单
- 前端应确保同一游客使用一致的 `X-Guest-ID`

#### 游客订单归属验证
系统通过以下方式验证游客订单归属：
1. 订单创建时记录 `X-Guest-ID`
2. 游客查询订单时验证 `X-Guest-ID` 匹配
3. 游客通过邮箱/电话查询时验证订单信息匹配

### 认证中间件说明

#### authMiddleware
```typescript
// 强制要求用户登录认证
// 验证 Authorization: Bearer <token>
// 无效token时返回 401 Unauthorized
router.get('/profile', authMiddleware, userProfile)
```

#### optionalAuthMiddleware
```typescript
// 支持游客和登录用户
// 有token时验证用户身份，无token时设为游客
// 始终允许访问，在控制器中区分用户类型
router.get('/products', optionalAuthMiddleware, getProducts)
```

#### adminMiddleware
```typescript
// 管理员权限验证
// 验证用户角色为 admin
// 无权限时返回 403 Forbidden
router.get('/admin/orders', adminMiddleware, getAdminOrders)
```

### 用户身份识别
在控制器中可通过 `ctx.state.user` 获取用户信息：

```typescript
// 登录用户
if (ctx.state.user) {
  const userId = ctx.state.user.id
  const userRole = ctx.state.user.role
  // 处理登录用户逻辑
} else {
  // 游客用户，使用 X-Guest-ID
  const guestId = ctx.headers['x-guest-id']
  // 处理游客逻辑
}
```

### 权限矩阵

| 功能模块 | 游客访问 | 登录用户 | 管理员 |
|---------|---------|---------|--------|
| 商品浏览 | ✅ | ✅ | ✅ |
| 购物车管理 | ✅ (需X-Guest-ID) | ✅ | ✅ |
| 创建订单 | ✅ (需X-Guest-ID+guestInfo) | ✅ | ✅ |
| 订单查询 | ✅ (仅自己的订单) | ✅ (仅自己的订单) | ✅ (所有订单) |
| 支付处理 | ✅ (需X-Guest-ID) | ✅ | ✅ |
| 用户管理 | ❌ | ✅ (自己) | ✅ |
| 管理员功能 | ❌ | ❌ | ✅ |

### 安全特性
- JWT Token 有效期管理
- Token 自动刷新机制
- 游客会话隔离
- 权限分级控制
- API 访问频率限制

## 统一响应格式

所有API响应都遵循以下格式：

```json
{
  "code": 200,                                          // 响应状态码
  "message": "Success",                                // 响应消息
  "data": {},                                          // 响应数据
  "timestamp": "2025-12-18T10:00:00.000Z",             // 响应时间戳
  "success": true                                      // 请求是否成功
}
```

### 分页响应格式

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "list": [], // 数据列表
    "total": 100, // 总数量
    "pageNum": 1, // 当前页码
    "pageSize": 10, // 每页数量
    "totalPages": 10 // 总页数
  },
  "timestamp": "2025-12-02T10:00:00.000Z",
  "success": true
}
```

**状态码说明**:
- `200`: 成功
- `201`: 创建成功
- `400`: 客户端错误（参数错误）
- `401`: 未授权
- `403`: 禁止访问
- `404`: 资源不存在
- `500`: 服务器错误